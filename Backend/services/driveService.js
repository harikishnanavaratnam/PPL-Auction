
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
        if (!folderId || typeof folderId !== 'string' || folderId.trim() === '') {
            throw new Error('Invalid folder ID provided');
        }

        // Clean the folder ID (remove any whitespace or quotes)
        const cleanFolderId = folderId.trim().replace(/['"]/g, '');

        // Build query - use simpler syntax that's more reliable
        // Get all non-trashed files in the folder, then filter images in code
        const query = `'${cleanFolderId}' in parents and trashed = false`;

        console.log('Drive API Query:', query);
        console.log('Folder ID:', cleanFolderId);

        const res = await drive.files.list({
            q: query,
            fields: 'files(id, name, webContentLink, webViewLink, mimeType, thumbnailLink)',
            pageSize: 1000, // Get up to 1000 files per request
            orderBy: 'name', // Order by name
        });

        // Filter to only image files
        const allFiles = res.data.files || [];
        const files = allFiles.filter(file => {
            return file.mimeType && (
                file.mimeType.startsWith('image/') ||
                file.mimeType === 'image/jpeg' ||
                file.mimeType === 'image/jpg' ||
                file.mimeType === 'image/png' ||
                file.mimeType === 'image/gif' ||
                file.mimeType === 'image/webp'
            );
        });
        
        console.log(`Found ${allFiles.length} total files, ${files.length} are images`);

        // If there are more files, get them (pagination)
        let nextPageToken = res.data.nextPageToken;
        while (nextPageToken) {
            const nextRes = await drive.files.list({
                q: query,
                fields: 'files(id, name, webContentLink, webViewLink, mimeType, thumbnailLink)',
                pageSize: 1000,
                pageToken: nextPageToken,
                orderBy: 'name',
            });
            const nextFiles = (nextRes.data.files || []).filter(file => {
                return file.mimeType && (
                    file.mimeType.startsWith('image/') ||
                    file.mimeType === 'image/jpeg' ||
                    file.mimeType === 'image/jpg' ||
                    file.mimeType === 'image/png' ||
                    file.mimeType === 'image/gif' ||
                    file.mimeType === 'image/webp'
                );
            });
            files.push(...nextFiles);
            nextPageToken = nextRes.data.nextPageToken;
            console.log(`Fetched additional ${nextFiles.length} image files. Total: ${files.length}`);
        }

        return files;
    } catch (error) {
        console.error('Error listing files from Drive:', error);
        if (error.response?.data?.error) {
            const driveError = error.response.data.error;
            if (driveError.code === 404) {
                throw new Error(`Folder not found. Please check the folder ID and ensure the service account has access.`);
            } else if (driveError.code === 403) {
                throw new Error(`Access denied. Please share the Drive folder with the service account email.`);
            } else {
                throw new Error(`Drive API Error: ${driveError.message || 'Unknown error'}`);
            }
        }
        throw new Error(error.message || 'Failed to list files from Google Drive');
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
