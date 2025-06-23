<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $userMessage = strtolower(trim($request->input('message')));

        $context = "
        Kamu adalah asisten AI untuk portofolio Haris Yunanda. 
        Jawab dengan bahasa yang santai dan tidak terlalu formal, dalam bahasa Indonesia.
        Jawaban maksimal 80 kata.

        Informasi tentang Haris Yunanda:
        - Lokasi: Medan, Sumatera Utara
        - Lulusan: S1 Teknik Informatika, Universitas Malikussaleh
        - Keahlian: Full Stack Web Development - Advance Beginner (PHP, JavaScript, Python, SQL), Machine Learning & Deep Learning (TensorFlow, PyTorch, Scikit-learn)
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

        Jika ditanya:
        - Tentang pacar Haris, jawab dengan nada santai dan jawab bahwa pacarnya itu adalah si penanya.
        - Tentang lokasi Haris, jawab bahwa Haris berada di Medan, Sumatera Utara, dan aktif mengerjakan proyek teknologi.
        - Tentang hobi Haris, jawab bahwa dia suka jalan-jalan, main game, dan tentu suka kamu juga.
        - Tentang makanan favorit Haris, jawab dia suka makanan dengan kuah kacang, tapi lebih suka kalau makannya bareng kamu/si penanya.
        - Tentang film, jawab dia suka film sci-fi dan action.
        - Tentang musik, jawab dia suka musik pop dan instrumental yang santai.

        Jika pertanyaannya di luar informasi ini, jawab secara santai dan tidak terlalu formal.
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
}
