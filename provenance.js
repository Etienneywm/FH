/*
 * provenance.js : d'où vient la visite, pour la joindre à une candidature.
 *
 * À la première page ouverte dans l'onglet, il retient les paramètres de
 * campagne (utm_*, ref), le site d'où la personne arrive (son nom seul) et la
 * page d'arrivée. Rien d'autre, et seulement dans le sessionStorage de
 * l'onglet : effacé à sa fermeture, jamais envoyé nulle part par ce script.
 * Le formulaire de candidature le lit et le joint à l'envoi (champ
 * « Provenance »). Mis en place par Comète Studio, octobre 2026.
 */
(function () {
    var CLE = 'pf-provenance';
    try {
        if (window.sessionStorage.getItem(CLE)) return;
        var q = new URLSearchParams(window.location.search), campagne = [];
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'].forEach(function (k) {
            var v = q.get(k);
            if (v) campagne.push(k + '=' + v.slice(0, 80));
        });
        if (q.get('gclid')) campagne.push('gclid');
        if (q.get('fbclid')) campagne.push('fbclid');
        var hote = '';
        try { hote = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; } catch (e) { hote = ''; }
        var nu = function (h) { return h.replace(/^www\./, ''); };
        if (hote && nu(hote) === nu(window.location.hostname)) hote = '';
        window.sessionStorage.setItem(CLE, JSON.stringify({
            c: campagne.join(' & '),
            r: hote,
            p: window.location.pathname,
            d: new Date().toISOString().slice(0, 10)
        }));
    } catch (e) {
        /* stockage refusé (navigation privée stricte) : pas de provenance, rien de cassé */
    }
})();
