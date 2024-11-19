import getConfig from "@config/dotenv"

const templateHtmlEmailVerif = (
    val: any
) => {
    try {
        const contentReset = `
        <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 20px; margin-bottom: 40px;">
            Verifikasi Akun Vendor
        </h1>
        <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
            Anda menerima email ini karena kami menerima permintaan untuk verifikasi akun
        </p>
        <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
            Silahkan klik link di bawah dan ikuti tahapannya:
        </p>

        <br><br><br>

        <div style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
            <p>Silahkan klik tombol di bawah ini:</p>
            <a href="${val}" style="background-color: #212B36; border-radius: 8px; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold; margin: 4px 2px; cursor: pointer;">
                Verifikasi
            </a>

            <br><br><br>

            <p>Atau copy link di bawah:</p>
            <a href="${val}" style="text-decoration: none; color: #007bff; font-weight: bold;">
                ${val}
            </a>

            <br><br><br>

            <p>Jika anda tidak pernah meminta permintaan ini, silahkan abaikan email ini.</p>
        </div>
        `
        // const contentBerhasil = `
        // <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 20px; margin-bottom: 40px;">
        //     Tanda Tangan Elektronik Berhasil Dibuat
        // </h1>
        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     Silahkan gunakan PIN anda untuk melakukan
        // </p>
        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     tanda tangan secara elektronik pada aplikasi-aplikasi ProMISe
        // </p>

        // <br><br><br><br>

        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     PIN anda:
        // </p>

        // <p style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 36px; margin-bottom: 15px;">
        //     ${val.pin}
        // </p>

        // <br><br><br><br>

        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     Jika anda tidak pernah meminta permintaan ini, silahkan abaikan email ini.
        // </p>
        // `
        let content = contentReset

        // if (status === "berhasil") {
        //     content = contentBerhasil
        // }

        const css = `
            a.link {
                text-decoration: none;  /* Menghilangkan garis bawah */
                color: #007bff;         /* Warna biru untuk tautan */
                font-weight: bold;      /* Membuat teks tebal */
            }

            a.link:active {
                color: #ff0000;         /* Warna saat tautan diklik */
            }
            .button-link {
                background-color: #212B36;
                border-radius: 8px;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                margin: 4px 2px;
                cursor: pointer;
            }
            @media (max-width: 768px) {
                .button-link {
                    padding: 15px 32px;
                    font-size: 12px;
                }
            }
            .container-header {
                text-align: center;
                padding-top: 70px;
                padding-bottom: 90px;
                background-color: #fff3f1;
            }
            .container-body {
                text-align: center;
                padding-top: 5px;
                padding-bottom: 15px;
                background-color: white;
            }
            .content-card {
                padding-top: 50px;
                padding-right: 70px;
                padding-bottom: 50px;
                padding-left: 70px;
            }
            .fredoka1 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 36px;
                margin-bottom: 15px;
            }
            a.fredoka1 {
                font-weight: bold;
            }
            .fredoka2 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 20px;
                margin-bottom: 40px;
            }
            .footer-fredoka1 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 16px;
                padding: 25px;
                margin-bottom: 40px;
            }
            @media (max-width: 768px) {
                .fredoka2 {
                    font-size: 15px;
                }
            }
            
            .public-sans {
                font-family: "Public Sans", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-size: 14px;
            }
    
            footer {
                background-color: #fff;
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #000;
                text-align: left;
            }
    
            .footer-content {
                display: flex;
                justify-content: space-around;
                margin-bottom: 20px;
            }
    
            .footer-section {
                width: 30%;
            }
    
            .footer-section h4 {
                font-weight: bold;
                margin-bottom: 10px;
            }
    
            .footer-section p {
                margin: 0;
                line-height: 1.5;
            }
    
            .footer-bottom {
                border-top: 1px solid #ccc;
                padding: 25px;
                font-size: 12px;
            }
    
            @media (max-width: 768px) {
                .footer-content {
                    flex-direction: column;
                    align-items: center;
                }
                
                .footer-section {
                    width: 100%;
                    margin-bottom: 20px;
                }
            }
            header {
                background-color: #fff;
                padding: 20px 0;
                text-align: center;
            }
    
            .header-content {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px; /* Jarak antara kedua logo */
            }
    
            .logo {
                max-height: 60px; /* Sesuaikan ukuran logo */
            }
    
            @media (max-width: 768px) {
                .header-content {
                    flex-direction: column;
                    gap: 10px; /* Jarak yang lebih kecil untuk layar mobile */
                }
                
                .logo {
                    max-height: 60px; /* Ukuran logo lebih kecil di layar sempit */
                }
            }
        `
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
            <title>Page Title</title>
        </head>
        <body>
            <header style="background-color: #fff; padding: 20px 0; text-align: center;">
                <table role="presentation" style="margin: 0 auto;">
                    <tr>
                        <td style="padding: 0 15px; text-align: center;">
                            <img src="${getConfig("ASSETS")}UTLOGO.png" style="max-height: 60px;">
                        </td>
                        <td style="padding: 0 15px; text-align: center;">
                            <img src="${getConfig("ASSETS")}logopromise.png" style="max-height: 60px;">
                        </td>
                    </tr>
                </table>
            </header>

            <div style="text-align: center; padding-top: 70px; padding-bottom: 90px; background-color: #fff3f1;">
                <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 36px; margin-bottom: 15px;">ProMISe</h1>
                <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">Smart Procurement Management Information System</p>
                <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">Universitas Terbuka</p>
            </div>

            <div style="text-align: center; padding-top: 5px; padding-bottom: 15px; background-color: white;">
                <div style="padding-top: 50px; padding-right: 70px; padding-bottom: 50px; padding-left: 70px;">
                    ${content}
                </div>
            </div>

            <footer style="background-color: #fff; padding: 120px; font-family: Arial, sans-serif; font-size: 14px; color: #000; text-align: left;">
                <div style="font-family: 'Fredoka', sans-serif; font-size: 16px; padding: 12px; margin-bottom: 40px;">
                    <h1>ProMISe</h1>
                    <p style="font-family: 'Public Sans', sans-serif; font-size: 14px;">Smart Procurement Management</p>
                    <p style="font-family: 'Public Sans', sans-serif; font-size: 14px;">Information System</p>
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">ALAMAT</h4>
                            <p style="margin: 0; line-height: 1.5;">Jl. Pd. Cabe Raya, Pd. Cabe Udik,<br>Kec. Pamulang, Kota Tangerang Selatan, Banten 15437</p>
                        </td>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">KONTAK</h4>
                            <p style="margin: 0; line-height: 1.5;">021-7490941<br>ext. 2207</p>
                        </td>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">EMAIL</h4>
                            <p style="margin: 0; line-height: 1.5;">promisesupport@ecampus.ut.ac.id</p>
                        </td>
                    </tr>
                </table>

                <div style="border-top: 1px solid #ccc; padding: 12px; font-size: 12px;">
                    <p>&copy; 2024 Universitas Terbuka</p>
                </div>
            </footer>
        </body>
        </html>
        `
        return html;
    } catch (error) {
        throw new Error('Halaman Sedang Tidak Tersedia')
    }
}

const templateHtmlEmailFailed = (
    val: any
) => {
    try {
        const contentReset = `
        <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 20px; margin-bottom: 40px;">
            Verifikasi Akun Vendor
        </h1>
        <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
            Anda menerima email ini karena kami menerima permintaan untuk verifikasi akun
        </p>

        <br><br><br>

        <div style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
            <p>Verifikasi Akun Anda ditolak dengan alasan:</p>
            
            <h4>${val}</h4>

            <br><br><br>


            <p>Jika anda tidak pernah meminta permintaan ini, silahkan abaikan email ini.</p>
        </div>
        `
        // const contentBerhasil = `
        // <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 20px; margin-bottom: 40px;">
        //     Tanda Tangan Elektronik Berhasil Dibuat
        // </h1>
        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     Silahkan gunakan PIN anda untuk melakukan
        // </p>
        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     tanda tangan secara elektronik pada aplikasi-aplikasi ProMISe
        // </p>

        // <br><br><br><br>

        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     PIN anda:
        // </p>

        // <p style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 36px; margin-bottom: 15px;">
        //     ${val.pin}
        // </p>

        // <br><br><br><br>

        // <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">
        //     Jika anda tidak pernah meminta permintaan ini, silahkan abaikan email ini.
        // </p>
        // `
        let content = contentReset

        // if (status === "berhasil") {
        //     content = contentBerhasil
        // }

        const css = `
            a.link {
                text-decoration: none;  /* Menghilangkan garis bawah */
                color: #007bff;         /* Warna biru untuk tautan */
                font-weight: bold;      /* Membuat teks tebal */
            }

            a.link:active {
                color: #ff0000;         /* Warna saat tautan diklik */
            }
            .button-link {
                background-color: #212B36;
                border-radius: 8px;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                margin: 4px 2px;
                cursor: pointer;
            }
            @media (max-width: 768px) {
                .button-link {
                    padding: 15px 32px;
                    font-size: 12px;
                }
            }
            .container-header {
                text-align: center;
                padding-top: 70px;
                padding-bottom: 90px;
                background-color: #fff3f1;
            }
            .container-body {
                text-align: center;
                padding-top: 5px;
                padding-bottom: 15px;
                background-color: white;
            }
            .content-card {
                padding-top: 50px;
                padding-right: 70px;
                padding-bottom: 50px;
                padding-left: 70px;
            }
            .fredoka1 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 36px;
                margin-bottom: 15px;
            }
            a.fredoka1 {
                font-weight: bold;
            }
            .fredoka2 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 20px;
                margin-bottom: 40px;
            }
            .footer-fredoka1 {
                font-family: "Fredoka", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-variation-settings:
                    "wdth" 100;
                font-size: 16px;
                padding: 25px;
                margin-bottom: 40px;
            }
            @media (max-width: 768px) {
                .fredoka2 {
                    font-size: 15px;
                }
            }
            
            .public-sans {
                font-family: "Public Sans", sans-serif;
                font-optical-sizing: auto;
                font-weight: <weight>;
                font-style: normal;
                font-size: 14px;
            }
    
            footer {
                background-color: #fff;
                padding: 20px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #000;
                text-align: left;
            }
    
            .footer-content {
                display: flex;
                justify-content: space-around;
                margin-bottom: 20px;
            }
    
            .footer-section {
                width: 30%;
            }
    
            .footer-section h4 {
                font-weight: bold;
                margin-bottom: 10px;
            }
    
            .footer-section p {
                margin: 0;
                line-height: 1.5;
            }
    
            .footer-bottom {
                border-top: 1px solid #ccc;
                padding: 25px;
                font-size: 12px;
            }
    
            @media (max-width: 768px) {
                .footer-content {
                    flex-direction: column;
                    align-items: center;
                }
                
                .footer-section {
                    width: 100%;
                    margin-bottom: 20px;
                }
            }
            header {
                background-color: #fff;
                padding: 20px 0;
                text-align: center;
            }
    
            .header-content {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 30px; /* Jarak antara kedua logo */
            }
    
            .logo {
                max-height: 60px; /* Sesuaikan ukuran logo */
            }
    
            @media (max-width: 768px) {
                .header-content {
                    flex-direction: column;
                    gap: 10px; /* Jarak yang lebih kecil untuk layar mobile */
                }
                
                .logo {
                    max-height: 60px; /* Ukuran logo lebih kecil di layar sempit */
                }
            }
        `
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
            <title>Page Title</title>
        </head>
        <body>
            <header style="background-color: #fff; padding: 20px 0; text-align: center;">
                <table role="presentation" style="margin: 0 auto;">
                    <tr>
                        <td style="padding: 0 15px; text-align: center;">
                            <img src="${getConfig("ASSETS")}UTLOGO.png" style="max-height: 60px;">
                        </td>
                        <td style="padding: 0 15px; text-align: center;">
                            <img src="${getConfig("ASSETS")}logopromise.png" style="max-height: 60px;">
                        </td>
                    </tr>
                </table>
            </header>

            <div style="text-align: center; padding-top: 70px; padding-bottom: 90px; background-color: #fff3f1;">
                <h1 style="font-family: 'Fredoka', sans-serif; font-optical-sizing: auto; font-weight: bold; font-style: normal; font-variation-settings: 'wdth' 100; font-size: 36px; margin-bottom: 15px;">ProMISe</h1>
                <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">Smart Procurement Management Information System</p>
                <p style="font-family: 'Public Sans', sans-serif; font-optical-sizing: auto; font-weight: normal; font-style: normal; font-size: 14px;">Universitas Terbuka</p>
            </div>

            <div style="text-align: center; padding-top: 5px; padding-bottom: 15px; background-color: white;">
                <div style="padding-top: 50px; padding-right: 70px; padding-bottom: 50px; padding-left: 70px;">
                    ${content}
                </div>
            </div>

            <footer style="background-color: #fff; padding: 120px; font-family: Arial, sans-serif; font-size: 14px; color: #000; text-align: left;">
                <div style="font-family: 'Fredoka', sans-serif; font-size: 16px; padding: 12px; margin-bottom: 40px;">
                    <h1>ProMISe</h1>
                    <p style="font-family: 'Public Sans', sans-serif; font-size: 14px;">Smart Procurement Management</p>
                    <p style="font-family: 'Public Sans', sans-serif; font-size: 14px;">Information System</p>
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">ALAMAT</h4>
                            <p style="margin: 0; line-height: 1.5;">Jl. Pd. Cabe Raya, Pd. Cabe Udik,<br>Kec. Pamulang, Kota Tangerang Selatan, Banten 15437</p>
                        </td>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">KONTAK</h4>
                            <p style="margin: 0; line-height: 1.5;">021-7490941<br>ext. 2207</p>
                        </td>
                        <td width="33%" style="vertical-align: top; padding: 10px;">
                            <h4 style="font-weight: bold; margin-bottom: 10px;">EMAIL</h4>
                            <p style="margin: 0; line-height: 1.5;">promisesupport@ecampus.ut.ac.id</p>
                        </td>
                    </tr>
                </table>

                <div style="border-top: 1px solid #ccc; padding: 12px; font-size: 12px;">
                    <p>&copy; 2024 Universitas Terbuka</p>
                </div>
            </footer>
        </body>
        </html>
        `
        return html;
    } catch (error) {
        throw new Error('Halaman Sedang Tidak Tersedia')
    }
}

const validationEmail = (
    validatation: boolean,
    message: string | undefined | null
) => {
    try {
        const validation: boolean = validatation
        const contentBerhasil = `
        <div class="container">
            <img src="${getConfig("ASSETS")}true.svg" style="max-height: 120px;">
            <h1>Berhasil Verifikasi Email</h1>
            <p>Email Berhasil di Verifikasi, Mohon Tunggu Verifikasi Data Oleh Verifikator</p>
        </div>
        `

        const contentGagal = `
        <div class="container">
            <img src="${getConfig("ASSETS")}false.png" style="max-height: 120px;">
            <h1>Gagal Verifikasi Email</h1>
            <p>${message}!!</p>
        </div>
        `

        let content = contentGagal

        if (validation) {
            content = contentBerhasil
        }

        const css = `
        /* Body styling */
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #333, #555);
            margin: 0;
            font-family: Arial, sans-serif;
        }

        /* Container styling */
        .container {
            background-color: #fff;
            width: 450px;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
            
        h1 {
            font-family: 'Fredoka', sans-serif; 
            font-optical-sizing: auto; 
            font-weight: normal; 
            font-style: normal; 
            font-variation-settings: 'wdth' 100; 
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        p {
            font-size: 12px;
        }
        /* Responsive adjustment */
        @media (max-width: 600px) {
            .container {
                width: 80%;
                padding: 15px 20px;
            }
        }
        `
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <title>Ubah PIN</title>
        <style>
            ${css}
        </style>
        </head>
        <body>
        ${content}
        </body>
        </html>
        `

        return html;
    } catch (error) {
        throw new Error('Halaman Sedang Tidak Tersedia')
    }
}


export default {
    templateHtmlEmailVerif,
    validationEmail,
    templateHtmlEmailFailed
}