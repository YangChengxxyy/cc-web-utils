import { message } from 'antd';
import JSZip from 'jszip';

interface ImageItem {
  url: string;
  name: string;
}

/**
 * 将图片转换为 blob 数据
 * @param url 图片地址
 * @returns Promise<Blob>
 */
async function imageToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // 解决跨域问题

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('无法获取 canvas 上下文'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0, img.width, img.height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('无法转换图片为 blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error(`图片加载失败: ${url}`));
    };

    img.src = `${url}?v=${Date.now()}`;
  });
}

/**
 * 批量下载图片并压缩为 ZIP 文件
 * @param images 图片列表
 * @param zipFileName ZIP 文件名
 */
export async function downloadImagesAsZip(
  images: ImageItem[],
  zipFileName: string = 'images.zip',
): Promise<void> {
  if (images.length === 0) {
    message.error('没有要下载的图片');
    return;
  }

  const zip = new JSZip();
  let progressMessage = message.loading('正在准备下载...', 0);

  try {
    let completed = 0;
    const total = images.length;

    // 如果只有一张图片，直接下载，不压缩
    if (images.length === 1) {
      progressMessage(); // 关闭 loading
      const image = images[0];
      const blob = await imageToBlob(image.url);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.name || 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('图片下载完成');
      return;
    }

    // 批量处理图片
    const promises = images.map(async (image, index) => {
      try {
        const blob = await imageToBlob(image.url);
        const fileName = image.name || `image_${index + 1}.png`;

        // 确保文件名有正确的扩展名
        const finalFileName = fileName.includes('.')
          ? fileName
          : `${fileName}.png`;

        zip.file(finalFileName, blob);
        completed++;
      } catch (error) {
        console.error(`处理图片失败: ${image.name}`, error);
        // 继续处理其他图片，不中断整个过程
      }
    });

    await Promise.all(promises);

    if (completed === 0) {
      progressMessage();
      message.error('所有图片处理失败');
      return;
    }

    // 生成 ZIP 文件
    progressMessage(); // 关闭当前的 loading
    progressMessage = message.loading('正在生成 ZIP 文件...', 0);

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // 下载 ZIP 文件
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    progressMessage();

    if (completed === total) {
      message.success(`所有 ${total} 张图片已打包下载完成`);
    } else {
      message.warning(
        `已成功下载 ${completed}/${total} 张图片，${
          total - completed
        } 张图片处理失败`,
      );
    }
  } catch (error) {
    progressMessage();
    console.error('批量下载失败:', error);
    message.error('批量下载失败，请重试');
  }
}

export default downloadImagesAsZip;
