export const MAX_LENGTH = Number.POSITIVE_INFINITY;
export const NOT_SPECIAL_CHARACTER = /[^~`!@#$%^&*)(_+={}[\]|/\\:;'"<>,.?]/g;
export const SPECIAL_CHARACTER = /[~`!@#$%^&*)(_+={}[\]|/\\:;'"<>,.?]/g;
export const SPECIAL_CHARACTER_WITHOUT_EMAIL = /[~`!#$%^&*)(={}[\]|\\:;'"<>,]/g;
export const REGEX_EMAIL = /^\w+([.+/?_-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/;
export const REGEX_JAPANESE_CHARACTERS =
  /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
export const NUMBER_FULL_WIDTH = /(\d|[１２３４５６７８９０ .])+/g;
export const FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOW_FILE_TYPE_CSV = ['csv'];
export const ALLOW_FILE_TYPE_FOR_PRODUCT_UPLOAD = [
  'jpg',
  'jpeg',
  'gif',
  'bmp',
  'png',
  'raw',
  'tiff',
  'psd',
  'eps',
  'cr2',
  'cr3',
  'nrf',
  'arw',
  'sr2',
  'orf',
  'rw2',
  'raf',
  'avi',
  'mov',
  'wmv',
  'mpg',
  'm4a',
  'mp4',
  'pdf',
  'ai',
  'indd',
  'aif',
  'mp3',
  'ogg',
  'wma',
  'xls',
  'xlsx',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'csv',
  'txt',
  'zip',
  'step',
  'stp',
  'iges',
  'igs',
  'dwf',
  'dxf',
  'dwg',
  'sima',
  'idf',
  'pts',
  'prt',
  'drw',
];
export const ACCEPT_FILE_TYPE_FOR_PRODUCT_UPLOAD = ALLOW_FILE_TYPE_FOR_PRODUCT_UPLOAD.map((ele) => `.${ele}`).join(',');
export const CONTAIN_LOWERCASE_CHARACTER = /^(?=.*[a-z])/;
export const CONTAIN_UPPERCASE_CHARACTER = /^(?=.*[A-Z])/;
export const CONTAIN_NUMBER = /^(?=.*[0-9])/;
export const CONTAIN_SPECIAL_CHARACTER = /^(?=.*?[#?!@$%^&*-])/;
export const MAX_LENGTH_COMPANY_NAME = 100;
export const MAX_LENGTH_PIC_NAME = 100;
export const MAX_LENGTH_ADDRESS = 255;
export const MAX_LENGTH_EMAIL = 256;
export const MAX_LENGTH_INFO_EMAIL = 64;
export const MAX_LENGTH_PHONE = 11;
export const MIN_LENGTH_PHONE = 10;
export const COLOR_CODE_LENGTH = 6;
export const COLOR_CODE_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
export const MAX_LENGTH_PASSWORD = 16;
export const MIN_LENGTH_PASSWORD = 6;
export const MAX_LENGTH_USER_ID = 12;
export const MAX_LENGTH_FULL_NAME = 100;
export const EMPLOYEE_NUMBER_REGEX = /^[a-zA-Z0-9]+$/;
export const START_WITH_ZERO = /^0/;
export const DATE_DASH_DELIMITER_REGEX = /-/g;
export const DATE_VALID_DELIMITER = '/';
export const MAX_LENGTH_ROLE_NAME = 150;
export const MAX_LENGTH_FOLDER_NAME = 50;
export const MAX_LENGTH_PRODUCT_NAME = 100;
export const MAX_LENGTH_TITLE = 255;
export const MAX_LENGTH_CONTENT = 1000;
export const HYPHEN_CHARACTER = '-';
export const MAX_LENGTH_ATTRIBUTE_NAME = 100;
export const DATE_ISO_FORMAT = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
export const CSV_PRODUCT_MAX_ROWS = 500;
export const CSV_FILE_NAME_DELIMITER = ';';
export const SPECIAL_NAME_FORM = /["'. ]/g;
