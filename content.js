/* 1.   family & features to activate */
const VERT_DECL = {
  family: `"YuMincho-Regular-V","YuMincho","serif"`, // supply your own vertical face first
  feature: `"vert","vrt2"`
};

// デバッグ用（本番環境では無効化）
// console.log('JP Vertical Auto-Switch content script loaded');

/* 2.   measure the first printable char of a text node */
function glyphWidth(textNode) {
  const r = document.createRange();
  r.setStart(textNode, 0);
  r.setEnd(textNode, 1);
  const w = r.getBoundingClientRect().width;
  r.detach();
  return w;
}

/* 2.5. find first text node in element */
function findFirstTextNode(element) {
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === 3 && /\S/.test(node.data)) {
      return node;
    }
  }
  return null;
}

/* 3.   test one element */
function testAndSwap(el) {
  // 最初のテキストノードを見つける
  const firstTextNode = findFirstTextNode(el);
  if (!firstTextNode) return;

  // span要素の場合は、より厳密な条件をチェック
  if (el.tagName.toLowerCase() === 'span') {
    // テキストが2文字以上あるspanのみ対象
    if (el.textContent.trim().length < 2) return;
  }

  const gw = glyphWidth(firstTextNode);
  const line = el.getBoundingClientRect().width;

  // より厳しい条件：文字幅が要素の幅の80%を超える場合
  if (gw >= line * 0.8) {
    el.style.fontFamily = VERT_DECL.family;
    el.style.fontFeatureSettings = VERT_DECL.feature;
  }
}

/* 4.   observe resize AND DOM changes */
const ro = new ResizeObserver(entries => entries.forEach(e => testAndSwap(e.target)));
const mo = new MutationObserver(muts => muts.forEach(m => {
  m.addedNodes.forEach(n => {
    if (n.nodeType === 1) {                    // Element
      watch(n);
    }
  });
}));

/* 5.   attach observers */
function watch(root) {
  // 基本的なテキスト要素
  const basicElements = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, dt, dd');
  
  // span要素（より積極的に）
  const spanElements = root.querySelectorAll('span');
  
  const elements = [...basicElements, ...spanElements];
  
  elements.forEach(el => {
    ro.observe(el);
    testAndSwap(el);                           // initial check
  });
}
if (document.body) {
  watch(document.body);
  mo.observe(document.body, { childList: true, subtree: true });
}
