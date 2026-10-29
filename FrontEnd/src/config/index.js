// export const registerFormControls = [
//   {
//     name: "userName",
//     label: "User Name",
//     placeholder: "Enter your user name",
//     componentType: "input",
//     type: "text",
//   },
//   {
//     name: "email",
//     label: "Email",
//     placeholder: "Enter your email",
//     componentType: "input",
//     type: "email",
//   },
//   {
//     name: "password",
//     label: "Password",
//     placeholder: "Enter your password",
//     componentType: "input",
//     type: "password",
//   },
// ];

// export const loginFormControls = [
//   {
//     name: "email",
//     label: "Email",
//     placeholder: "Enter your email",
//     componentType: "input",
//     type: "email",
//   },
//   {
//     name: "password",
//     label: "Password",
//     placeholder: "Enter your password",
//     componentType: "input",
//     type: "password",
//   },
// ];

// export const addProductFormElements = [
//   {
//     label: "Title",
//     name: "title",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter gadget title",
//   },
//   {
//     label: "Description",
//     name: "description",
//     componentType: "textarea",
//     placeholder: "Enter gadget description",
//   },
//   {
//     label: "Category",
//     name: "category",
//     componentType: "select",
//     options: [
//       { id: "smartphones", label: "Smartphones" },
//       { id: "laptops", label: "Laptops" },
//       { id: "tablets", label: "Tablets" },
//       { id: "smartwatches", label: "smartwatches" },
//       { id: "gaming", label: "Gaming" },
//       { id: "accessories", label: "Accessories" },
//     ],
//   },
//   {
//     label: "Brand",
//     name: "brand",
//     componentType: "select",
//     options: [
//       { id: "apple", label: "Apple" },
//       { id: "samsung", label: "Samsung" },
//       { id: "sony", label: "Sony" },
//       { id: "dell", label: "Dell" },
//       { id: "hp", label: "HP" },
//       { id: "lenovo", label: "Lenovo" },
//       { id: "google", label: "Google" },
//       { id: "tecno", label: "Tecno" },
//       { id: "redmi", label: "Redmi" },
//     ],
//   },
//   {
//     label: "Price",
//     name: "price",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter gadget price",
//   },
//   {
//     label: "Sale Price",
//     name: "salePrice",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter sale price (optional)",
//   },
//   {
//     label: "Total Stock",
//     name: "totalStock",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter total stock",
//   },
//   {
//     label: "Condition",
//     name: "condition",
//     componentType: "select",
//     options: [
//       { id: "Brand New", label: "Brand New" },
//       { id: "Premium Used", label: "Premium Used" },
//     ],
//   },
// ];

// export const shoppingViewHeaderMenuItems = [
//   {
//     id: "home",
//     label: "Home",
//     path: "/shop/home",
//   },
//   {
//     id: "products",
//     label: "Products",
//     path: "/shop/listing",
//   },
//   {
//     id: "tablets",
//     label: "Tablets",
//     path: "/shop/listing",
//   },
//   {
//     id: "smartphones",
//     label: "Smartphones",
//     path: "/shop/listing",
//   },
//   {
//     id: "laptops",
//     label: "Laptops",
//     path: "/shop/listing",
//   },
//   {
//     id: "accessories",
//     label: "Accessories",
//     path: "/shop/listing",
//   },
//   {
//     id: "about",
//     label: "About",
//     path: "/shop/about",
//   },
// ];

// export const categoryOptionsMap = {
//   smartphones: "Smartphones",
//   laptops: "Laptops",
//   tablets: "Tablets",
//   smartwatches: "Smartwatches",
//   gaming: "Gaming",
//   accessories: "Accessories",
//   other: "Other",
// };

// export const brandOptionsMap = {
//   apple: "Apple",
//   samsung: "Samsung",
//   sony: "Sony",
//   dell: "Dell",
//   hp: "HP",
//   lenovo: "Lenovo",
//   google: "Google",
//   tecno: "Tecno",
//   redmi: "Redmi",
//   other: "Other",
// };

// export const filterOptions = {
//   category: [
//     { id: "smartphones", label: "Smartphones" },
//     { id: "laptops", label: "Laptops" },
//     { id: "tablets", label: "Tablets" },
//     { id: "smartwatches", label: "Smartwatches" },
//     { id: "gaming", label: "Gaming" },
//     { id: "accessories", label: "Accessories" },

//   ],
//   brand: [
//     { id: "apple", label: "Apple" },
//     { id: "samsung", label: "Samsung" },
//     { id: "sony", label: "Sony" },
//     { id: "dell", label: "Dell" },
//     { id: "hp", label: "HP" },
//     { id: "lenovo", label: "Lenovo" },
//     { id: "google", label: "Google" },
//     { id: "tecno", label: "Tecno" },
//     { id: "redmi", label: "Redmi" },
//   ],
//   condition: [
//     // New condition filter added
//     { id: "Brand New", label: "Brand New" },
//     { id: "Premium Used", label: "Premium Used" },
//   ],
// };

