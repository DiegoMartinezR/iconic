# Regenera docs/COMPONENTS_CATALOG.md desde storage/app/components.json
# Uso (PowerShell, desde la raiz del proyecto):  ./tools/generate-components-catalog.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$json = Get-Content "$root\storage\app\components.json" -Raw | ConvertFrom-Json

$out = New-Object System.Collections.Generic.List[string]
$out.Add(@'
# CATALOGO DE COMPONENTES (generado desde storage/app/components.json)

> Generado automaticamente. Fuente de verdad = `storage/app/components.json`.
> Un **tipo** (`id` del grupo) = el `switch (component)` de `resources/js/System.jsx`.
> Una **opcion** (`options[].id`) = el `case (which)` del dispatcher de ese tipo.
> `model` = tabla que consulta `SystemController` para entregar `items` al componente.
> `data` = campos editables en el admin (se guardan en `systems.data`).
> `generals` = llaves de la tabla `generals` que el componente necesita.
'@)
$out.Add("")
$out.Add("Totales: " + $json.Count + " tipos, " + (($json | ForEach-Object { $_.options.Count } | Measure-Object -Sum).Sum) + " opciones.")
$out.Add("")

function Keys($arr, $max) {
  if (-not $arr -or $arr.Count -eq 0) { return "-" }
  $keys = $arr | ForEach-Object {
    $p = $_.Split(":")
    if ($p.Length -ge 3 -and ($p[0] -eq "select" -or $p[0] -eq "select-multiple" -or $p[0] -eq "bool" -or $p[0] -eq "code")) {
      if ($p.Length -eq 4) { $p[1] } else { $p[0] + ":" + $p[1] }
    } else { $_ }
  }
  if ($keys.Count -le $max) { return ($keys -join ", ") }
  return (($keys[0..($max-1)] -join ", ") + " ... (+" + ($keys.Count - $max) + ")")
}

foreach ($t in $json) {
  $out.Add("## " + $t.id + " — " + $t.name + " (" + $t.options.Count + " opciones)")
  $out.Add("")
  foreach ($o in $t.options) {
    $model = "-"
    $with = "-"
    $extra = @()
    if ($o.using) {
      if ($o.using.model) { $model = $o.using.model }
      $rel = @()
      if ($o.using.with) { $rel += ($o.using.with -join "+") }
      if ($o.using.relations) { $rel += ($o.using.relations -join "+") }
      if ($rel.Count -gt 0) { $with = ($rel -join ", ") }
      if ($o.using.filters) { $extra += "filters=[" + ($o.using.filters -join ",") + "]" }
      if ($o.using.limit) { $extra += "limit=" + $o.using.limit }
      if ($o.using.order) { $extra += "order=" + ($o.using.order -join " ") }
      if ($o.using.group_by_name) { $extra += "group_by_name" }
      if ($o.using.'filters:method') { $extra += "filterByRelation=" + $o.using.'filters:method' }
      if ($o.using.json) { $extra += "json" }
    }
    if ($o.options) { $extra += "subopciones=" + (($o.options | ForEach-Object { $_.id }) -join "|") }
    $line = "- **" + $o.id + "** — " + $o.name
    $line += " | model: " + $model
    $line += " | rel: " + $with
    $line += " | data(" + $(if ($o.data) { $o.data.Count } else { 0 }) + "): " + (Keys $o.data 10)
    $line += " | generals: " + (Keys $o.generals 12)
    if ($extra.Count -gt 0) { $line += " | " + ($extra -join " ") }
    $out.Add($line)
  }
  $out.Add("")
}

$path = "$root\docs\COMPONENTS_CATALOG.md"
[System.IO.File]::WriteAllText($path, ($out -join "`n"), (New-Object System.Text.UTF8Encoding($false)))
"OK -> $path (" + (Get-Item $path).Length + " bytes)"
