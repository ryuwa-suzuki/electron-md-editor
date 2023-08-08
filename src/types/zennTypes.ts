type Book = {
  bookName: string;
  files: Array<string>;
};
export type zennType = {
  zennData: {
    content: string;
    label: string;
    file: string;
  };
  isZennSynced: boolean;
  fileNames: {
    articles: Array<string>,
    books: Array<Book>
  };
  zennDirPath: string;
  selectedFile: {
    label: string;
    file: string;
  };
  setZennData: (zennData: {content: string, label: string, file: string}) => void;
  setZennDirPath: (zennDirPath: string) => void;
  setSelectedFile: (selected: { label: string, file: string }) => void;
  syncWithZenn: () => Promise<void>;
  getZennContent: () => Promise<void>;
  setIsZennSynced: (value: boolean) => void;
};


