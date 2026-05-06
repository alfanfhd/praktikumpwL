<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Group;
use App\Models\Category;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Group::make([
                    Section::make('Fields')
                        ->schema([
                            TextInput::make('title')
                                ->required()
                                ->rules('min:5|max:100'),
                            TextInput::make('slug')
                                ->required()
                                ->unique(ignorable: fn ($record) => $record)
                                ->rules('min:3')
                                ->validationMessages([
                                    'unique' => 'Slug harus unik.',
                                ]),
                            Select::make('category_id')
                                ->label('Category')
                                ->relationship('category', 'name')
                                ->searchable()
                                ->preload()
                                ->required(),
                            ColorPicker::make('color'),
                        ])->columns(2),
                    MarkdownEditor::make('body')
                        ->columnSpanFull(),
                ])->columnSpan(2),

                Group::make([
                    Section::make('Image Upload')
                        ->schema([
                            FileUpload::make('image')
                                ->disk('public')
                                ->directory('post')
                                ->required(),
                        ]),
                    Section::make('Meta')
                        ->schema([
                            Select::make('tags')
                                ->relationship('tags', 'name')
                                ->multiple()
                                ->preload()
                                ->searchable(),
                            Checkbox::make('published'),
                            DatePicker::make('published_at'),
                        ]),
                ])->columnSpan(1),
            ])
            ->columns(3);
    }
}
