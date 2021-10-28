const { Storage: GCS } = require('@google-cloud/storage');
const Random = require('./random');
const AppError = require('../utils/error');

const storage = new GCS({
    projectId: 'sandbox-99',
    keyFilename: './08bf4da24.json'
});

class Storage {
    static upload(req, category) {
        if(!(['package', 'product'].includes(category))) throw new AppError(400, 'invaild-category', 'category must be "package" or "product"');
        const bucketName = 'bucketname';
        return new Promise((resolve, reject) => {
            const bucket = storage.bucket(bucketName);
            const random = Random.randomStr(12) + (Date.now()).toString();
            const now = new Date(Date.now());
            const gcsFileName = `${inDevMode ? `${category}s/` : ''}${now.getFullYear()}-${now.getMonth() + 1}/${random}-${req.file.originalname}`;
            const file = bucket.file(gcsFileName);

            const stream = file.createWriteStream({ metadata: { contentType: req.file.mimetype } });

            stream.on('error', (err) => {
                reject(err);
            });

            stream.on('finish', async () => {
                return file.makePublic().then(() => {
                    resolve(`https://storage.googleapis.com/${bucketName}/${gcsFileName}`);
                });
            });

            stream.end(req.file.buffer);
        });
    }

    static async generateSignedUrl(url, minutes) {
        const options = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + minutes * 60 * 1000, // 15 minutes
        };
        const [signedUrl] = await storage
            .bucket(bucketName)
            .file(url)
            .getSignedUrl(options);
        return signedUrl;
    }
}

module.exports = Storage;