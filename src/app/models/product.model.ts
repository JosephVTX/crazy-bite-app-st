// src/app/models/product.model.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string; // Podrías usarlo para filtrar
}