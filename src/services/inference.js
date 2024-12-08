const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, imageBuffer) {
    try {
        // Preprocess the image
        const tensor = tf.node
            .decodeJpeg(imageBuffer) // Decode the JPEG image
            .resizeBilinear([224, 224]) // Resize to the expected input size
            .expandDims(0) // Add batch dimension
            .toFloat(); // Convert to float

        // Make the prediction
        const prediction = model.predict(tensor);
        const scores = await prediction.data(); // Get the prediction scores
        console.log('Scores:', scores); // Log the score array

        // Define the class labels and additional information for tea leaf diseases
        const diseaseInfo = {
            'Bercak Alga': { // Changed from 'algal_spot' to 'bercak_alga'
                description: "Bercak algal adalah penyakit yang disebabkan oleh alga yang muncul sebagai bercak hijau pada daun tanaman teh. Bercak ini dapat mengurangi fotosintesis dan kesehatan tanaman secara keseluruhan. Kehadiran alga sering kali menunjukkan kelembapan yang berlebihan dan sirkulasi udara yang buruk, yang dapat memperburuk masalah ini. Jika tidak diobati, bercak algal dapat menyebar dengan cepat, mempengaruhi area yang lebih besar dari tanaman.",
                prevention: "Untuk mencegah bercak algal, sangat penting untuk menjaga kebersihan kebun teh. Ini termasuk menghilangkan puing-puing yang dapat menahan kelembapan dan memastikan jarak tanam yang cukup untuk memungkinkan sirkulasi udara yang baik. Selain itu, menghindari irigasi dari atas dapat membantu mengurangi tingkat kelembapan di sekitar daun, sehingga membuatnya kurang kondusif untuk pertumbuhan alga.",
                cure: "Untuk pengobatan, fungisida berbasis tembaga dapat efektif dalam mengendalikan bercak algal. Disarankan juga untuk memangkas daun yang terinfeksi untuk mencegah penyebaran penyakit. Pemantauan rutin tanaman dapat membantu dalam deteksi dini dan pengelolaan penyakit."
            },
            'Bercak Coklat': { // Changed from 'brown_blight' to 'bercak_coklat'
                description: "Bercak coklat ditandai dengan bercak coklat pada daun, yang dapat menyebabkan defoliasi yang signifikan jika tidak dikelola dengan baik. Penyakit ini sering disebabkan oleh patogen jamur yang berkembang biak dalam kondisi lembab. Lesi coklat dapat meluas dan bergabung, menghasilkan area besar jaringan mati pada daun, yang dapat berdampak serius pada kesehatan dan hasil tanaman.",
                prevention: "Mencegah bercak coklat melibatkan memastikan jarak tanam yang cukup untuk meningkatkan aliran udara dan mengurangi kelembapan. Secara rutin menghilangkan daun yang jatuh dan puing-puing dari tanah juga dapat membantu meminimalkan risiko infeksi jamur. Rotasi tanaman dan penggunaan varietas tahan dapat lebih lanjut mengurangi kejadian penyakit ini.",
                cure: "Untuk mengobati bercak coklat, fungisida sistemik direkomendasikan. Fungisida ini menembus jaringan tanaman dan memberikan perlindungan dari dalam. Selain itu, menghilangkan dan menghancurkan daun yang terinfeksi dapat membantu mengendalikan penyebaran penyakit. Penting untuk melakukan pemantauan rutin untuk memastikan bahwa penyakit tidak muncul kembali."
            },
            'Bercak Abu': { // Changed from 'gray_blight' to 'bercak_abu'
                description: "Bercak abu-abu disebabkan oleh patogen jamur yang menyebabkan perkembangan lesi abu-abu pada daun. Penyakit ini dapat mempengaruhi kualitas dan hasil daun teh secara signifikan. Warna abu-abu sering kali disebabkan oleh keberadaan spora jamur, yang dapat menyebar dengan cepat dalam kondisi yang menguntungkan, menyebabkan kerusakan yang luas.",
                prevention: "Untuk mencegah bercak abu-abu, penting untuk mengelola tingkat kelembapan di kebun teh. Menghindari penyiraman yang berlebihan dan memastikan drainase yang baik dapat membantu mengurangi kelembapan yang mendukung pertumbuhan jamur. Selain itu, menjaga kebersihan tanaman dengan menghilangkan bahan tanaman yang terinfeksi dapat membantu mencegah penyakit ini.",
                cure: "Pengobatan untuk bercak abu-abu biasanya melibatkan aplikasi fungisida yang efektif terhadap patogen jamur spesifik yang menyebabkan penyakit ini. Juga bermanfaat untuk memangkas area yang terpengaruh untuk meningkatkan sirkulasi udara dan mengurangi kelembapan di sekitar tanaman. Pemantauan rutin untuk tanda-tanda awal penyakit dapat membantu dalam intervensi yang tepat waktu."
            },
            'Sehat': { // Changed from 'healthy' to 'sehat'
                description: "Ketika tanaman teh sehat, mereka menunjukkan daun hijau cerah dan pertumbuhan yang kuat. Tanaman yang sehat kurang rentan terhadap penyakit dan hama, yang mengarah pada hasil dan kualitas yang lebih baik. Mempertahankan kesehatan tanaman sangat penting untuk produksi teh yang berkelanjutan, karena memastikan bahwa tanaman dapat bertahan dari stres lingkungan dan melawan penyakit.",
                prevention: "Untuk menjaga kesehatan tanaman teh, sangat penting untuk memberikan nutrisi yang cukup melalui pemupukan yang seimbang. Penyiraman secara teratur, terutama selama periode kering, juga penting. Menerapkan praktik pertanian yang baik, seperti pemangkasan yang tepat dan pengelolaan hama, dapat lebih meningkatkan kesehatan dan ketahanan tanaman.",
                cure: "Tidak ada pengobatan khusus yang diperlukan untuk tanaman yang sehat, tetapi perawatan dan pemantauan yang berkelanjutan sangat penting untuk memastikan mereka tetap dalam kondisi baik. Penilaian rutin terhadap kesehatan tanah dan vigor tanaman dapat membantu mengidentifikasi masalah potensial sebelum menjadi masalah serius."
            },
            'Helopeltis': { // Remains unchanged
                description: "Helopeltis adalah hama yang menyerang tanaman teh, menyebabkan kerusakan signifikan pada daun dan tunas muda. Aktivitas makan hama ini dapat menyebabkan layu dan pertumbuhan terhambat, yang sangat mempengaruhi kesehatan keseluruhan tanaman. Infestasi dapat mengakibatkan penurunan hasil dan kualitas daun teh, sehingga penting untuk mengelola hama ini secara efektif. Kehadiran Helopeltis juga dapat membuat tanaman lebih rentan terhadap infeksi sekunder dari patogen.",
                prevention: "Mencegah infestasi Helopeltis melibatkan penerapan strategi manajemen hama terpadu. Ini termasuk menggunakan perangkap untuk memantau populasi hama dan menjaga kebersihan kebun teh untuk mengurangi tempat persembunyian bagi hama. Inspeksi rutin tanaman dapat membantu dalam deteksi dini, dan mempromosikan predator alami juga dapat membantu mengendalikan populasi Helopeltis.",
                cure: "Untuk mengendalikan Helopeltis, aplikasi insektisida yang sesuai sering kali diperlukan. Penting untuk memilih insektisida yang efektif terhadap hama spesifik ini sambil tetap aman untuk serangga bermanfaat. Selain itu, memangkas tunas yang terinfeksi dapat membantu mengurangi populasi hama dan meningkatkan kesehatan keseluruhan tanaman."
            },
            'Bercak Merah': { // Changed from 'red_spot' to 'bercak_merah'
                description: "Penyakit bercak merah ditandai dengan munculnya lesi merah pada daun, yang dapat mengganggu fotosintesis dan kesehatan tanaman secara keseluruhan. Penyakit ini sering disebabkan oleh patogen jamur dan dapat menyebabkan kerugian hasil yang signifikan jika tidak ditangani dengan cepat. Bercak merah dapat meluas dan menyebabkan daun rontok, yang semakin menekan tanaman.",
                prevention: "Untuk mencegah penyakit bercak merah, penting untuk mengelola tingkat kelembapan dan menghindari penumpukan tanaman, yang dapat menciptakan lingkungan lembab yang kondusif untuk pertumbuhan jamur. Secara rutin membersihkan daun yang jatuh dan puing-puing juga dapat membantu meminimalkan risiko infeksi. Rotasi tanaman dan penggunaan varietas tahan dapat lebih meningkatkan ketahanan terhadap penyakit.",
                cure: "Pengobatan untuk penyakit bercak merah biasanya melibatkan penggunaan fungisida yang menargetkan jamur spesifik yang bertanggung jawab atas penyakit ini. Juga disarankan untuk menghilangkan dan menghancurkan daun yang terinfeksi untuk mencegah penyebaran penyakit. Pemantauan rutin dan intervensi tepat waktu adalah kunci untuk mengelola penyakit ini secara efektif."
            }
        };

        // Find the index of the highest score
        const maxIndex = scores.indexOf(Math.max(...scores));
        const label = Object.keys(diseaseInfo)[maxIndex]; // Get the corresponding label
        const probability = scores[maxIndex]; // Get the probability for the predicted class

        // Get the additional information for the predicted label
        const { description, prevention, cure } = diseaseInfo[label];

        // Return the results
        return { label, probability, description, prevention, cure };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan dalam melakukan prediksi: ` + error.message);
    }
}

module.exports = predictClassification;