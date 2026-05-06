<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Schemas\Schema;
use Filament\Infolists\Components\Tabs;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\IconEntry;
class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Product Tabs')
                    ->vertical()
                    ->tabs([
                        Tabs\Tab::make('Product Info')
                            ->icon('heroicon-o-academic-cap')
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Product Name')
                                    ->weight('bold')
                                    ->color('primary'),
                                TextEntry::make('id')
                                    ->label('Product ID'),
                                TextEntry::make('sku')
                                    ->label('SKU')
                                    ->badge()
                                    ->color('success'),
                                TextEntry::make('description')
                                    ->label('Description'),
                            ])
                            ->columnSpanFull(),

                        Tabs\Tab::make('Pricing & Stock')
                            ->icon('heroicon-o-currency-dollar')
                            ->badge(fn ($record) => $record?->stock ?? '0')
                            ->badgeColor('info')
                            ->schema([
                                TextEntry::make('price')
                                    ->label('Price')
                                    ->icon('heroicon-o-currency-dollar')
                                    ->formatStateUsing(fn ($state) => 'Rp ' . number_format($state, 0, ',', '.')),
                                TextEntry::make('stock')
                                    ->label('Stock')
                                    ->icon('heroicon-o-cube'),
                            ]),

                        Tabs\Tab::make('Media & Status')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                ImageEntry::make('image')
                                    ->label('Product Image')
                                    ->disk('public'),
                                IconEntry::make('is_active')
                                    ->label('Active')
                                    ->boolean(),
                                IconEntry::make('is_featured')
                                    ->label('Featured')
                                    ->boolean(),
                                TextEntry::make('created_at')
                                    ->label('Product Creation Date')
                                    ->date('d M Y')
                                    ->color('info'),
                            ]),
                    ])
                    ->columnSpanFull()
            ]);
    }
}
