export declare function copy(src: string, dest: string): void;
export declare function isValidPackageName(projectName: string): boolean;
export declare function toValidPackageName(projectName: string): string;
export declare function copyDir(srcDir: string, destDir: string): void;
export declare function isEmpty(path: string): boolean;
export declare function emptyDir(dir: string): void;
export declare function fetchNpmAndExtract(pkg: string, targetDir?: string): Promise<any>;
