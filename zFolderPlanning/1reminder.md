## Oke ini reminder lebih ke bagaimana cara menggunakan react jsx yang punya konsep tersendiri diterapkan pada integrasi ini. 

1. Ada beberapa concept react yang tidak perlu digunakan:
* React class component -> ini sudah sepenuhnya tergantikan oleh functional component yang ada dalam concept react hooks
* React router -> ini sudah sepenuhnya tergantikan oleh Inertia.js yang diserahkan pada environment milik routes laravel as backend framework
* Component lifecyle yang biasanya juga menggunakan class component -> karena class component telah tergantikan juga, maka ini juga otomatis ikut tergantikan oleh concept react hooks
* Redux managemen data -> karena backend masuk dalam environment laravel, maka untuk managemen data bisa menggunakan environment laravel seperti concept MVC model view controller.

2. Ada beberapa concept react yang perlu digunakan:
* React functional component -> ini sudah sepenuhnya digunakan menggantikan react class component
* React hooks -> ini sudah sepenuhnya digunakan menggantikan react class component
* Inertia.js -> ini sudah sepenuhnya digunakan menggantikan react router
* Concept MVC model view controller -> ini sudah sepenuhnya digunakan menggantikan redux managemen data
