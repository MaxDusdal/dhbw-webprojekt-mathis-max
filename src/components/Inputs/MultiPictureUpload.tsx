import {
  FileUploaderRegular,
  FileUploaderInline,
} from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";
import type { ImagesUploadCare } from "~/app/utils/types";
import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";

export default function MultiPictureUpload({
  images,
  setImages,
}: {
  images: ImagesUploadCare[];
  setImages: (images: ImagesUploadCare[]) => void;
}) {
  const updateImages = (file: { uuid: string; cdnUrl: string }) => {
    // @ts-ignore
    setImages((currentImages) => {
      const filteredImages = currentImages.filter(
        (image: ImagesUploadCare) => image.uuid !== file.uuid,
      );
      return [...filteredImages, { uuid: file.uuid, url: file.cdnUrl }];
    });
  };

  const removeImage = (file: { uuid: string | null }) => {
    // @ts-ignore
    setImages((currentImages) => {
      return currentImages.filter(
        (image: ImagesUploadCare) => image.uuid !== file.uuid,
      );
    });
  };

  return (
    <div>
      <FileUploaderRegular
      className="mb-8"
        classNameUploader="uc-light uc-gray"
        pubkey="413109ae6155eb8e885e"
        imgOnly={true}
        multiple={true}
        sourceList="local, camera"
        confirmUpload={true}
        onFileUploadFailed={(error: any) => {
          console.error(error);
        }}
        maxLocalFileSizeBytes={10000000}
        onFileUrlChanged={updateImages}
        onFileRemoved={removeImage}
      />
      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.uuid} className="group relative">
            <div className="absolute -right-3 -top-3 z-10 rounded-full bg-gray-100 p-1 shadow-lg opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
              <XMarkIcon
                className="h-5 w-5 cursor-pointer text-black"
                onClick={() => removeImage(image)}
              />
            </div>
            <div className="w-full overflow-hidden rounded-md">
              <Image
                src={image.url}
                width={300}
                height={300}
                alt="Picture"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