// export const sortOptions = [
//   { id: "price-lowtohigh", label: "Price: Low to High" },
//   { id: "price-hightolow", label: "Price: High to Low" },
//   { id: "title-atoz", label: "Title: A to Z" },
//   { id: "title-ztoa", label: "Title: Z to A" },
// ];

// export const addressFormControls = [
//   {
//     label: "Full Name",
//     name: "fullName",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your full name",
//   },
//   {
//     label: "Address",
//     name: "address",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your address",
//   },
//   {
//     label: "Local Government Area (LGA)",
//     name: "lga",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your Local Government Area",
//   },
//   {
//     label: "City/State",
//     name: "state",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your state",
//   },
//   {
//     label: "Phone",
//     name: "phone",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your phone number",
//   },
//   // {
//   //   label: "Postal Code",
//   //   name: "pincode",
//   //   componentType: "input",
//   //   type: "text",
//   //   placeholder: "Enter your postal code",
//   // },
//   {
//     label: "Country",
//     name: "country",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your country (default: Nigeria)",
//     value: "Nigeria", // Pre-set this field to Nigeria
//     readOnly: true, // Make it readonly for Nigeria unless supporting other countries
//   },
//   {
//     label: "Notes",
//     name: "notes",
//     componentType: "textarea",
//     placeholder: "Enter any additional notes",
//   },
// ];

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter gadget title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter gadget description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "smartphones", label: "Smartphones" },
      { id: "laptops", label: "Laptops" },
      { id: "tablets", label: "Tablets" },
      { id: "smartwatches", label: "smartwatches" },
      { id: "gaming", label: "Gaming" },
      { id: "accessories", label: "Accessories" },
      { id: "speaker", label: "Speaker" }, // Added new category
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "dell", label: "Dell" },
      { id: "hp", label: "HP" },
      { id: "lenovo", label: "Lenovo" },
      { id: "google", label: "Google" },
      { id: "tecno", label: "Tecno" },
      { id: "redmi", label: "Redmi" },
      { id: "jbl", label: "JBL" }, // Added new brand
      { id: "zealot", label: "Zealot" }, // Added new brand
      { id: "google-pixel", label: "Google Pixel" }, // Added new brand
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter gadget price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Condition",
    name: "condition",
    componentType: "select",
    options: [
      { id: "Brand New", label: "Brand New" },
      { id: "Premium Used", label: "Premium Used" },
    ],
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "tablets",
    label: "Tablets",
    path: "/shop/listing",
  },
  {
    id: "smartphones",
    label: "Smartphones",
    path: "/shop/listing",
  },
  {
    id: "laptops",
    label: "Laptops",
    path: "/shop/listing",
  },
  {
    id: "speaker",
    label: "Speakers",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },

  {
    id: "about",
    label: "About",
    path: "/shop/about",
  },
];

export const categoryOptionsMap = {
  smartphones: "Smartphones",
  laptops: "Laptops",
  tablets: "Tablets",
  smartwatches: "Smartwatches",
  gaming: "Gaming",
  accessories: "Accessories",
  speaker: "Speaker",
  other: "Other",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo",
  tecno: "Tecno",
  redmi: "Redmi",
  jbl: "JBL",
  zealot: "Zealot",
  "google-pixel": "Google Pixel",
  other: "Other",
};

export const filterOptions = {
  category: [
    { id: "smartphones", label: "Smartphones" },
    { id: "laptops", label: "Laptops" },
    { id: "tablets", label: "Tablets" },
    { id: "smartwatches", label: "Smartwatches" },
    { id: "gaming", label: "Gaming" },
    { id: "accessories", label: "Accessories" },
    { id: "speaker", label: "Speaker" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "dell", label: "Dell" },
    { id: "hp", label: "HP" },
    { id: "lenovo", label: "Lenovo" },
    { id: "tecno", label: "Tecno" },
    { id: "redmi", label: "Redmi" },
    { id: "jbl", label: "JBL" },
    { id: "zealot", label: "Zealot" },
    { id: "google-pixel", label: "Google Pixel" },
  ],
  condition: [
    { id: "Brand New", label: "Brand New" },
    { id: "Premium Used", label: "Premium Used" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Full Name",
    name: "fullName",
    componentType: "input",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "Local Government Area (LGA)",
    name: "lga",
    componentType: "input",
    type: "text",
    placeholder: "Enter your Local Government Area",
  },
  {
    label: "City/State",
    name: "state",
    componentType: "input",
    type: "text",
    placeholder: "Enter your state",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Country",
    name: "country",
    componentType: "input",
    type: "text",
    placeholder: "Enter your country (default: Nigeria)",
    value: "Nigeria",
    readOnly: true,
  },
  {
    label: "Notes (Optional)",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];