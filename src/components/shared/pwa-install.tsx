"use client";

/**
 * GRANMED.STORE — PWA : enregistrement du service worker + invite d'installation.
 *
 * Invite d'installation ultra-élégante :
 *  - voile plein écran qui floute TOUT le contenu arrière (backdrop-blur) ;
 *  - texte de 3 mots ultra incitatif (« Installez. Jouez. Gagnez. » / « Install. Play. Win. ») ;
 *  - n'apparaît que si le navigateur peut installer (beforeinstallprompt) ;
 *  - cesse définitivement d'apparaître une fois l'app installée (appinstalled / standalone) ;
 *  - fermeture sans installer → mémorisée pour la SESSION en cours uniquement
 *    (sessionStorage) : l'invite revient à la prochaine ouverture de l'app,
 *    jamais à chaque rafraîchissement ;
 *  - courtoisie : n'interrompt jamais une partie en cours (#game-board actif).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import { acquireScrollLock, releaseScrollLock } from "@/lib/scroll-lock";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

interface GranmedPwaState {
  bip: BeforeInstallPromptEvent | null;
  dismissed: boolean;
  standalone: boolean;
  installed: boolean;
  showAfter: number;
}

declare global {
  interface Window {
    __granmedPwa?: GranmedPwaState;
  }
}

const DISMISS_KEY = "granmed:pwa-dismissed";
const SHOW_DELAY_MS = 2600;
const TICK_MS = 800;
const OVERLAY_Z = "z-[100]";

const COPY = {
  fr: {
    headline: "Installez. Jouez. Gagnez.",
    install: "Installer",
    close: "Fermer",
    installedToast: "🎉 Granmed installé !",
  },
  en: {
    headline: "Install. Play. Win.",
    install: "Install",
    close: "Close",
    installedToast: "🎉 Granmed installed!",
  },
} as const;

type Lang = keyof typeof COPY;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function getLang(): Lang {
  if (typeof document === "undefined") return "fr";
  return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "fr";
}

/** État partagé — créé par le script inline du layout (capture précoce), sinon garanti ici. */
function ensureState(): GranmedPwaState {
  if (!window.__granmedPwa) {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* sessionStorage indisponible (navigation privée stricte) */
    }
    window.__granmedPwa = { bip: null, dismissed, standalone: isStandalone(), installed: false, showAfter: 0 };
  }
  return window.__granmedPwa;
}

