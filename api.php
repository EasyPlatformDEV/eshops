<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Имитация на данни от базата (по-късно тук ще има SELECT от MySQL)
$products = [
    [
        "id" => 1,
        "title" => "Samsung GALAXY телефон A5 256GB Navy",
        "price" => 1299.85,
        "currency" => "$",
        "image" => "https://via.placeholder.com/80x120",
        "shop" => ["name" => "samsung-shop.bg", "icon" => "https://via.placeholder.com/24"],
        "hasAlert" => false
    ],
    [
        "id" => 2,
        "title" => "Samsung Galaxy S23 Ultra - Graphite",
        "price" => 1850.00,
        "currency" => "лв.",
        "image" => "https://via.placeholder.com/80x120",
        "shop" => ["name" => "ozone.bg", "icon" => "https://via.placeholder.com/24"],
        "hasAlert" => true,
        "alertData" => [
            "targetPrice" => 1700,
            "targetCurrency" => "BGN",
            "daysSet" => 30,
            "daysLeft" => 12
        ]
    ]
];

echo json_encode($products);
?>