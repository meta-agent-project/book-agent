// 원본 PNG를 유지하고 읽기용 화면에서만 작게 표시한다.
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'book-image-dialog';
  dialog.innerHTML = '<header><span></span><button type="button">닫기</button></header><img alt="">';
  dialog.setAttribute('aria-label', '이미지 확대 보기');
  document.body.append(dialog);
  let trigger;
  const close = () => dialog.close();
  dialog.querySelector('button').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => trigger?.focus());
  const open = img => {
    trigger = img;
    const enlarged = dialog.querySelector('img');
    enlarged.src = img.currentSrc || img.src;
    enlarged.alt = img.alt;
    dialog.querySelector('span').textContent = img.alt || '이미지';
    dialog.showModal();
  };
  document.addEventListener('click', event => {
    const img = event.target.closest('figure img');
    if (img) open(img);
  });
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('figure img')) {
      event.preventDefault(); open(event.target);
    }
  });
  const label = () => document.querySelectorAll('figure img').forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt || '이미지') + ' 확대 보기');
    img.title = '클릭 또는 Enter로 확대';
  });
  label();
  new MutationObserver(label).observe(document.body, { childList: true, subtree: true });
})();
