import { Notify } from 'sode-extend-react';

const TYPE_CONFIG = {
    success: {
        accent: '#10b981',
        bgSubtle: '#ecfdf5',
        iconColor: '#059669',
        defaultIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    },
    danger: {
        accent: '#ef4444',
        bgSubtle: '#fef2f2',
        iconColor: '#dc2626',
        defaultIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    },
    warning: {
        accent: '#f59e0b',
        bgSubtle: '#fffbeb',
        iconColor: '#d97706',
        defaultIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    },
    info: {
        accent: '#3b82f6',
        bgSubtle: '#eff6ff',
        iconColor: '#2563eb',
        defaultIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    },
    primary: {
        accent: '#6366f1',
        bgSubtle: '#eef2ff',
        iconColor: '#4f46e5',
        defaultIcon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
    }
};

const injectNotifyStyles = () => {
    if (typeof document === 'undefined' || document.getElementById('sode-notify-styles')) return;

    const style = document.createElement('style');
    style.id = 'sode-notify-styles';
    style.innerHTML = `
        #notify_container {
            position: fixed !important;
            top: 24px !important;
            right: 24px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            z-index: 99999999 !important;
            pointer-events: none !important;
            max-width: calc(100vw - 32px) !important;
        }

        .sode-notify-toast {
            pointer-events: auto !important;
            position: relative !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 12px !important;
            width: 360px !important;
            max-width: 100% !important;
            background: #ffffff !important;
            border-radius: 14px !important;
            padding: 14px 16px 16px 14px !important;
            box-shadow: 0 10px 25px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.07) !important;
            cursor: pointer !important;
            overflow: hidden !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.25s ease !important;
            animation: sodeNotifySlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
            border-left: 4px solid var(--accent-color, #10b981) !important;
            text-decoration: none !important;
        }

        .sode-notify-toast:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 14px 30px -4px rgba(15, 23, 42, 0.16), 0 6px 10px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.09) !important;
        }

        .sode-notify-toast.closing {
            animation: sodeNotifySlideOut 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        }

        @keyframes sodeNotifySlideIn {
            from {
                opacity: 0;
                transform: translateX(100%) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        @keyframes sodeNotifySlideOut {
            from {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateX(110%) scale(0.92);
            }
        }

        .sode-notify-icon-box {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            border-radius: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-top: 1px !important;
            overflow: hidden !important;
            flex-shrink: 0 !important;
        }

        .sode-notify-icon-img {
            width: 24px !important;
            height: 24px !important;
            object-fit: contain !important;
        }

        .sode-notify-content {
            flex: 1 !important;
            min-width: 0 !important;
            padding-right: 18px !important;
        }

        .sode-notify-title {
            display: block !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            color: #0f172a !important;
            line-height: 1.35 !important;
            margin-bottom: 3px !important;
            letter-spacing: -0.01em !important;
            text-overflow: ellipsis !important;
            overflow: hidden !important;
            white-space: nowrap !important;
        }

        .sode-notify-body {
            display: block !important;
            font-size: 13px !important;
            font-weight: 400 !important;
            color: #64748b !important;
            line-height: 1.45 !important;
            word-break: break-word !important;
        }

        .sode-notify-close {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            width: 22px !important;
            height: 22px !important;
            border-radius: 6px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #94a3b8 !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
            padding: 0 !important;
        }

        .sode-notify-close:hover {
            color: #334155 !important;
            background: #f1f5f9 !important;
        }

        .sode-notify-progress-track {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 3px !important;
            background: rgba(0, 0, 0, 0.04) !important;
            overflow: hidden !important;
        }

        .sode-notify-progress-bar {
            height: 100% !important;
            width: 100% !important;
            transform-origin: left !important;
            animation: sodeNotifyProgress linear forwards !important;
        }

        .sode-notify-toast:hover .sode-notify-progress-bar {
            animation-play-state: paused !important;
        }

        @keyframes sodeNotifyProgress {
            from {
                transform: scaleX(1);
            }
            to {
                transform: scaleX(0);
            }
        }

        @media (max-width: 480px) {
            #notify_container {
                top: 12px !important;
                right: 12px !important;
                left: 12px !important;
                max-width: calc(100vw - 24px) !important;
            }
            .sode-notify-toast {
                width: 100% !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Container initialization
Notify.container = () => {
    injectNotifyStyles();
    let e = document.createElement('div');
    e.id = 'notify_container';
    return e;
};

// Custom Template with modern UI
Notify.template = function (title, icon, body, type = 'success', timeout = 6000, clicked = () => {}) {
    injectNotifyStyles();

    const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
    const finalIcon = (!icon || icon.includes('sode.icon.svg') || icon.includes('sode.me')) 
        ? '/assets/resources/icon.png' 
        : icon;

    const toast = document.createElement('div');
    toast.className = `sode-notify-toast sode-notify-${type}`;
    toast.style.setProperty('--accent-color', config.accent);

    // Icon Container
    const iconBox = document.createElement('div');
    iconBox.className = 'sode-notify-icon-box';
    iconBox.style.backgroundColor = config.bgSubtle;
    iconBox.style.color = config.iconColor;

    if (finalIcon) {
        const img = document.createElement('img');
        img.className = 'sode-notify-icon-img';
        img.src = finalIcon;
        img.alt = '';
        img.onerror = () => {
            img.remove();
            iconBox.innerHTML = config.defaultIcon;
        };
        iconBox.appendChild(img);
    } else {
        iconBox.innerHTML = config.defaultIcon;
    }

    // Content
    const content = document.createElement('div');
    content.className = 'sode-notify-content';

    const titleEl = document.createElement('span');
    titleEl.className = 'sode-notify-title';
    titleEl.textContent = title || 'Notificación';

    const bodyEl = document.createElement('span');
    bodyEl.className = 'sode-notify-body';
    bodyEl.textContent = body || '';

    content.appendChild(titleEl);
    if (body) {
        content.appendChild(bodyEl);
    }

    // Close Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sode-notify-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Cerrar');
    closeBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    // Progress Bar Track
    const progressTrack = document.createElement('div');
    progressTrack.className = 'sode-notify-progress-track';

    const progressBar = document.createElement('div');
    progressBar.className = 'sode-notify-progress-bar';
    progressBar.style.backgroundColor = config.accent;
    progressBar.style.animationDuration = `${timeout}ms`;
    progressTrack.appendChild(progressBar);

    // Assemble Toast
    toast.appendChild(iconBox);
    toast.appendChild(content);
    toast.appendChild(closeBtn);
    toast.appendChild(progressTrack);

    // Dismiss logic
    let timerId = null;
    let startTime = Date.now();
    let remainingTime = timeout;

    const dismiss = () => {
        if (toast.classList.contains('closing')) return;
        toast.classList.add('closing');
        clearTimeout(timerId);
        setTimeout(() => {
            toast.remove();
        }, 250);
    };

    const startTimer = () => {
        startTime = Date.now();
        timerId = setTimeout(dismiss, remainingTime);
    };

    const pauseTimer = () => {
        clearTimeout(timerId);
        remainingTime -= (Date.now() - startTime);
    };

    // Events
    toast.addEventListener('mouseenter', pauseTimer);
    toast.addEventListener('mouseleave', () => {
        if (remainingTime > 0) startTimer();
        else dismiss();
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
    });

    toast.addEventListener('click', (e) => {
        if (e.target.closest('.sode-notify-close')) return;
        if (typeof clicked === 'function') {
            clicked();
        }
        dismiss();
    });

    startTimer();

    return toast;
};

export default Notify;