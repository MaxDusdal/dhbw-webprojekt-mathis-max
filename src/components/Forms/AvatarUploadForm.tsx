import Image from "next/image";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

import { api } from "~/trpc/react";

export default function AvatarUploadForm() {
  const utils = api.useUtils();
  const userData = api.user.getCallerUser.useQuery();
  const updateAvatar = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      utils.user.getCallerUser.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleAvatarUpload = (file: any) => {
    updateAvatar.mutate({ avatar: file.cdnUrl });
  };

  const handleAvatarUploadError = (error: any) => {
    console.error(error);
  };
  return (
    <div className="col-span-full flex items-center gap-x-8">
      <Image
        alt=""
        src={userData.data?.avatar || "/images/randomAvatar.jpeg"}
        width={300}
        height={300}
        className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
      />

      <div>
        <FileUploaderRegular
          classNameUploader="uc-light uc-gray"
          pubkey="413109ae6155eb8e885e"
          imgOnly={true}
          multiple={false}
          sourceList="local, camera"
          confirmUpload={true}
          onFileUploadFailed={handleAvatarUploadError}
          cropPreset="1:1"
          cloudImageEditorTabs={"crop"}
          onFileUrlChanged={handleAvatarUpload}
          maxLocalFileSizeBytes={10000000}
        />
        <p className="mt-2 text-xs leading-5 text-gray-400">
          JPG, GIF oder PNG. 10MB max.
        </p>
      </div>
    </div>
  );
}
