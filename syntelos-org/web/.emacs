; jdp
; 2006/05/05

;;
(setq inhibit-splash-screen t)

;; tab = 4 sp
(setq default-tab-width 4)

;; no tabs, just sp
(setq-default indent-tabs-mode nil)

;(setq default-frame-alist '((width . 125) (height . 80)))

(setq default-frame-alist '((width . 125) (height . 80)
			    (background-color  . "white")
			    (foreground-color . "darkslategray")
			    (cursor-color . "darkslategray")
			    (mouse-color . "darkslategray")))

(if (fboundp 'scroll-bar-mode) (scroll-bar-mode -1))
(if (fboundp 'tool-bar-mode) (tool-bar-mode -1))
(if (fboundp 'menu-bar-mode) (menu-bar-mode -1))

(add-to-list 'auto-mode-alist '("\\.jnlp" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.sxb" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.sxa" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.svg" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.css" . c-mode))
(add-to-list 'auto-mode-alist '("\\.js" . java-mode))
(add-to-list 'auto-mode-alist '("\\.tag" . java-mode))
(add-to-list 'auto-mode-alist '("\\.sp" . java-mode))
(add-to-list 'auto-mode-alist '("\\.js\\.xml" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.compilation" . compilation-mode))
(add-to-list 'auto-mode-alist '("\\.outline" . outline-mode))
(add-to-list 'auto-mode-alist '("\\.outline.txt" . outline-mode))

(global-set-key "\M-z" 'compile)

(global-set-key "\M-r" 'revert-buffer)

(global-set-key "\M-%" 'query-replace-regexp)

(global-set-key (kbd "C-c  g") 'goto-line)

(global-set-key (kbd "C-x  x") 'copy-to-register)

(global-set-key (kbd "C-x  g") 'insert-register)

(global-font-lock-mode 1)

(put 'upcase-region 'disabled nil)
(put 'downcase-region 'disabled nil)

(setq compile-command "./build.sh")

(setq initial-frame-alist default-frame-alist)

(setq visible-bell t)
