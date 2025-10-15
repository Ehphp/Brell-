/**
 * Analytics Module
 * Wrapper per Google Analytics tracking
 */

export function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'undefined') return;

    gtag('event', eventName, {
        event_category: params.category || 'general',
        event_label: params.label || '',
        value: params.value || undefined,
        ...params
    });
}

export function trackPageView(pagePath, pageTitle) {
    if (typeof gtag === 'undefined') return;

    gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle
    });
}
