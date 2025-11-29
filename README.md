# cc-utils

一个实用的前端工具函数库，包含剪贴板、文件处理、下载、图片处理等常用工具函数。

## 安装

```bash
npm install cc-utils
# 或
yarn add cc-utils
# 或
pnpm add cc-utils
```

## 可选依赖

某些功能需要安装额外的依赖：

- `downloadImagesAsZip` 需要 `jszip` 和 `antd`
- `download` 需要 `axios` 和 `antd`

```bash
# 如果需要使用批量下载图片功能
npm install jszip antd

# 如果需要使用文件下载功能
npm install axios antd
```

## 使用

### ES Module

```typescript
import { copyToClipboard, formatStorage, getImageDimensions } from 'cc-utils';
```

### CommonJS

```javascript
const { copyToClipboard, formatStorage } = require('cc-utils');
```

## API 文档

### 剪贴板

#### `copyToClipboard(text: string): void`

复制文本到剪贴板，支持 HTTPS 和非安全环境。

```typescript
import { copyToClipboard } from 'cc-utils';

copyToClipboard('要复制的文本');
```

### 文件处理

#### `createFormData(data: Record<string, any>): FormData`

将对象转换为 FormData，支持嵌套对象和文件数组。

```typescript
import { createFormData } from 'cc-utils';

const formData = createFormData({
  name: '张三',
  files: [file1, file2],
  nested: {
    key: 'value'
  }
});
```

#### `appendFormData(formData: FormData, data: any, parentKey?: string): void`

向现有 FormData 追加数据，支持嵌套对象。

```typescript
import { appendFormData } from 'cc-utils';

const formData = new FormData();
appendFormData(formData, { name: '张三', age: 18 });
```

#### `dealFileKey(obj: Record<string, any>, key: string): FormData`

处理文件字段，将文件数组转换为 FormData。

```typescript
import { dealFileKey } from 'cc-utils';

const formData = dealFileKey({ images: [file1, file2] }, 'images');
```

### 下载

#### `download(downloadFn, fileName?: string): Promise<void>`

通用文件下载函数，支持从 Axios 响应中下载文件。

```typescript
import { download } from 'cc-utils';

await download(
  (config) => axios.get('/api/download', config),
  'filename.pdf'
);
```

#### `downloadImg(url: string, filename: string): Promise<void>`

下载单张图片。

```typescript
import { downloadImg } from 'cc-utils';

await downloadImg('https://example.com/image.png', 'my-image.png');
```

#### `downloadImagesAsZip(images: ImageItem[], zipFileName?: string): Promise<void>`

批量下载图片并打包为 ZIP 文件。

```typescript
import { downloadImagesAsZip } from 'cc-utils';

await downloadImagesAsZip(
  [
    { url: 'https://example.com/1.png', name: 'image1.png' },
    { url: 'https://example.com/2.png', name: 'image2.png' }
  ],
  'images.zip'
);
```

### 图片处理

#### `getImageDimensions(src: string): Promise<{ width: number; height: number }>`

获取图片的原始尺寸。

```typescript
import { getImageDimensions } from 'cc-utils';

const { width, height } = await getImageDimensions('https://example.com/image.png');
console.log(`图片尺寸: ${width} x ${height}`);
```

### 格式化

#### `formatStorage(bytes: number): string`

格式化存储大小，返回 MB 或 GB 单位的字符串。

```typescript
import { formatStorage } from 'cc-utils';

formatStorage(1024 * 1024);      // '1MB'
formatStorage(1024 * 1024 * 1024); // '1GB'
```

### 数学工具

#### `radiansToDegrees(radians: number): number`

将弧度转换为角度。

```typescript
import { radiansToDegrees } from 'cc-utils';

radiansToDegrees(Math.PI); // 180
```

#### `degreesToRadians(degrees: number): number`

将角度转换为弧度。

```typescript
import { degreesToRadians } from 'cc-utils';

degreesToRadians(180); // Math.PI
```

## 类型定义

本库使用 TypeScript 编写，包含完整的类型定义。

## 浏览器兼容性

本库中的大部分功能依赖于浏览器 API（如 `navigator.clipboard`、`canvas`、`Blob` 等），仅适用于浏览器环境。

## License

ISC