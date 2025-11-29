function downloadImg(link: string, picName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.crossOrigin = 'Anonymous'; // 解决跨域问题

    // 设置超时处理
    const timeout = setTimeout(() => {
      reject(new Error('图片加载超时'));
    }, 30000); // 30秒超时

    img.onload = function () {
      clearTimeout(timeout);
      try {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        if (!context) {
          reject(new Error('无法获取canvas上下文'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        let url = canvas.toDataURL('images/png');
        let a = document.createElement('a');
        let event = new MouseEvent('click');
        a.download = picName || 'default.png';
        a.href = url;
        a.dispatchEvent(event);

        resolve();
      } catch (error) {
        reject(new Error(`图片处理失败: ${error}`));
      }
    };

    img.onerror = function () {
      clearTimeout(timeout);
      reject(new Error(`图片加载失败: ${link}`));
    };

    img.src = `${link}?v=${Date.now()}`;
  });
}

export default downloadImg;
