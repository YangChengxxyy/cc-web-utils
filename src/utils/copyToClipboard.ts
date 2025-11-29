export default function copyToClipboard(textToCopy: string) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard 向剪贴板写文本
    navigator.clipboard.writeText(textToCopy);
  } else {
    // document.execCommand('copy') 向剪贴板写文本
    let input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.top = '-10000px';
    input.style.zIndex = '-999';
    document.body.appendChild(input);
    input.value = textToCopy;
    input.focus();
    input.select();
    try {
      let result = document.execCommand('copy');
      document.body.removeChild(input);
      // @ts-ignore
      if (!result || result === 'unsuccessful') {
        throw new Error('复制失败');
      }
    } catch (e) {
      document.body.removeChild(input);
      throw new Error('复制失败');
    }
  }
}
