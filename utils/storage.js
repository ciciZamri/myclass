const { Storage: GCS } = require('@google-cloud/storage');
const Random = require('./random');
const AppError = require('../utils/error');

const storage = new GCS({
    projectId: 'sandbox-99',
    keyFilename: './sandbox-99-9430c3a1efc9.json'
});

const bucketName = 'myclass-99';

class Storage {
    static upload(req, folderName, makePublic = false) {
        return new Promise((resolve, reject) => {
            const bucket = storage.bucket(bucketName);
            let random = Random.randomStr(12) + (Date.now()).toString() + '-';
            if(!makePublic) random = '';
            const gcsFileName = `${folderName}/${req.user.id}/${random}${req.file.originalname}`;
            const file = bucket.file(gcsFileName);

            const stream = file.createWriteStream({ metadata: { contentType: req.file.mimetype } });

            stream.on('error', (err) => {
                reject(err);
            });

            stream.on('finish', async () => {
                if (makePublic) {
                    return file.makePublic().then(() => {
                        resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`);
                    });
                } else {
                    return resolve(gcsFileName);
                }
            });

            stream.end(req.file.buffer);
        });
    }

    static async generateSignedUrl(url, minutes) {
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + minutes * 60 * 1000,
        };
        const [signedUrl] = await storage
            .bucket(bucketName)
            .file(url)
            .getSignedUrl(options);
        return signedUrl;
    }
}

module.exports = Storage;