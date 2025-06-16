<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    // Array untuk menyimpan custom responses
    private $customResponses = [
        // Pertanyaan tentang pacar
        'siapa pacar haris' => 'Hmmm kepo nih, Pacar Haris itu ya kamu, kok gatau sih! 😊',
        'apakah haris punya pacar' => 'Hmmm kepo nih, Pacar Haris itu ya kamu, kok gatau sih! 😊',
        'pacar haris siapa' => 'aduhh malu deh ditanyain, Pacar Haris itu ya kamu, kok gatau sih! 😊',

        // Pertanyaan tentang lokasi/keberadaan
        'dimana haris sekarang' => 'Haris saat ini berada di Medan, Sumatera Utara dan aktif mengerjakan berbagai proyek web development dan AI.',
        'haris dimana' => 'Haris berada di Medan, Sumatera Utara. Dia aktif sebagai freelancer dan mengembangkan berbagai proyek teknologi.',
        'lokasi haris' => 'Haris tinggal di Medan, Sumatera Utara.',

        // Pertanyaan random lainnya
        'hobby haris' => 'Haris suka berpergian, bermain game, dan tentunya suka kamu hehe',
        'makanan favorit haris' => 'Haris suka makanan yang ada kuah kacang nya wkwk, tapi apapun makanannya kalau makannya baren kamu aku suka kok!',
        'film favorit haris' => 'Haris suka film-film sci-fi dan action',
        'musik favorit haris' => 'Haris mendengarkan berbagai genre musik, dari pop hingga instrumental yang cocok nyantai.',
    ];

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $userMessage = strtolower(trim($request->input('message')));

        // Cek apakah ada custom response untuk pertanyaan ini
        $customResponse = $this->getCustomResponse($userMessage);

        if ($customResponse) {
            return response()->json([
                'success' => true,
                'message' => $customResponse
            ]);
        }

        // Jika tidak ada custom response, lanjut ke AI
        $context = "
        Kamu adalah asisten AI untuk portofolio Haris Yunanda. 
        Jawab dengan bahasa yang santai dan tidak terlalu formal, dalam bahasa Indonesia.
        Informasi tentang Haris Yunanda:
        - Lokasi: Medan, Sumatera Utara
        - Lulusan: S1 Teknik Informatika, Universitas Malikussaleh
        - Keahlian: Full Stack Web Development (PHP, JavaScript, Python, SQL), Machine Learning & Deep Learning (TensorFlow, PyTorch, Scikit-learn)
        - Pengalaman:
          • Web Developer di RSUD Langsa - Sistem Rekam Medis Elektronik (Laravel, Redis, SQL)
          • Freelancer: Web & AI/ML Projects (Web Development, Machine Learning, Deep Learning)
          • Peserta Kemah Budaya Kemendikbudristek - Website Penerjemah Bahasa Daerah
          • IT Developer Intern di Cybers Global Indonesia
        - Organisasi:
          • Koordinator Beasiswa Cendekia BAZNAS UNIMAL
          • Ketua Bidang Infokom KKN Tematik
          • Ketua Tim E-Sport Himpunan Informatika
        - Kontak: 
          • Email: yunandaharis@gmail.com
          • LinkedIn: linkedin.com/in/harisyunanda20
          • Instagram: @harisrangkuti_
        
        Jika ditanya di luar topik ini, jawab saja secara santai dan tidak terlalu formal.
        Jawaban jangan lebih dari 80 kata.
        ";

        try {
            $client = new Client();
            $apiKey = env('GEMINI_API_KEY');
            $response = $client->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}", [
                'json' => [
                    'contents' => [
                        [
                            'parts' => [
                                [
                                    'text' => $context . "\n\nPertanyaan user: " . $request->input('message')
                                ]
                            ]
                        ]
                    ]
                ],
                'headers' => [
                    'Content-Type' => 'application/json'
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            $aiMessage = $data['candidates'][0]['content']['parts'][0]['text'];

            return response()->json([
                'success' => true,
                'message' => trim($aiMessage)
            ]);
        } catch (RequestException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, sedang ada masalah teknis. Coba lagi nanti ya!'
            ], 500);
        }
    }

    /**
     * Mencari custom response berdasarkan pertanyaan user
     */
    private function getCustomResponse($userMessage)
    {
        // Cek exact match dulu
        if (isset($this->customResponses[$userMessage])) {
            return $this->customResponses[$userMessage];
        }

        // Cek partial match (mengandung kata kunci)
        foreach ($this->customResponses as $keyword => $response) {
            if (strpos($userMessage, $keyword) !== false) {
                return $response;
            }
        }

        // Cek dengan kata kunci yang lebih fleksibel
        $flexibleMatches = [
            ['keywords' => ['pacar', 'cewek', 'gebetan', 'girlfriend'], 'response' => 'Pacar Haris itu ya kamu, kok gatau sih! 😊'],
            ['keywords' => ['dimana', 'lokasi', 'tinggal', 'alamat'], 'response' => 'Haris saat ini berada di Medan, Sumatera Utara dan aktif mengerjakan berbagai proyek web development dan AI.'],
            ['keywords' => ['hobby', 'hobi', 'suka', 'kesukaan'], 'response' => 'Haris suka berpergian, bermain game, dan tentunya suka kamu hehe.'],
            ['keywords' => ['makanan', 'makan', 'kuliner'], 'response' => 'Haris suka makanan yang ada kuah kacang nya wkwk, tapi apapun makanannya kalau makannya bareng kamu aku suka kok!'],
            ['keywords' => ['film', 'movie', 'cinema'], 'response' => 'Haris suka film-film sci-fi dan action'],
            ['keywords' => ['musik', 'lagu', 'music'], 'response' => 'Haris mendengarkan berbagai genre musik, dari pop hingga instrumental yang cocok untuk coding.'],
            ['keywords' => ['game', 'gaming', 'main'], 'response' => 'Haris suka game strategy dan competitive gaming.'],
        ];

        foreach ($flexibleMatches as $match) {
            foreach ($match['keywords'] as $keyword) {
                if (strpos($userMessage, $keyword) !== false) {
                    return $match['response'];
                }
            }
        }

        return null; // Tidak ada custom response
    }
}
