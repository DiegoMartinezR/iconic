<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SoDe\Extend\JSON;

class Setting extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'value',
        'type'
    ];

    static function get($name)
    {
        $jpa = Setting::select(['value'])
            ->where('name', $name)
            ->first();
        if (!$jpa) return null;
        return $jpa->value;
    }

    static function set($name, $value)
    {
        if (str_contains($name, '[')) {
            [$name, $key] = explode('[', $name);
            $key = str_replace(']', '', $key);
            $settingJpa = Setting::select()
                ->where('name', $name)
                ->first();
            if (!$settingJpa) $settingJpa = new Setting([
                'name' => $name
            ]);
            if (!$settingJpa->value) {
                $settingJpa->value = '{}';
            }

            $object = JSON::parse($settingJpa->value);
            $object[$key] = $value;
            $settingJpa->type = 'json';
            $settingJpa->value = JSON::stringify($object);
            $settingJpa->save();
        } else {
            $settingJpa = Setting::updateOrCreate([
                'name' => $name
            ], [
                'value' => $value
            ]);
        }
        return $settingJpa;
    }
}
