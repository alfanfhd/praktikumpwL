<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Actions\Action;
class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Wizard::make([
                    Wizard\Step::make('Product Info')
                        ->icon('heroicon-o-information-circle')
                        ->description('Isi informasi dasar produk')
                        ->schema([
                            Group::make([
                                TextInput::make('name')
                                    ->required(),
                                TextInput::make('sku')
                                    ->required(),
                            ])->columns(2),
                            MarkdownEditor::make('description')
                                ->columnSpanFull(),
                        ]),
                    Wizard\Step::make('Pricing & Stock')
                        ->icon('heroicon-o-currency-dollar')
                        ->description('Isi harga dan jumlah stok')
                        ->schema([
                            TextInput::make('price')
                                ->numeric()
                                ->minValue(1)
                                ->required(),
                            TextInput::make('stock')
                                ->numeric()
                                ->required(),
                        ]),
                    Wizard\Step::make('Media & Status')
                        ->icon('heroicon-o-photo')
                        ->description('Upload gambar dan atur status')
                        ->schema([
                            FileUpload::make('image')
                                ->disk('public')
                                ->directory('products'),
                            Checkbox::make('is_active')
                                ->default(true),
                            Checkbox::make('is_featured')
                                ->default(false),
                        ]),
                ])
                ->submitAction(
                    Action::make('save')
                        ->label('Save Product')
                        ->color('primary')
                        ->submit('save')
                )->columnSpanFull()
            ]);
    }
}
