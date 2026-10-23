// Meta Pixel for the "metouilli" website dataset in Events Manager.
(function () {
  'use strict';

  var pixelId = '728752433893635';

  // Meta Pixel base code. Keep PageView so Events Manager can verify the install.
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', pixelId);
  fbq('track', 'PageView');

  // Delegation also covers buttons and booking links added by page scripts.
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;

    var url;
    try { url = new URL(link.href, window.location.href); }
    catch (error) { return; }

    var isWhatsAppContact =
      (url.hostname === 'wa.me' && /^\/\d+\/?$/.test(url.pathname)) ||
      ((url.hostname === 'api.whatsapp.com' || url.hostname === 'web.whatsapp.com') &&
        url.pathname === '/send' && /^\d+$/.test(url.searchParams.get('phone') || ''));

    if (isWhatsAppContact) {
      fbq('trackCustom', 'WhatsAppClick');
    }
  });
}());
