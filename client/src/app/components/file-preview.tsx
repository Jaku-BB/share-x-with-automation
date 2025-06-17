import { getPrettySize } from "~/app/utils/get-pretty-size";

interface FilePreviewProps {
  file: File;
}

export const FilePreview = ({ file }: FilePreviewProps) => {
  const fileName = file.name;
  const [size, unit] = getPrettySize(file.size);

  return (
    <div className="flex items-center justify-between gap-8 rounded-xl bg-indigo-50 px-3 py-1.5 text-[15px] text-neutral-900">
      <span className="truncate" title={fileName}>
        {fileName}
      </span>
      <span className="shrink-0">
        {size} <abbr>{unit}</abbr>
      </span>
    </div>
  );
};
