(function () {
  'use strict';

  var GREETING =
    "Hi! 👋 I'm Joel's assistant. Looking for a website, web app, or SEO help? I can answer your questions and get you a free quote.";

  var messages = [];
  var isOpen = false;
  var greeted = false;

  /* ─── Build widget ──────────────────────────────────────── */

  function buildWidget() {
    var bubble = document.createElement('button');
    bubble.id = 'cb-bubble';
    bubble.type = 'button';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '<span id="cb-badge" hidden aria-label="New message"></span>';

    var win = document.createElement('div');
    win.id = 'cb-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-modal', 'true');
    win.setAttribute('aria-label', "Joel's Assistant");
    win.hidden = true;
    win.innerHTML =
      '<div class="cb-header">' +
        '<div class="cb-header__left">' +
          '<div class="cb-avatar" aria-hidden="true">J</div>' +
          '<div class="cb-header__info">' +
            '<span class="cb-header__name">Joel\'s Assistant</span>' +
            '<span class="cb-header__status">' +
              '<span class="cb-online-dot" aria-hidden="true"></span>Online' +
            '</span>' +
          '</div>' +
        '</div>' +
        '<button class="cb-close" type="button" aria-label="Close chat">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="cb-messages" id="cb-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>' +
      '<div class="cb-input-area">' +
        '<textarea id="cb-textarea" placeholder="Type a message…" rows="1" maxlength="1000" aria-label="Message"></textarea>' +
        '<button id="cb-send" type="button" disabled aria-label="Send message">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    bubble.addEventListener('click', toggleChat);
    win.querySelector('.cb-close').addEventListener('click', toggleChat);

    var textarea = win.querySelector('#cb-textarea');
    var sendBtn  = win.querySelector('#cb-send');

    textarea.addEventListener('input', function () {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      sendBtn.disabled = !textarea.value.trim();
    });

    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);
  }

  /* ─── Toggle ────────────────────────────────────────────── */

  function toggleChat() {
    isOpen = !isOpen;
    var win    = document.getElementById('cb-window');
    var bubble = document.getElementById('cb-bubble');
    var badge  = document.getElementById('cb-badge');

    if (isOpen) {
      win.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          win.classList.add('cb-open');
        });
      });
      badge.hidden = true;
      bubble.setAttribute('aria-label', 'Close chat');
      if (!greeted) {
        greeted = true;
        appendBotMsg(GREETING);
      }
      var ta = document.getElementById('cb-textarea');
      if (ta) ta.focus();
    } else {
      win.classList.remove('cb-open');
      bubble.setAttribute('aria-label', 'Open chat');
      setTimeout(function () { win.hidden = true; }, 300);
    }
  }

  /* ─── Messages ──────────────────────────────────────────── */

  function appendBotMsg(text) {
    var msgs = document.getElementById('cb-messages');
    var row  = document.createElement('div');
    row.className = 'cb-msg cb-msg--bot';
    row.innerHTML =
      '<div class="cb-bubble">' + linkify(escHtml(text)) + '</div>' +
      '<time class="cb-time">' + getTime() + '</time>';
    msgs.appendChild(row);
    scrollBottom();
  }

  function appendUserMsg(text) {
    var msgs = document.getElementById('cb-messages');
    var row  = document.createElement('div');
    row.className = 'cb-msg cb-msg--user';
    row.innerHTML =
      '<div class="cb-bubble">' + escHtml(text) + '</div>' +
      '<time class="cb-time">' + getTime() + '</time>';
    msgs.appendChild(row);
    scrollBottom();
  }

  function showTyping() {
    var msgs = document.getElementById('cb-messages');
    var row  = document.createElement('div');
    row.id = 'cb-typing-row';
    row.className = 'cb-msg cb-msg--bot';
    row.setAttribute('aria-label', 'Assistant is typing');
    row.innerHTML =
      '<div class="cb-bubble cb-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(row);
    scrollBottom();
  }

  function removeTyping() {
    var el = document.getElementById('cb-typing-row');
    if (el) el.parentNode.removeChild(el);
  }

  /* ─── Send ──────────────────────────────────────────────── */

  function sendMessage() {
    var textarea = document.getElementById('cb-textarea');
    var sendBtn  = document.getElementById('cb-send');
    var text     = textarea.value.trim();
    if (!text) return;

    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.disabled = true;

    appendUserMsg(text);
    messages.push({ role: 'user', content: text });
    showTyping();

    fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var reply = data.reply || '';

        /* strip LEAD_DATA block and fire lead submission */
        var leadIdx = reply.indexOf('LEAD_DATA:');
        if (leadIdx !== -1) {
          var leadJson = reply.slice(leadIdx + 'LEAD_DATA:'.length).trim();
          reply = reply.slice(0, leadIdx).trim();
          try {
            submitLead(JSON.parse(leadJson));
          } catch (_) {}
        }

        removeTyping();
        appendBotMsg(reply);
        messages.push({ role: 'assistant', content: reply });

        if (!isOpen) markUnread();
      })
      .catch(function () {
        removeTyping();
        appendBotMsg(
          "Sorry, I’m having trouble connecting right now. Please email joelgacho.ffseo@gmail.com directly."
        );
      });
  }

  /* ─── Lead submit ───────────────────────────────────────── */

  function submitLead(lead) {
    fetch('/.netlify/functions/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch(function () {});
  }

  /* ─── Badge ─────────────────────────────────────────────── */

  function markUnread() {
    var badge = document.getElementById('cb-badge');
    if (badge) badge.hidden = false;
  }

  /* ─── Utilities ─────────────────────────────────────────── */

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function linkify(str) {
    return str.replace(
      /(https?:\/\/[^\s<>"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollBottom() {
    var msgs = document.getElementById('cb-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  /* ─── Init ──────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
