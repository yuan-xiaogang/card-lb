class DealImage {
    constructor(file, Orientation) {
        this.file = file
        this.Orientation = Orientation
    }
    changeImage() {
        const self = this;
        return new Promise(function (resolve, reject) {
            // 图片处理的元素
            let [reader, img] = [new FileReader(), new Image()];
            reader.onload = function (e) {
                img.src = e.target.result;
            }
            reader.readAsDataURL(self.file);
            img.onload = function () {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                // 图片原始尺寸
                let [originWidth, originHeight] = [this.width, this.height];
                // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                let [maxWidth, maxHeight, maxSize,quality] = [300, 300, 200, 0.92]

                // 目标尺寸
                let [targetWidth, targetHeight] = [originWidth, originHeight];
                if ((self.file.size/1024) > maxSize) {
                    // 图片尺寸超过300x300的限制
                    if (originWidth > maxWidth || originHeight > maxHeight) {
                        if (originWidth / originHeight > maxWidth / maxHeight) {
                            // 更宽，按照宽度限定尺寸
                            targetWidth = maxWidth;
                            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                        } else {
                            targetHeight = maxHeight;
                            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                        }
                    }
                }
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                // 处理旋转
                // if ([6,8].indexOf(self.Orientation) > -1) {
                //     canvas.width = targetHeight;
                //     canvas.height = targetWidth;
                //   }
                //   switch (self.Orientation) {
                //     case 2: context.transform(-1, 0, 0, 1, targetWidth, 0); break;
                //     case 3: context.transform(-1, 0, 0, -1, targetWidth, targetHeight ); break;
                //     case 4: context.transform(1, 0, 0, -1, 0, targetHeight ); break;
                //     case 5: context.transform(0, 1, 1, 0, 0, 0); break;
                //     case 6: context.transform(0, 1, -1, 0, targetHeight , 0); break;
                //     case 7: context.transform(0, -1, -1, 0, targetHeight , targetWidth); break;
                //     case 8: context.transform(0, -1, 1, 0, 0, targetWidth); break;
                //     default: context.transform(1, 0, 0, 1, 0, 0);
                //   }

                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);

                // let newUrl = canvas.toDataURL('image/jpeg', 0.92);//base64 格式
                //把压缩后的图片转blob格式用于上传
                canvas.toBlob((blob) => {
                    resolve(blob);
                    //把blob作为参数传给后端
                }, 'image/jpeg', quality)
            }
        })
    }
}
export default async (file, Orientation) => {
    const dealImage = new DealImage(file, Orientation);
    return dealImage.changeImage();
}