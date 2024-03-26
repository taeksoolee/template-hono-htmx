function agoTime() {
  const $time = $('time');

  const target = moment($time.attr('datetime'), 'YYYY-MM-DD HH:mm');
  const std = moment().add(-1, 'day').startOf('day');

  if (std.isBefore(target)) {
    $time.text(target.fromNow());
  } else {
    $time.text(target.format('YYYY. MM. DD'));
  }
}

function replaceCurPage() {
  $('nav a').each((_, a) => {
    const $a = $(a);
    const href = $a.attr('href');
    const target = new URL(href, location.href).toString();
    
    if (location.href === target) {
      $a.replaceWith(`<span>${$a.html()}</span>`);
    }
  });
}

function init() {
  agoTime();
  replaceCurPage();
};

$(document).ready(_.once(function() {
  init();

  const $body = $('body');
  $body.on('htmx:before-request', function(_) {
    const $dialog = $('dialog');
    if ($dialog.get(0) && !$dialog.attr('open')) {
      $dialog.get(0).showModal();
    }
  });

  $body.on('htmx:before-swap', function() {
    const $dialog = $('dialog');
    if ($dialog.get(0) && $dialog.attr('open')) {
      $dialog.get(0).close();
    }
  });

  $body.on('htmx:after-swap', function() {
    init();
  });
}));

/**
 * 
 */
const scriptManager = (function ScriptManager() {
  const _loaded = [];

  async function load(src) {
    return new Promise(function(resolve, reject) {
      if (_loaded.includes(src)) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.onload = function(_) {
        _loaded.push(src);
        resolve();
      }
      script.onerror = function(_) {
        reject('load failed ::: ' + src);
      }
      script.src = src;
      document.head.appendChild(script);
      document.head.removeChild(script);
    });
  }

  return {
    load,
  }
})();