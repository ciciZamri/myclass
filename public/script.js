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