/** Enregistrement du service worker — idempotent, mode volatile en dev (HMR protégé). */
let swRegistered = false;
function registerServiceWorker() {
  if (swRegistered || typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  swRegistered = true;
  const url = process.env.NODE_ENV === "production" ? "/sw.js" : "/sw.js?volatile=1";
  navigator.serviceWorker.register(url, { scope: "/" }).catch(() => {
    /* échec silencieux : l'app fonctionne parfaitement sans SW */
  });
}

export function PwaInstall() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const celebratedRef = useRef(false);
  const installBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    const state = ensureState();
    state.dismissed = true;
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* session privée : l'invite reviendra, comportement acceptable */
    }
    setOpen(false);
  }, []);

  const celebrateInstalled = useCallback(() => {
    const state = ensureState();
    state.bip = null;
    state.installed = true;
    setOpen(false);
    if (!celebratedRef.current) {
      celebratedRef.current = true;
      toast(COPY[getLang()].installedToast);
    }
  }, []);

  const install = useCallback(async () => {
    const state = ensureState();
    const bip = state.bip;
    if (!bip) {
      dismiss();
      return;
    }
    state.bip = null; // l'événement ne peut servir qu'une fois
    try {
      await bip.prompt();
      const choice = await bip.userChoice.catch(() => null);
      if (choice?.outcome === "accepted") {
        celebrateInstalled(); // appinstalled peut tarder : on n'attend pas
      } else {
        dismiss(); // refus du dialogue natif → tranquillité pour cette session
      }
    } catch {
      dismiss();
    }
  }, [celebrateInstalled, dismiss]);

  useEffect(() => {
    registerServiceWorker();
    ensureState();

    const onBip = (event: Event) => {
      event.preventDefault();
      const state = ensureState();
      state.bip = event as BeforeInstallPromptEvent;
      if (!state.showAfter) state.showAfter = Date.now() + SHOW_DELAY_MS;
    };
    const onInstalled = () => celebrateInstalled();
    const onLang = () => setLang(getLang());

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("hashchange", onLang);
    onLang();

    /* Si l'événement a déjà été capturé par le script inline, armer le délai. */
    const state = ensureState();
    if (state.bip && !state.showAfter) state.showAfter = Date.now() + SHOW_DELAY_MS;

    const tick = window.setInterval(() => {
      /* Langue toujours synchronisée (l'app pilote <html lang> via pushState,
         qui ne déclenche pas hashchange). */
      const nextLang = getLang();
      setLang((prev) => (prev === nextLang ? prev : nextLang));

      const s = ensureState();
      if (s.dismissed || s.installed || s.standalone || isStandalone()) return;
      if (!s.bip || !s.showAfter || Date.now() < s.showAfter) return;
      if (document.querySelector("#game-board")) {
        /* Courtoisie renforcée (Task 19) : si l'invite s'est ouverte sur
           l'accueil et que le joueur entre dans un jeu, elle S'EFFACE
           (sans compter comme un refus) et reviendra ~un tick après la
           sortie du jeu — l'écran de fin de manche reste LE dialogue
           à l'écran, sans superposition. */
        setOpen(false);
        return;
      }
      setOpen(true);
    }, TICK_MS);

    return () => {
      window.clearInterval(tick);
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("hashchange", onLang);
    };
  }, [celebrateInstalled]);

  /* Verrou de défilement + focus + Échap pendant l'ouverture du dialogue.
     Verrou à compteur partagé (correctif Task 24) : le mode immersif du
     GameShell verrouille lui aussi body.overflow — imbriqués (invite
     ouverte → entrée dans un jeu → courtoisie ferme l'invite), chaque
     surface restaurait « sa » valeur et la page restait figée après la
     sortie du jeu. */
  useEffect(() => {
    if (!open) return;
    acquireScrollLock();
    installBtnRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
        return;
      }
      /* Piège de focus clavier : Tab/Shift+Tab restent dans le dialogue. */
      if (event.key === "Tab") {
        event.preventDefault();
        const focusables = [installBtnRef.current, closeBtnRef.current].filter(Boolean);
        if (focusables.length === 0) return;
        const index = focusables.indexOf(document.activeElement as HTMLButtonElement);
        const next = focusables[(index + (event.shiftKey ? -1 : 1) + focusables.length) % focusables.length];
        (next as HTMLButtonElement).focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      releaseScrollLock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  const reducedMotion = useReducedMotion();
  const c = COPY[lang];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="granmed-pwa-overlay"
          className={`fixed inset-0 ${OVERLAY_Z} flex items-center justify-center bg-black/40 p-4 backdrop-blur-xl backdrop-saturate-100`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="granmed-pwa-headline"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <motion.div
            key="granmed-pwa-card"
            className="relative w-full max-w-[340px] rounded-[28px] border border-black/5 bg-card p-8 pt-10 text-center shadow-2xl dark:border-white/10"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.82, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 14 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              ref={closeBtnRef}
              onClick={dismiss}
              aria-label={c.close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/10 text-muted-foreground ring-1 ring-black/10 transition hover:rotate-90 hover:bg-black/20 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2725b] dark:bg-white/15 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/25 dark:hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="anim-glow mx-auto mb-5 h-24 w-24 overflow-hidden rounded-[26px] shadow-lg ring-1 ring-black/10">
              <img src="/icons/icon-512.png" alt="" width={96} height={96} className="h-full w-full" draggable={false} />
            </div>

            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#c2410c] dark:text-[#e8854f]">
              Granmed
            </p>
            <h2
              id="granmed-pwa-headline"
              className="font-display mt-1.5 bg-gradient-to-r from-[#e2725b] to-[#c2410c] bg-clip-text text-[28px] leading-[1.15] font-bold text-transparent dark:from-[#e8854f] dark:to-[#f0a562]"
            >
              {c.headline}
            </h2>

            <motion.button
              type="button"
              ref={installBtnRef}
              onClick={install}
              className="anim-glow mt-7 flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-base font-extrabold text-white shadow-lg transition hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2725b] active:scale-[0.97]"
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              {c.install}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PwaInstall;
