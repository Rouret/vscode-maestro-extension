import * as path from 'path';

export enum IconType {
    folder = "folder",
    file = "file"
}

export function getIconPathByIconType(iconType: IconType) {
    return {
        light: path.join(__filename, '..', '..', '..', 'resources', 'icons', 'light', `${iconType}.svg`),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'icons', 'dark', `${iconType}.svg`)
    };
}