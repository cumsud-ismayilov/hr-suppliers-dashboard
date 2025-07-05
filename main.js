const url = "https://northwind.vercel.app/api/suppliers";
const companyElem = document.querySelector("#companies");
const companyForm = document.querySelector("#companyForm");
const cancelBtn = document.querySelector("#cancel");
const createModal = document.querySelector("#createModal");
const openModal = document.querySelector("#openModal");
const saveBtn = document.querySelector("#save");
const toast = document.querySelector("#toast")
const searchCompany = document.querySelector("#searchCompany")
domRender();
let editId = null;
async function getAllData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
     return [];
  } finally {
    console.log("finsih");
  }
}

async function domRender() {
  const info = await getAllData();
  companyElem.innerHTML = "";
  info.forEach((company) => {
    companyElem.innerHTML += `
                      <div class="p-[30px] border-[1px] border-green-500 shadow-lg rounded-[10px] relative">
                <h2 class="text-[25px] font-[700] break-words">${
                  company.companyName || "Məlumat Yoxdur"
                } </h2>
                <p>Contact name : ${company.contactName || "Məlumat Yoxdur"}</p>
                <p>Contact Title : ${
                  company.contactTitle || "Məlumat Yoxdur"
                }</p>
                <p>City : ${company.address.city || "Məlumat Yoxdur"}</p>
                <p>Country : ${company.address.country || "Məlumat Yoxdur"}</p>
                <div class="absolute bottom-[10px] right-[10px]">
                    <button onclick ="deleteCompany(${
                      company.id
                    })"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6 text-green-500 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                    <button onclick = "editCompany(${
                      company.id
                    })"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6 text-green-500 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
  });
}

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const {
    companyName,
    contactName,
    contactTitle,
    city,
    country,
    region,
    street,
    postalCode,
    phone,
  } = companyForm;

  const newCompany = {
    companyName: companyName.value,
    contactName: contactName.value,
    contactTitle: contactTitle.value,
    address: {
      street: street.value,
      city: city.value,
      region: region.value,
      postalCode: postalCode.value,
      country: country.value,
      phone: phone.value,
    },
  };
  saveBtn.disabled = true;
  if (editId) {
      fetch(`${url}/${editId}`, {
    method: "put",
    body: JSON.stringify(newCompany),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => domRender())
    .catch((err) => console.error("Xəta:", err))
    .finally(() => {
      createModal.classList.add("hidden");
      companyForm.reset();
      saveBtn.disabled = false;
      editId = null
    });
  } else {
      fetch(url, {
    method: "POST",
    body: JSON.stringify(newCompany),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
        showToast("Məlumat uğurla əlavə olundu ✅");
        domRender()
    })
    .catch((err) => {
        console.error("Xəta:", err)
        showToast("Xəta baş verdi ❌", "bg-red-500")
    })
    .finally(() => {
      createModal.classList.add("hidden");
      companyForm.reset();
      saveBtn.disabled = false;
    
    });
  }
});

cancelBtn.addEventListener("click", () => {
  createModal.classList.add("hidden");
});
openModal.addEventListener("click", () => {
  createModal.classList.remove("hidden");
});

function deleteCompany(id) {
  fetch(`${url}/${id}`, {
    method: "delete",
  }).then(() => {
    showToast("Məlumat uğurla silindi ✅");
    domRender()
  }).catch((err) => {
      console.error(err);
      showToast("Xəta baş verdi ❌", "bg-red-500");
    });
}

function editCompany(id) {
  editId = id;
  createModal.classList.remove("hidden");
  fetch(`${url}/${id}`).then(res => res.json()).then(data=>{
    companyForm.companyName.value = data.companyName
    companyForm.contactName.value = data.contactName
    companyForm.contactTitle.value = data.contactTitle
    companyForm.street.value = data.address.street
    companyForm.city.value = data.address.city
    companyForm.region.value = data.address.region
    companyForm.postalCode.value = data.address.postalCode
    companyForm.country.value = data.address.country
    companyForm.phone.value = data.address.phone
  })
}


function showToast(message, color = "bg-green-500") {

  toast.textContent = message;
 
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}



// searchCompany.addEventListener("input" ,async ()=>{
//       if (!val) {
//     domRender(data);
//     return;
//   }
//     const val = searchCompany.value.toLowerCase();
    
//      const data = await getAllData();

//   const filtered = data.filter(company =>
//     company.companyName?.toLowerCase().includes(val) ||
//     company.contactName?.toLowerCase().includes(val) ||
//     company.contactTitle?.toLowerCase().includes(val) ||
//     company.address.city?.toLowerCase().includes(val) ||
//     company.address.country?.toLowerCase().includes(val)
//   );

//   domRender(filtered);
    
// })