const attachmentField = `
    <div class="mb-2" >
        <label class="block" for="attachment_category">Attachment</label>
        <select class="rounded border border-gray-900 p-1 w-full" id="attachment_category" name="attachment_category">
            <option value="none" #{post.attachment.category == 'none' ? 'selected' : ''} >None</option>
            <option value="pdf" #{post.attachment.category == 'pdf' ? 'selected' : ''}>PDF</option>
            <option value="url" #{post.attachment.category == 'url' ? 'selected' : ''}>URL link</option>
            <option value="image" #{post.attachment.category == 'image' ? 'selected' : ''}>Image</option>
        </select>
    </div>
    <div class="mb-3" id="attachment" ></div>
`;

document.getElementById("update_attachment").addEventListener('change', (e) => {
    const container = document.getElementById("attachment_container");
    if(e.target.checked){
        container.innerHTML = attachmentField;
        document.getElementById("attachment_category").addEventListener("change", (e) => {
            const dom = document.getElementById("attachment");
            const category = e.target.value;
            if(category === 'pdf'){
                dom.innerHTML = `
                    <label class="block" >Upload PDF</label>
                    <input type="file" name="attachment_content" accept=".pdf" required>
                `;
            }else if(category === 'url'){
                dom.innerHTML = `
                    <label class="block" >Add link</label>
                    <input class="rounded border border-gray-900 p-1 w-full" type="url" name="attachment_content" required>
                `;
            }else if(category === 'image'){
                dom.innerHTML = `
                    <label class="block" >Upload image</label>
                    <input type="file" name="attachment_content" accept="image/png, image/jpeg" required>
                `;
            }else{
                dom.innerHTML = '';
            }
        });
    }else{
        container.innerHTML = '';
    }
});