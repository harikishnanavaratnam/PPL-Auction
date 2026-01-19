
import { google } from 'googleapis';
import stream from 'stream';
import path from 'path';

const KEYFILEPATH = path.join(process.cwd(), 'service_account.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

export const listFiles = async (folderId) => {
    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trash = false`,
            fields: 'files(id, name, webContentLink, webViewLink, mimeType)',
        });
        return res.data.files;
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
};

export const getFile = async (fileId) => {
    try {
        const res = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, { responseType: 'stream' });
        return res.data;
    } catch (error) {
        console.error('Error getting file:', error);
        throw error;
    }
};

// Helper to check if permission needs to be added (optional, usually Service Account has access if added to Folder)
export const checkAccess = async () => {
    // Implementation if needed
};
