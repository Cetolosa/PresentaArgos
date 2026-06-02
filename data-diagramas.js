/* ================================================================
   data-diagramas.js
   HTML de los diagramas personalizados por capítulo.
   Para agregar un capítulo nuevo: añadir CHN: `<html...>` aquí
   y custom: "CHN" en data-capitulos.js
   ================================================================ */
const CUSTOM_DIAGRAMS = {
/* ── CH1: Zona 1 — Infraestructura On-Premise ──────────────────
   Replicación transaccional + CDC aislado de producción.
   Fuente: arquitectura de captura Argos v3.5
   ──────────────────────────────────────────────────────────────── */
CH1: `<span class="d1-ext-title">Zona 1 — Infraestructura On-Premise</span>
<span class="d1-ext-sub">Captura de cambios sin impacto en producción · Aislamiento Core · Argos v6</span>

<!-- ── GRÁFICO (65% del área, 50% del ancho) ─────── -->
<div class="argos-diagram1-container">
  <div class="d1-canvas-wrap">
    <div class="d1-canvas">

      <div class="d1-server server-red" data-nid="efoodmax" onclick="selNode('efoodmax')">
        <div class="server-face">
          <div class="server-header">
            <span class="led led-red animate-blink"></span>
            <span class="server-id">NODE :: 1.1</span>
          </div>
          <div class="server-body">
            <h4>ERP Primary</h4>
            <p class="server-tech">SQL Server 2019</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
      </div>

      <div class="d1-cable-connector continuous-flow"></div>

      <div class="d1-server server-amber" data-nid="distrib" onclick="selNode('distrib')" style="width:155px">
        <div class="server-face">
          <div class="server-header">
            <span class="server-id" style="letter-spacing:0">SQL CLUSTER (Contained AG)</span>
          </div>
          <div class="server-body">
            <h4 style="font-size:13px;margin-bottom:6px">Distribution DB</h4>
            <div class="d1-node-split">
              <div class="d1-inner-subnode" style="background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.2)">
                <span>NODE :: 1.2A (Prim)</span>
                <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
              </div>
              <div class="d1-inner-subnode">
                <span>NODE :: 1.2B (Sec)</span>
                <span class="led led-amber" style="width:6px;height:6px;box-shadow:0 0 4px #f59e0b"></span>
              </div>
            </div>
            <p class="server-tech" style="font-size:10px;margin:0">SQL Server 2022</p>
          </div>
        </div>
      </div>

      <div class="d1-cable-connector continuous-flow delay-flow"></div>

      <div class="d1-server server-green active-server" data-nid="staging" onclick="selNode('staging')">
        <div class="server-face">
          <div class="server-header">
            <div class="led-group">
              <span class="led led-green animate-fast-blink"></span>
              <span class="led led-blue animate-pulse"></span>
            </div>
            <span class="server-id">NODE :: 1.3 &amp; 1.4</span>
          </div>
          <div class="server-body">
            <h4>Staging DB + CDC</h4>
            <p class="server-tech">SQL Server 2022</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
        <div class="rack-badge">CDC LOG RECON</div>
      </div>

      <div class="d1-output-pipe">
        <div class="pipe-line"></div>
        <span class="pipe-text">Zona 2 → ADF</span>
      </div>

    </div>
  </div>
</div>

<p class="d1-hint">← selecciona un servidor para ver su descripción técnica</p>

<!-- ── TEXTO (editar formato según necesidad) ──────── -->
<div class="d1-log-wrap">
  <p class="d1-log-line">Cada INSERT, UPDATE o DELETE en NuestroERP confirma en producción. El agente lee el Transaction Log de forma asíncrona y sin competencia con la carga operacional — el ERP no percibe la extracción.</p>
  <p class="d1-log-line">Los bloques confirmados se replican a la Distribution DB por red local encriptada. Si el nodo primario falla, el Contained AG activa el secundario en &lt; 30 seg sin interrumpir la sincronización.</p>
  <p class="d1-log-line">El Staging mantiene copia exacta del ERP. CDC corre aquí — nunca en producción. Cada 3 segundos emite los deltas con metadatos de auditoría (__$operation · __$start_lsn) al filegroup NVMe de alta velocidad.</p>
  <p class="d1-log-line">Dato estructurado y listo. Los pipelines de Azure Data Factory (Zona 2) retiran los cambios sin tocar jamás el ERP productivo. Trazabilidad completa desde el primer evento.</p>
</div>`
/* ── Fin CH1 ──────────────────────────────────────────────────── */

/* ── CH2: Zona 2 — ADF + SHIR cluster + Bronze Layer ───────────
   Extracción distribuida Active-Active con gobernanza ADF
   ──────────────────────────────────────────────────────────────── */
,CH2: `<span class="d1-ext-title">Zona 2 — Extracción y Distribución de Carga</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · SHIR Cluster Active-Active · Bronze Layer · Argos v6</span>

<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">

    <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>

    <div class="d2-transv">

      <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
        <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
        <div class="d2-ic-name">Linaje & Gobernanza</div>
        <div class="d2-ic-sub" style="color:#a5b4fc">CDC → Snowflake/Power BI</div>
        <div class="d2-ic-leds"><span class="led animate-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
      </div>

      <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
        <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
        <div class="d2-ic-name">Observabilidad & Alertas</div>
        <div class="d2-ic-sub" style="color:#fbbf24">Teams · PagerDuty</div>
        <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
      </div>

      <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
        <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Orchestration</div>
        <div class="d2-ic-name">Azure Data Factory</div>
        <div class="d2-ic-sub" style="color:#38bdf8">Gobernanza · watermarks</div>
        <div class="d2-ic-leds">
          <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
          <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
        </div>
      </div>

    </div>

    <!-- Líneas de control al cluster SHIR (col 3, ~x:240px del layout) -->
    <div style="position:relative;height:14px;margin-bottom:8px">
      <div style="position:absolute;left:232px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.3)"></div>
      <div style="position:absolute;left:240px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.5)"></div>
      <div style="position:absolute;left:248px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.3)"></div>
    </div>

    <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">PLANO DE DATOS</div>

    <div class="d2-grid">

      <div class="d1-server server-gray" data-nid="sqlsrv" onclick="selNode('sqlsrv')" style="grid-column:1;grid-row:1/4;align-self:center">
        <div class="server-face">
          <div class="server-header">
            <span class="led led-red animate-blink"></span>
            <span class="server-id">NODE :: 1.X</span>
          </div>
          <div class="server-body">
            <h4>CDC Output</h4>
            <p class="server-tech" style="color:#94a3b8">Staging DB · Zona 1</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
      </div>

      <div class="cab blue-flow" style="grid-column:2;grid-row:1;width:60px"></div>
      <div class="cab blue-flow" style="grid-column:2;grid-row:2;width:60px;animation-delay:.6s"></div>
      <div class="cab blue-flow" style="grid-column:2;grid-row:3;width:60px;animation-delay:1.2s"></div>

      <div class="d1-server server-blue" data-nid="shir" onclick="selNode('shir')" style="grid-column:3;grid-row:1">
        <div class="server-face">
          <div class="server-header">
            <span class="led led-blue animate-fast-blink"></span>
            <span class="server-id">NODE :: 2.1</span>
          </div>
          <div class="server-body">
            <h4>SHIR-01</h4>
            <p class="server-tech" style="color:#38bdf8">Self-Hosted IR</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
      </div>

      <div class="d1-server server-blue active-server" data-nid="shir" onclick="selNode('shir')" style="grid-column:3;grid-row:2">
        <div class="server-face">
          <div class="server-header">
            <div class="led-group">
              <span class="led led-green animate-fast-blink"></span>
              <span class="led led-blue animate-pulse"></span>
            </div>
            <span class="server-id">NODE :: 2.2</span>
          </div>
          <div class="server-body">
            <h4>SHIR-02</h4>
            <p class="server-tech" style="color:#38bdf8">Self-Hosted IR</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
        <div class="rack-badge">ACTIVE-ACTIVE</div>
      </div>

      <div class="d1-server server-blue" data-nid="shir" onclick="selNode('shir')" style="grid-column:3;grid-row:3">
        <div class="server-face">
          <div class="server-header">
            <span class="led led-blue animate-fast-blink" style="animation-delay:.4s"></span>
            <span class="server-id">NODE :: 2.3</span>
          </div>
          <div class="server-body">
            <h4>SHIR-03</h4>
            <p class="server-tech" style="color:#38bdf8">Self-Hosted IR</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
      </div>

      <div class="cab teal-flow" style="grid-column:4;grid-row:1;width:60px;animation-delay:.3s"></div>
      <div class="cab teal-flow" style="grid-column:4;grid-row:2;width:60px;animation-delay:.9s"></div>
      <div class="cab teal-flow" style="grid-column:4;grid-row:3;width:60px;animation-delay:1.5s"></div>

      <div class="d1-server server-teal" data-nid="bronze" onclick="selNode('bronze')" style="grid-column:5;grid-row:1/4;align-self:center">
        <div class="server-face">
          <div class="server-header">
            <span class="led led-green animate-blink"></span>
            <span class="server-id">BRONZE LAYER</span>
          </div>
          <div class="server-body">
            <h4>Bronze Layer</h4>
            <p class="server-tech" style="color:#0d9488">ADLS Gen2</p>
            <p class="server-sub">Parquet · Snappy</p>
          </div>
          <div class="server-vents"><span></span><span></span></div>
        </div>
      </div>

      <div class="out-pipe">
        <div class="pipe-line" style="width:100%"></div>
        <span class="pipe-text">Data Quality<br>Gate</span>
      </div>

      <!-- Azure Key Vault: centro de la comunicación CDC↔Bronze -->
      <div style="grid-column:2/5;grid-row:4;margin-top:12px">
        <div class="d1-server server-vault" data-nid="keyvault" onclick="selNode('keyvault')" style="width:100%;box-sizing:border-box">
          <div class="server-face">
            <div class="server-header">
              <span class="server-id">AZURE KEY VAULT</span>
              <span class="led animate-blink" style="width:6px;height:6px;background:#a855f7;box-shadow:0 0 8px #a855f7,0 0 16px #a855f7"></span>
            </div>
            <div class="server-body">
              <h4 style="font-size:12px">Key Vault</h4>
              <p class="server-tech" style="color:#a855f7;font-size:9px">secretos · conexiones · llaves criptográficas</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<div class="d1-log-wrap">
  <p class="d1-log-line">Los deltas transaccionales consolidados por el CDC nacen del Staging DB y se distribuyen individualmente sobre los tres agentes SHIR en clúster Active-Active. Azure Data Factory orquesta las ventanas de extracción y valida los watermarks de forma idempotente sobre cada nodo. Los tres flujos convergen en Bronze Layer (ADLS Gen2), donde los deltas se consolidan como archivos Parquet inmutables comprimidos con Snappy. Azure Key Vault centraliza los secretos y cadenas de conexión de toda la plataforma.</p>
</div>`
/* ── Fin CH2 ──────────────────────────────────────────────────── */

/* ── CH25: Data Quality Gate ─────────────────────────────────────
   Bronze → DQ Gate (12 reglas) → Silver | Cuarentena
   ──────────────────────────────────────────────────────────────── */
,CH25: `<span class="d1-ext-title">Zona 3 — Data Quality Gate</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · DQ Gate · Silver Layer · Argos v6</span>

<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>

      <div class="d2-transv">

        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Linaje & Gobernanza</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">CDC → Snowflake/Power BI</div>
          <div class="d2-ic-leds"><span class="led animate-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
        </div>

        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">Observabilidad & Alertas</div>
          <div class="d2-ic-sub" style="color:#fbbf24">Teams · PagerDuty</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
        </div>

        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Orchestration</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">Gobernanza · watermarks</div>
          <div class="d2-ic-leds">
            <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
            <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
          </div>
        </div>

      </div>

      <!-- Líneas de control al DQ Gate (col 3, ~x:265px) -->
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:257px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.3)"></div>
        <div style="position:absolute;left:265px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.5)"></div>
        <div style="position:absolute;left:273px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.3)"></div>
      </div>

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">VALIDACIÓN Y TRANSFORMACIÓN CANÓNICA</div>

      <div class="dq-grid">

        <div class="d1-server server-teal" data-nid="bronze" onclick="selNode('bronze')" style="grid-column:1;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-green animate-blink"></span>
              <span class="server-id">BRONZE LAYER</span>
            </div>
            <div class="server-body">
              <h4>Bronze Layer</h4>
              <p class="server-tech" style="color:#0d9488">ADLS Gen2</p>
              <p class="server-sub">Parquet · Snappy</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
        </div>

        <div class="cab teal-flow" style="grid-column:2;grid-row:1;width:60px"></div>

        <div class="d1-server server-amber-node" data-nid="dqgate" onclick="selNode('dqgate')" style="grid-column:3;grid-row:1;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-amber animate-blink" style="animation-duration:.9s"></span>
              <span class="server-id">DATA QUALITY GATE</span>
            </div>
            <div class="server-body">
              <h4>DQ Gate</h4>
              <p class="server-tech" style="color:#f59e0b">12 reglas automatizadas</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-amb">12 REGLAS</div>
        </div>

        <div style="grid-column:4;grid-row:1;display:flex;flex-direction:column;align-items:center;gap:6px;align-self:center">
          <div class="cab green-flow" style="width:60px"></div>
          <span style="font-size:8px;color:#10b981;font-weight:700;letter-spacing:.3px">✓ válido</span>
        </div>

        <div class="d1-server server-green active-server" data-nid="silver" onclick="selNode('silver')" style="grid-column:5;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-fast-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">SILVER LAYER</span>
            </div>
            <div class="server-body">
              <h4>Silver Layer</h4>
              <p class="server-tech" style="color:#10b981">Delta Lake · SCD-2</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">CANONICAL</div>
        </div>

        <div style="grid-column:3;grid-row:2;display:flex;align-items:center;justify-content:center;gap:7px;width:130px;padding-top:8px">
          <div class="cab-v red-flow-v" style="height:34px;width:5px"></div>
          <span style="font-size:8px;color:#f87171;font-weight:700;letter-spacing:.3px">✗ rechazado</span>
        </div>

        <div class="d1-server server-red-node" data-nid="quarantine" onclick="selNode('quarantine')" style="grid-column:3;grid-row:3;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-red animate-fast-blink"></span>
              <span class="server-id">CUARENTENA</span>
            </div>
            <div class="server-body">
              <h4>Cuarentena</h4>
              <p class="server-tech" style="color:#ef4444">Subdirectorio isolado</p>
              <p class="server-sub">Registros rechazados</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-red-node">REJECT</div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="d1-log-wrap">
  <p class="d1-log-line">Cada registro que llega desde Bronze enfrenta 12 validaciones automatizadas en el DQ Gate: integridad referencial, valores dentro de rango, claves foráneas válidas, timestamps coherentes y detección de duplicados. Los que aprueban avanzan hacia Silver Layer. Los que fallan se desvían al subdirectorio de cuarentena — aislados, auditables, disponibles para corrección y reingreso sin contaminar el modelo canónico.</p>
</div>`
/* ── Fin CH25 ─────────────────────────────────────────────────── */

/* ── CH3: Zona 3 completa — DQ Gate + dbt + MDM + Silver ────────
   Bronze → DQ Gate → dbt (lookup MDM) → Silver · Delta Lake SCD-2
   ──────────────────────────────────────────────────────────────── */
,CH3: `<span class="d1-ext-title">Zona 3 — Transformación al Modelo Canónico</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · DQ Gate · dbt · MDM · Silver · Argos v6</span>

<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>

      <div class="d2-transv">

        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Linaje & Gobernanza</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">Bronze → dbt → Silver</div>
          <div class="d2-ic-leds"><span class="led animate-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
        </div>

        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">Observabilidad & Alertas</div>
          <div class="d2-ic-sub" style="color:#fbbf24">Tests dbt · cuarentena</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
        </div>

        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Orchestration</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">DQ Gate → dbt → Silver</div>
          <div class="d2-ic-leds">
            <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
            <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
          </div>
        </div>

      </div>

      <!-- Control lines: DQ Gate (x≈240) · centro (x≈330) · dbt (x≈420) -->
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:232px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
        <div style="position:absolute;left:327px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.25)"></div>
        <div style="position:absolute;left:412px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
      </div>

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">TRANSFORMACIÓN CANÓNICA</div>

      <div class="ch3-grid">

        <!-- Bronze -->
        <div class="d1-server server-teal" data-nid="bronze" onclick="selNode('bronze')" style="grid-column:1;grid-row:1">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-green animate-blink"></span>
              <span class="server-id">BRONZE LAYER</span>
            </div>
            <div class="server-body">
              <h4>Bronze Layer</h4>
              <p class="server-tech" style="color:#0d9488">ADLS Gen2</p>
              <p class="server-sub">Parquet · Snappy</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
        </div>

        <!-- Cable Bronze → DQ Gate -->
        <div class="cab teal-flow" style="grid-column:2;grid-row:1;width:55px"></div>

        <!-- DQ Gate -->
        <div class="d1-server server-amber-node" data-nid="dqgate" onclick="selNode('dqgate')" style="grid-column:3;grid-row:1;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-amber animate-blink" style="animation-duration:.9s"></span>
              <span class="server-id">DATA QUALITY GATE</span>
            </div>
            <div class="server-body">
              <h4>DQ Gate</h4>
              <p class="server-tech" style="color:#f59e0b">12 reglas automatizadas</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-amb">12 REGLAS</div>
        </div>

        <!-- Cable DQ Gate → dbt + ✓ válido -->
        <div style="grid-column:4;grid-row:1;display:flex;flex-direction:column;align-items:center;gap:6px;align-self:center">
          <div class="cab green-flow" style="width:55px"></div>
          <span style="font-size:8px;color:#10b981;font-weight:700;letter-spacing:.3px">✓ válido</span>
        </div>

        <!-- dbt -->
        <div class="d1-server server-indigo" data-nid="dbt" onclick="selNode('dbt')" style="grid-column:5;grid-row:1">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-fast-blink" style="width:7px;height:7px;background:#6366f1;box-shadow:0 0 10px #6366f1,0 0 20px #6366f1"></span>
              <span class="server-id">DBT TRANSFORMATIONS</span>
            </div>
            <div class="server-body">
              <h4>dbt Core</h4>
              <p class="server-tech" style="color:#818cf8">SQL incremental · SCD-2</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(49,46,129,.8);color:#a5b4fc;border:1px solid rgba(99,102,241,.3)">SCD-2</div>
        </div>

        <!-- Cable dbt → Silver -->
        <div class="cab indigo-flow" style="grid-column:6;grid-row:1;width:55px;align-self:center"></div>

        <!-- Silver Layer -->
        <div class="d1-server server-green active-server" data-nid="silver" onclick="selNode('silver')" style="grid-column:7;grid-row:1">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-fast-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">SILVER LAYER</span>
            </div>
            <div class="server-body">
              <h4>Silver Layer</h4>
              <p class="server-tech" style="color:#10b981">Delta Lake · SCD-2</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">CANONICAL</div>
        </div>

        <!-- Vertical cable DQ Gate → Cuarentena -->
        <div style="grid-column:3;grid-row:2;display:flex;align-items:center;justify-content:center;gap:7px;width:130px;padding-top:8px">
          <div class="cab-v red-flow-v" style="height:34px;width:5px"></div>
          <span style="font-size:8px;color:#f87171;font-weight:700;letter-spacing:.3px">✗ rechazado</span>
        </div>

        <!-- Vertical cable dbt → MDM -->
        <div style="grid-column:5;grid-row:2;display:flex;align-items:center;justify-content:center;gap:7px;width:120px;padding-top:8px">
          <div class="cab-v indigo-flow-v" style="height:34px;width:5px"></div>
          <span style="font-size:8px;color:#818cf8;font-weight:700;letter-spacing:.3px">lookup</span>
        </div>

        <!-- Cuarentena -->
        <div class="d1-server server-red-node" data-nid="quarantine" onclick="selNode('quarantine')" style="grid-column:3;grid-row:3;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-red animate-fast-blink"></span>
              <span class="server-id">CUARENTENA</span>
            </div>
            <div class="server-body">
              <h4>Cuarentena</h4>
              <p class="server-tech" style="color:#ef4444">Subdirectorio isolado</p>
              <p class="server-sub">Registros rechazados</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-red-node">REJECT</div>
        </div>

        <!-- MDM Repository -->
        <div class="d1-server server-emerald" data-nid="mdm" onclick="selNode('mdm')" style="grid-column:5;grid-row:3;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-green animate-blink" style="animation-delay:.3s"></span>
              <span class="server-id">MDM · IDENTIDADES</span>
            </div>
            <div class="server-body">
              <h4>Mapa Canónico</h4>
              <p class="server-tech" style="color:#059669;font-size:9px">mdm_mapa_identidades</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="d1-log-wrap">
  <p class="d1-log-line">Los datos aprobados por el DQ Gate son consumidos por dbt, que aplica transformaciones SQL incrementales sobre Bronze. Primero consulta el MDM (silver.mdm_mapa_identidades) para resolver identidades fragmentadas del ERP a claves canónicas únicas. Luego aplica SCD Type 2: versiona cada cambio con _valid_from, _valid_to e _is_current. El resultado se escribe en Silver Layer como Delta Lake, con capacidad ACID y time travel. ADF orquesta todo el flujo; Purview registra el linaje de cada transformación dbt automáticamente.</p>
</div>`
/* ── Fin CH3 ──────────────────────────────────────────────────── */

/* ── CH4: Gold Layer + Snowflake ────────────────────────────────
   Silver → dbt Gold → Gold Layer (4 DM) → Snowpipe → Snowflake
   Gobernanza: Purview · Azure Monitor · ADF
   ──────────────────────────────────────────────────────────────── */
,CH4: `<span class="d1-ext-title">Zona 4 — Capa Gold y Analítica Avanzada</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · dbt Gold · Gold Layer · Snowpipe · Snowflake · Argos v6</span>

<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>

      <div class="d2-transv">

        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Linaje E2E hasta Gold</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">dbt-purview-lineage API</div>
          <div class="d2-ic-leds"><span class="led animate-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
        </div>

        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">Gold Freshness · Snowflake</div>
          <div class="d2-ic-sub" style="color:#fbbf24">P2 freshness · P3 credits</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
        </div>

        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Orchestration</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">Orquesta dbt Gold</div>
          <div class="d2-ic-leds">
            <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
            <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
          </div>
        </div>

      </div>

      <!-- Control lines: dbt Gold (x≈220) · centro (x≈307) · Gold Layer (x≈395) -->
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:212px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
        <div style="position:absolute;left:307px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.25)"></div>
        <div style="position:absolute;left:387px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
      </div>

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">TRANSFORMACIÓN Y CARGA ANALÍTICA</div>

      <div class="ch4-grid">

        <!-- Silver Layer (input) -->
        <div class="d1-server server-green active-server" data-nid="silver2" onclick="selNode('silver2')" style="grid-column:1;grid-row:1;width:110px">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-fast-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">SILVER LAYER</span>
            </div>
            <div class="server-body">
              <h4>Silver Layer</h4>
              <p class="server-tech" style="color:#10b981;font-size:10px">Delta Lake · SCD-2</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">CANONICAL</div>
        </div>

        <!-- Cable Silver → dbt -->
        <div class="cab green-flow" style="grid-column:2;grid-row:1;width:50px"></div>

        <!-- dbt Gold -->
        <div class="d1-server server-indigo" data-nid="dbt2" onclick="selNode('dbt2')" style="grid-column:3;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-fast-blink" style="width:7px;height:7px;background:#6366f1;box-shadow:0 0 10px #6366f1,0 0 20px #6366f1"></span>
              <span class="server-id">DBT GOLD MODELS</span>
            </div>
            <div class="server-body">
              <h4>dbt Gold</h4>
              <p class="server-tech" style="color:#818cf8;font-size:10px">SQL incremental · 4 DM</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(49,46,129,.8);color:#a5b4fc;border:1px solid rgba(99,102,241,.3)">GOLD</div>
        </div>

        <!-- Cable dbt → Gold Layer -->
        <div class="cab gold-flow" style="grid-column:4;grid-row:1;width:50px"></div>

        <!-- Gold Layer (4 Data Marts) -->
        <div class="d1-server server-gold" data-nid="gold" onclick="selNode('gold')" style="grid-column:5;grid-row:1;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-blink" style="width:7px;height:7px;background:#f59e0b;box-shadow:0 0 10px #f59e0b,0 0 20px #f59e0b"></span>
              <span class="server-id">GOLD LAYER</span>
            </div>
            <div class="server-body">
              <h4>Gold Layer</h4>
              <p class="server-tech" style="color:#f59e0b;font-size:10px">ADLS Gen2 · Delta Lake</p>
              <p class="server-sub" style="font-size:8px;line-height:1.6">Presupuesto · Consumo<br>Inventario · Comercial</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(120,53,15,.8);color:#fbbf24;border:1px solid rgba(245,158,11,.3)">4 DATA MARTS</div>
        </div>

        <!-- Cable Snowpipe Gold → Snowflake -->
        <div style="grid-column:6;grid-row:1;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab snow-flow" style="width:50px"></div>
          <span style="font-size:7px;color:#29b5e8;font-weight:700;letter-spacing:.2px">Snowpipe</span>
          <span style="font-size:7px;color:#29b5e8;opacity:.75;letter-spacing:.1px">&lt; 5 min</span>
        </div>

        <!-- Snowflake -->
        <div class="d1-server server-snow" data-nid="snowflake" onclick="selNode('snowflake')" style="grid-column:7;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-pulse" style="width:7px;height:7px;background:#29b5e8;box-shadow:0 0 10px #29b5e8,0 0 20px #29b5e8"></span>
              <span class="server-id">SNOWFLAKE</span>
            </div>
            <div class="server-body">
              <h4>Snowflake</h4>
              <p class="server-tech" style="color:#29b5e8;font-size:10px">Multi-warehouse · SaaS</p>
              <p class="server-sub">Time Travel · RLS</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(2,40,70,.8);color:#7dd3fc;border:1px solid rgba(41,181,232,.3)">ANALYTICS</div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="d1-log-wrap">
  <p class="d1-log-line">dbt lee desde Silver y construye los 4 Data Marts Gold mediante transformaciones SQL incrementales versionadas en Git: Presupuesto, Consumo, Inventario y Comercial. Cada Data Mart pre-agrega KPIs por dominio — ningún consumidor necesita escribir lógica de negocio propia. Cuando ADF escribe los Parquet resultantes en Gold Layer, Snowpipe los detecta automáticamente y los carga en Snowflake en menos de 5 minutos. Microsoft Purview registra el linaje completo de cada modelo dbt Gold. Azure Monitor alerta si la frescura de Gold supera 2× el SLA o si los créditos Snowflake superan el 75% mensual.</p>
</div>`
/* ── Fin CH4 ──────────────────────────────────────────────────── */

/* ── CH5: Alerta · fn_presupuesto · R5 ──────────────────────────
   Gold → Azure SQL → Azure Functions → Logic Apps → Teams
                ↓ R5 → NuestroERP
   Gobernanza: Azure Monitor (PRINCIPAL) · ADF · Purview (upstream)
   ──────────────────────────────────────────────────────────────── */
,CH5: `<span class="d1-ext-title">Zona 4 — Control Presupuestario y Alertas</span>
<span class="d1-ext-sub">Azure Monitor · ADF · fn_presupuesto · Azure Functions · Logic Apps · R5 · Argos v6</span>

<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>

      <div class="d2-transv">

        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')" style="flex:1.4">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor · PRINCIPAL</div>
          <div class="d2-ic-name">Observabilidad & Alertas</div>
          <div class="d2-ic-sub" style="color:#fbbf24">Logic Apps → Teams · PagerDuty</div>
          <div class="d2-ic-leds">
            <span class="led led-amber animate-blink" style="width:6px;height:6px"></span>
            <span class="led led-red animate-fast-blink" style="width:6px;height:6px;animation-delay:.3s"></span>
          </div>
        </div>

        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Batch</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">Gold → Azure SQL · c/hora</div>
          <div class="d2-ic-leds">
            <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
          </div>
        </div>

        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')" style="opacity:.5">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Alcance previo · Gold</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">No cubre Azure SQL</div>
          <div class="d2-ic-leds"><span class="led" style="width:6px;height:6px;background:#818cf8;opacity:.4"></span></div>
        </div>

      </div>

      <!-- Control lines: Azure SQL (x≈225) · centro (x≈315) · Azure Functions (x≈405) -->
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:217px;top:0;height:14px;border-left:1px dashed rgba(249,115,22,.45)"></div>
        <div style="position:absolute;left:307px;top:0;height:14px;border-left:1px dashed rgba(249,115,22,.25)"></div>
        <div style="position:absolute;left:397px;top:0;height:14px;border-left:1px dashed rgba(249,115,22,.45)"></div>
      </div>

      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">DETECCIÓN · ALERTA · RETORNO</div>

      <div class="ch5-grid">

        <!-- Gold Layer (input) -->
        <div class="d1-server server-gold" data-nid="gold2" onclick="selNode('gold2')" style="grid-column:1;grid-row:1;width:110px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-blink" style="width:7px;height:7px;background:#f59e0b;box-shadow:0 0 10px #f59e0b,0 0 20px #f59e0b"></span>
              <span class="server-id">GOLD LAYER</span>
            </div>
            <div class="server-body">
              <h4>Gold Layer</h4>
              <p class="server-tech" style="color:#f59e0b;font-size:10px">dm_presupuesto</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(120,53,15,.8);color:#fbbf24;border:1px solid rgba(245,158,11,.3)">INPUT</div>
        </div>

        <!-- Cable Gold → Azure SQL -->
        <div class="cab gold-flow" style="grid-column:2;grid-row:1;width:50px"></div>

        <!-- Azure SQL fn_presupuesto -->
        <div class="d1-server server-blue" data-nid="azuresql" onclick="selNode('azuresql')" style="grid-column:3;grid-row:1;width:130px">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-blue animate-blink"></span>
                <span class="led led-green animate-pulse"></span>
              </div>
              <span class="server-id">AZURE SQL</span>
            </div>
            <div class="server-body">
              <h4>fn_presupuesto</h4>
              <p class="server-tech" style="color:#38bdf8;font-size:10px">Business Critical</p>
              <p class="server-sub">1.200 contratos</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(7,25,50,.8);color:#7dd3fc;border:1px solid rgba(56,189,248,.3)">PRESUPUESTO</div>
        </div>

        <!-- Cable Azure SQL → Azure Functions con umbral -->
        <div style="grid-column:4;grid-row:1;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab alert-flow" style="width:55px"></div>
          <span style="font-size:7px;color:#f97316;font-weight:700;letter-spacing:.2px">≥ 80%</span>
          <span style="font-size:7px;color:#f97316;opacity:.75">alerta</span>
        </div>

        <!-- Azure Functions -->
        <div class="d1-server server-amber-node" data-nid="functions" onclick="selNode('functions')" style="grid-column:5;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-amber animate-fast-blink"></span>
              <span class="server-id">AZURE FUNCTIONS</span>
            </div>
            <div class="server-body">
              <h4>Azure Functions</h4>
              <p class="server-tech" style="color:#f59e0b;font-size:10px">Detección · serverless</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-amb">TRIGGER</div>
        </div>

        <!-- Cable Azure Functions → Logic Apps -->
        <div class="cab alert-flow" style="grid-column:6;grid-row:1;width:55px;animation-delay:.4s"></div>

        <!-- Logic Apps → Teams · PagerDuty -->
        <div class="d1-server server-alert" data-nid="logicapps" onclick="selNode('logicapps')" style="grid-column:7;grid-row:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-red animate-fast-blink" style="animation-duration:.5s"></span>
              <span class="server-id">LOGIC APPS</span>
            </div>
            <div class="server-body">
              <h4>Alertas</h4>
              <p class="server-tech" style="color:#fb923c;font-size:10px">Teams · PagerDuty</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(124,45,18,.8);color:#fdba74;border:1px solid rgba(249,115,22,.3)">NOTIFY</div>
        </div>

        <!-- Vertical cable Azure SQL → R5 -->
        <div style="grid-column:3;grid-row:2;display:flex;align-items:center;justify-content:center;gap:7px;width:130px;padding-top:8px">
          <div class="cab-v indigo-flow-v" style="height:34px;width:5px"></div>
          <span style="font-size:8px;color:#818cf8;font-weight:700;letter-spacing:.3px">retorno R5</span>
        </div>

        <!-- R5 Power Automate Desktop -->
        <div class="d1-server server-red-node" data-nid="r5" onclick="selNode('r5')" style="grid-column:3;grid-row:3;width:130px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-red animate-blink" style="animation-duration:1.2s"></span>
              <span class="server-id">POWER AUTOMATE R5</span>
            </div>
            <div class="server-body">
              <h4>Desktop RPA</h4>
              <p class="server-tech" style="color:#ef4444;font-size:10px">NuestroERP UI · RPA</p>
              <p class="server-sub">2-5 min · log completo</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-red-node">RETORNO</div>
        </div>

      </div>
    </div>
  </div>
</div>

<div class="d1-log-wrap">
  <p class="d1-log-line">ADF actualiza fn_presupuesto en Azure SQL cada hora con el gasto real desde Gold. Azure Functions detecta contratos que superan el 80% del presupuesto mensual y publica eventos en Event Hub. Azure Monitor convierte esas condiciones en alertas via Logic Apps, que envía notificaciones a Teams y PagerDuty con el contexto completo: contrato, CECO, porcentaje ejecutado y saldo disponible. En paralelo, las aprobaciones registradas en Azure SQL activan el canal de retorno R5: Power Automate Desktop opera la UI de NuestroERP como usuario y escribe los cambios aprobados, capturando el número de confirmación del ERP.</p>
</div>`
/* ── Fin CH5 ──────────────────────────────────────────────────── */

/* ── CH6: Decisión · Snowflake → Power BI ← Azure SQL ──────────
   Gobernanza: Purview ✓ · Monitor ✓ · ADF ✓ parcial
   ──────────────────────────────────────────────────────────────── */
,CH6: `<span class="d1-ext-title">Zona 4 — Consumo y Decisión</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · Snowflake · Power BI · Azure SQL · Argos v6</span>
<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>
      <div class="d2-transv">
        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Linaje E2E Completo</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">CDC → Power BI · completo</div>
          <div class="d2-ic-leds"><span class="led animate-fast-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
        </div>
        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">Anomalías · Dashboards</div>
          <div class="d2-ic-sub" style="color:#fbbf24">Frescura · KPI &gt; 2σ</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
        </div>
        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')" style="opacity:.6">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Batch</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">Batch Gold → SQL · parcial</div>
          <div class="d2-ic-leds"><span class="led led-blue animate-pulse" style="width:6px;height:6px"></span></div>
        </div>
      </div>
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:52px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
        <div style="position:absolute;left:228px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.25)"></div>
        <div style="position:absolute;left:400px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
      </div>
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">CONSUMO Y VISUALIZACIÓN</div>
      <div class="ch6-grid">
        <div class="d1-server server-snow" data-nid="snowflake2" onclick="selNode('snowflake2')" style="grid-column:1;width:110px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-pulse" style="width:7px;height:7px;background:#29b5e8;box-shadow:0 0 10px #29b5e8,0 0 20px #29b5e8"></span>
              <span class="server-id">SNOWFLAKE</span>
            </div>
            <div class="server-body">
              <h4>Snowflake</h4>
              <p class="server-tech" style="color:#29b5e8;font-size:10px">Multi-warehouse · RLS</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(2,40,70,.8);color:#7dd3fc;border:1px solid rgba(41,181,232,.3)">ANALYTICS</div>
        </div>
        <div style="grid-column:2;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab snow-flow" style="width:50px"></div>
          <span style="font-size:7px;color:#29b5e8;font-weight:700;letter-spacing:.2px">Snowpipe</span>
        </div>
        <div class="d1-server server-powerbi" data-nid="bi" onclick="selNode('bi')" style="grid-column:3;width:140px">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led animate-blink" style="width:7px;height:7px;background:#f2c811;box-shadow:0 0 10px #f2c811,0 0 20px #f2c811"></span>
                <span class="led led-green animate-fast-blink"></span>
              </div>
              <span class="server-id">POWER BI</span>
            </div>
            <div class="server-body">
              <h4>Power BI</h4>
              <p class="server-tech" style="color:#f2c811;font-size:10px">3 dashboards · RLS</p>
              <p class="server-sub">Presupuesto · Pedidos · Proveedores</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(100,80,0,.8);color:#fde047;border:1px solid rgba(242,200,17,.3)">CERTIFIED</div>
        </div>
        <div style="grid-column:4;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab powerbi-flow" style="width:50px"></div>
          <span style="font-size:7px;color:#f2c811;font-weight:700;letter-spacing:.2px">DirectQuery</span>
        </div>
        <div class="d1-server server-blue" data-nid="azuresql4" onclick="selNode('azuresql4')" style="grid-column:5;width:110px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-blue animate-blink"></span>
              <span class="server-id">AZURE SQL</span>
            </div>
            <div class="server-body">
              <h4>Azure SQL</h4>
              <p class="server-tech" style="color:#38bdf8;font-size:10px">Real-time · RLS</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(7,25,50,.8);color:#7dd3fc;border:1px solid rgba(56,189,248,.3)">LIVE</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="d1-log-wrap">
  <p class="d1-log-line">Power BI consume desde dos fuentes simultáneas: Snowflake para analítica avanzada (datos importados via Snowpipe, warehouses independientes por rol) y Azure SQL via DirectQuery para datos operacionales en tiempo real. Los 3 dashboards certificados (Presupuesto, Pedidos, Proveedores) aplican Row Level Security: cada perfil ve únicamente sus contratos y CECOs. Microsoft Purview completa aquí el linaje E2E documentado — desde el CDC del ERP hasta la columna del dashboard.</p>
</div>`
/* ── Fin CH6 ──────────────────────────────────────────────────── */

/* ── CH7: Memoria · Bronze/Silver/Gold con retenciones ──────────
   Gobernanza: Purview PRINCIPAL · Azure Monitor ✓ · ADF ✓
   ──────────────────────────────────────────────────────────────── */
,CH7: `<span class="d1-ext-title">Zona ⊥ — Memoria Institucional</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · Delta Lake · SCD-2 · OPTIMIZE · VACUUM · Argos v6</span>
<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>
      <div class="d2-transv">
        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')" style="flex:1.4">
          <div class="d2-ic-lbl" style="color:#818cf8">Purview · PRINCIPAL</div>
          <div class="d2-ic-name">Linaje & Auditoría Histórica</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">_pipeline_run_id · Time Travel</div>
          <div class="d2-ic-leds">
            <span class="led animate-fast-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span>
            <span class="led animate-blink" style="width:6px;height:6px;background:#a5b4fc;box-shadow:0 0 6px #a5b4fc;animation-delay:.4s"></span>
          </div>
        </div>
        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">Jobs · Costos · Storage</div>
          <div class="d2-ic-sub" style="color:#fbbf24">OPTIMIZE · VACUUM</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px"></span></div>
        </div>
        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Mantenimiento</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">OPTIMIZE · VACUUM batch</div>
          <div class="d2-ic-leds"><span class="led led-blue animate-pulse" style="width:6px;height:6px"></span></div>
        </div>
      </div>
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:60px;top:0;height:14px;border-left:1px dashed rgba(129,140,248,.5)"></div>
        <div style="position:absolute;left:240px;top:0;height:14px;border-left:1px dashed rgba(129,140,248,.3)"></div>
        <div style="position:absolute;left:420px;top:0;height:14px;border-left:1px dashed rgba(129,140,248,.5)"></div>
      </div>
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">RETENCIÓN Y MEMORIA POR CAPA</div>
      <div class="ch7-grid">
        <div class="d1-server server-teal" data-nid="bronze7" onclick="selNode('bronze7')" style="grid-column:1;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-green animate-blink"></span>
              <span class="server-id">BRONZE · 7 AÑOS</span>
            </div>
            <div class="server-body">
              <h4>Bronze Layer</h4>
              <p class="server-tech" style="color:#0d9488;font-size:10px">Append-only · inmutable</p>
              <p class="server-sub">OPTIMIZE · diario</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(6,40,35,.8);color:#5eead4;border:1px solid rgba(13,148,136,.3)">7 AÑOS</div>
        </div>
        <div style="grid-column:2;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab teal-flow" style="width:55px"></div>
          <span style="font-size:7px;color:#0d9488;font-weight:700">Δ Delta</span>
        </div>
        <div class="d1-server server-green active-server" data-nid="silver7" onclick="selNode('silver7')" style="grid-column:3;width:130px">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-fast-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">SILVER · 4 AÑOS</span>
            </div>
            <div class="server-body">
              <h4>Silver Layer</h4>
              <p class="server-tech" style="color:#10b981;font-size:10px">SCD-2 · _is_current</p>
              <p class="server-sub">_pipeline_run_id · audit</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">4 AÑOS</div>
        </div>
        <div style="grid-column:4;display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center">
          <div class="cab gold-flow" style="width:55px"></div>
          <span style="font-size:7px;color:#f59e0b;font-weight:700">Δ Delta</span>
        </div>
        <div class="d1-server server-gold" data-nid="gold7" onclick="selNode('gold7')" style="grid-column:5;width:120px">
          <div class="server-face">
            <div class="server-header">
              <span class="led animate-blink" style="width:7px;height:7px;background:#f59e0b;box-shadow:0 0 10px #f59e0b,0 0 20px #f59e0b"></span>
              <span class="server-id">GOLD · 2 AÑOS</span>
            </div>
            <div class="server-body">
              <h4>Gold Layer</h4>
              <p class="server-tech" style="color:#f59e0b;font-size:10px">Time Travel 2yr</p>
              <p class="server-sub">VACUUM · semanal</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge" style="background:rgba(120,53,15,.8);color:#fbbf24;border:1px solid rgba(245,158,11,.3)">2 AÑOS</div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="d1-log-wrap">
  <p class="d1-log-line">Cada capa preserva su historia por períodos distintos: Bronze 7 años (inmutable, fuente de re-procesamiento), Silver 4 años (SCD-2 con _valid_from/_valid_to/_is_current, columna _pipeline_run_id por fila para Purview), Gold 2 años (VACUUM semanal elimina versiones anteriores al período de retención). ADF ejecuta OPTIMIZE diario y VACUUM semanal como pipelines de mantenimiento. Purview es el protagonista de este capítulo: combina el linaje técnico con el Time Travel de Delta Lake para responder a cualquier auditoría con evidencia histórica completa.</p>
</div>`
/* ── Fin CH7 ──────────────────────────────────────────────────── */

/* ── CH8: Convivencia · dos fuentes → Bronze → Silver ───────────
   Gobernanza: Purview ✓ · Monitor ✓ · ADF ✓ · full E2E
   ──────────────────────────────────────────────────────────────── */
,CH8: `<span class="d1-ext-title">Transversal — Convivencia de Sistemas</span>
<span class="d1-ext-sub">Purview · Azure Monitor · ADF · NuestroERP · Azure SQL · Bronze · Silver · R5 · Argos v6</span>
<div class="argos-diagram1-container" style="flex:0 0 auto;padding:18px 22px">
  <div style="display:flex;justify-content:center">
    <div class="d2-layout">
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:8px">INFRAESTRUCTURA TRANSVERSAL AZURE</div>
      <div class="d2-transv">
        <div class="d2-infra-card d2-purview" data-nid="purview" onclick="selNode('purview')">
          <div class="d2-ic-lbl" style="color:#818cf8">Microsoft Purview</div>
          <div class="d2-ic-name">Linaje E2E · Ambas Fuentes</div>
          <div class="d2-ic-sub" style="color:#a5b4fc">EFM + Azure SQL → Power BI</div>
          <div class="d2-ic-leds"><span class="led animate-fast-blink" style="width:6px;height:6px;background:#818cf8;box-shadow:0 0 8px #818cf8,0 0 16px #818cf8"></span></div>
        </div>
        <div class="d2-infra-card d2-monitor" data-nid="monitor" onclick="selNode('monitor')">
          <div class="d2-ic-lbl" style="color:#f59e0b">Azure Monitor</div>
          <div class="d2-ic-name">E2E · Discrepancias</div>
          <div class="d2-ic-sub" style="color:#fbbf24">Ambas fuentes en sync</div>
          <div class="d2-ic-leds"><span class="led led-amber animate-blink" style="width:6px;height:6px;animation-delay:.6s"></span></div>
        </div>
        <div class="d2-adf-card" data-nid="adf" onclick="selNode('adf')">
          <div class="d2-ic-lbl" style="color:#38bdf8">ADF · Full E2E</div>
          <div class="d2-ic-name">Azure Data Factory</div>
          <div class="d2-ic-sub" style="color:#38bdf8">Pipelines paralelos</div>
          <div class="d2-ic-leds">
            <span class="led led-blue animate-pulse" style="width:6px;height:6px"></span>
            <span class="led led-green animate-blink" style="width:6px;height:6px"></span>
          </div>
        </div>
      </div>
      <div style="position:relative;height:14px;margin-bottom:8px">
        <div style="position:absolute;left:90px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
        <div style="position:absolute;left:280px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.25)"></div>
        <div style="position:absolute;left:430px;top:0;height:14px;border-left:1px dashed rgba(99,153,34,.45)"></div>
      </div>
      <div style="font-size:9px;color:#475569;letter-spacing:.8px;margin-bottom:10px">COEXISTENCIA DE SISTEMAS · 100 / 1.200 CONTRATOS PILOTO</div>

      <!-- Diagrama de convergencia: dos fuentes → Bronze → Silver -->
      <div style="display:flex;align-items:stretch;gap:0">

        <!-- Columna izquierda: dos fuentes -->
        <div style="display:flex;flex-direction:column;justify-content:center;gap:10px">

          <div class="d1-server server-red" data-nid="efm2" onclick="selNode('efm2')" style="width:125px">
            <div class="server-face">
              <div class="server-header">
                <span class="led led-red animate-blink" style="animation-duration:1.4s"></span>
                <span class="server-id">NuestroERP ERP</span>
              </div>
              <div class="server-body">
                <h4>NuestroERP</h4>
                <p class="server-tech" style="color:#ef4444;font-size:10px">On-premise · SQL 2019</p>
                <p class="server-sub">1.100 contratos</p>
              </div>
              <div class="server-vents"><span></span><span></span></div>
            </div>
            <div class="rack-badge badge-red-node">LEGACY</div>
          </div>

          <div class="d1-server server-blue" data-nid="azuresql2" onclick="selNode('azuresql2')" style="width:125px">
            <div class="server-face">
              <div class="server-header">
                <span class="led led-blue animate-blink"></span>
                <span class="server-id">AZURE SQL</span>
              </div>
              <div class="server-body">
                <h4>Azure SQL</h4>
                <p class="server-tech" style="color:#38bdf8;font-size:10px">Cloud · PaaS</p>
                <p class="server-sub">100 contratos piloto</p>
              </div>
              <div class="server-vents"><span></span><span></span></div>
            </div>
            <div class="rack-badge" style="background:rgba(7,25,50,.8);color:#7dd3fc;border:1px solid rgba(56,189,248,.3)">PILOT</div>
          </div>

        </div>

        <!-- Cables de convergencia -->
        <div style="position:relative;width:55px;align-self:stretch">
          <!-- Línea superior (NuestroERP → Bronze) -->
          <div style="position:absolute;left:0;top:28%;width:70%;height:2px;background:linear-gradient(to right,#ef4444,transparent)"></div>
          <!-- Línea inferior (Azure SQL → Bronze) -->
          <div style="position:absolute;left:0;bottom:28%;width:70%;height:2px;background:linear-gradient(to right,#38bdf8,transparent)"></div>
          <!-- Barra vertical derecha conectando ambas -->
          <div style="position:absolute;right:30%;top:28%;bottom:28%;width:2px;background:linear-gradient(to bottom,#ef4444,#0d9488,#38bdf8)"></div>
          <!-- Flecha derecha desde la barra -->
          <div style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:35%;height:2px;background:#0d9488"></div>
        </div>

        <!-- Bronze convergencia -->
        <div class="d1-server server-teal" data-nid="bronzem" onclick="selNode('bronzem')" style="width:130px;align-self:center">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">BRONZE SHARED</span>
            </div>
            <div class="server-body">
              <h4>Bronze</h4>
              <p class="server-tech" style="color:#0d9488;font-size:10px">Esquema unificado</p>
              <p class="server-sub">Ambas fuentes</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">CONVERGE</div>
        </div>

        <!-- Cable Bronze → Silver -->
        <div class="cab teal-flow" style="width:50px;align-self:center"></div>

        <!-- Silver unificado -->
        <div class="d1-server server-green active-server" data-nid="silverm" onclick="selNode('silverm')" style="width:120px;align-self:center">
          <div class="server-face">
            <div class="server-header">
              <div class="led-group">
                <span class="led led-green animate-fast-blink"></span>
                <span class="led led-blue animate-pulse"></span>
              </div>
              <span class="server-id">SILVER UNIFIED</span>
            </div>
            <div class="server-body">
              <h4>Silver</h4>
              <p class="server-tech" style="color:#10b981;font-size:10px">Historia continua</p>
              <p class="server-sub">SCD-2 · sin ruptura</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge">UNIFIED</div>
        </div>

      </div>

      <!-- R5 retorno -->
      <div style="margin-top:14px;display:flex;align-items:center;gap:10px">
        <div class="d1-server server-red-node" data-nid="r5m" onclick="selNode('r5m')" style="width:125px">
          <div class="server-face">
            <div class="server-header">
              <span class="led led-red animate-blink" style="animation-duration:1.2s"></span>
              <span class="server-id">R5 · RETORNO</span>
            </div>
            <div class="server-body">
              <h4>Power Automate</h4>
              <p class="server-tech" style="color:#ef4444;font-size:10px">Desktop RPA · EFM</p>
            </div>
            <div class="server-vents"><span></span><span></span></div>
          </div>
          <div class="rack-badge badge-red-node">RETURN</div>
        </div>
        <div style="font-size:9px;color:#64748b;max-width:360px;line-height:1.6">
          Canal de retorno permanente: aprobaciones Argos → NuestroERP via RPA. Activo durante toda la convivencia. R3 (DBA manual) como fallback.
        </div>
      </div>

    </div>
  </div>
</div>
<div class="d1-log-wrap">
  <p class="d1-log-line">100 contratos operan en paralelo en ambos sistemas. NuestroERP continúa procesando los 1.100 contratos restantes mientras Azure SQL gestiona los 100 migrados al piloto. Ambos flujos convergen en Bronze con el mismo esquema, tratados idénticamente por el pipeline. Silver preserva la historia completa — un contrato migrado no empieza desde cero, continúa su línea temporal. R5 mantiene el ciclo cerrado: los cambios aprobados en Argos regresan a NuestroERP automáticamente, garantizando que el ERP legacy permanezca sincronizado durante toda la transición.</p>
</div>`
/* ── Fin CH8 ──────────────────────────────────────────────────── */

/* ── CH9: La decisión de Rolando — slide cinemático ─────────────
   5 beats: historia → pausa → cuento → rewind → historia real
   ──────────────────────────────────────────────────────────────── */
,CH9: `<div class="rolando-wrap" id="rolando-stage">

  <!-- Beat 0: La decisión de Rolando -->
  <div class="rolando-beat rb-active" id="rb-0">
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:3rem;text-align:center;gap:0">

      <div style="font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(239,68,68,.5);margin-bottom:2.5rem;opacity:0;animation:rb-appear .4s .1s ease forwards">Lunes · 07:30</div>

      <div style="font-family:'Poppins',sans-serif;font-size:clamp(32px,4vw,52px);font-weight:700;color:#fff;line-height:1.15;letter-spacing:-.02em;max-width:16ch;margin-bottom:2rem;opacity:0;animation:rb-appear .5s .3s ease forwards">La decisión de Rolando</div>

      <div style="width:40px;height:1px;background:rgba(239,68,68,.4);margin-bottom:2rem;opacity:0;animation:rb-appear .3s .6s ease forwards"></div>

      <div style="font-size:clamp(15px,1.6vw,19px);color:rgba(255,255,255,.62);line-height:1.85;font-weight:300;max-width:44ch;margin-bottom:2.5rem;opacity:0;animation:rb-appear .5s .7s ease forwards">
        Hay dos camiones en el pasillo de carga. Esperaba uno.<br>
        No hay nota. No hay correo. No hay contexto.<br>
        Solo una decisión antes de que el frío se rompa.
      </div>

      <div style="font-family:'Poppins',sans-serif;font-size:clamp(17px,2vw,24px);font-weight:700;color:#ef4444;letter-spacing:-.01em;margin-bottom:.6rem;opacity:0;animation:rb-appear .5s 1.4s ease forwards">Rechaza el segundo despacho.</div>
      <div style="font-size:clamp(13px,1.4vw,16px);color:rgba(255,255,255,.38);font-weight:300;letter-spacing:.04em;opacity:0;animation:rb-appear .5s 1.9s ease forwards">El martes, cien personas sin churrasco.</div>

    </div>
  </div>

  <!-- Beat 2: Pero esta historia nunca pasó -->
  <div class="rolando-beat" id="rb-2">
    <div class="rb-fairy-wrap">
      <div class="rb-fairy-txt">Pero esto en realidad no pasó.</div>
      <div class="rb-fairy-hint">→ para continuar</div>
    </div>
  </div>

  <!-- Beat 3: Rewind -->
  <div class="rolando-beat" id="rb-3">
    <div class="rb-rewind-wrap">
      <div class="rb-vhs"></div>
      <div class="rb-rewind-label">⏪ volviendo al jueves · 16:40</div>
      <div class="rb-rewind-num" id="rb-rewind-num">16:40</div>
    </div>
  </div>

  <!-- Beat 4: vacío -->
  <div class="rolando-beat" id="rb-4"></div>

</div>`
/* ── Fin CH9 ──────────────────────────────────────────────────── */

}; /* fin CUSTOM_DIAGRAMS */

function renderDiagram() {
  const d=CHAPTERS[cur];
  const wrap=$('r-diagram-wrap');

  /* ── Diagrama personalizado (custom HTML) ── */
  if(d.diagram.custom) {
    wrap.classList.add('has-custom');
    $('r-diag-svg').innerHTML = CUSTOM_DIAGRAMS[d.diagram.custom] || '<p style="color:rgba(255,255,255,.4);padding:2rem">Diagrama no encontrado.</p>';
    return;
  }

  /* ── Diagrama SVG estándar ── */
  wrap.classList.remove('has-custom');
  const nodes=d.diagram.nodes, edges=d.diagram.edges;
  const defs=`<defs><marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 2L8 5L1 8" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-linecap="round"/></marker></defs>`;
  const edgesSvg=edges.map(e=>{const fn=nodes.find(n=>n.id===e.f),tn=nodes.find(n=>n.id===e.t);return fn&&tn?svgEdge(fn,tn,e.l,e.fm,e.tt):''}).join('');
  const nodesSvg=nodes.map(n=>svgNode(n,n.id===selId)).join('');
  $('r-diag-svg').innerHTML=`<svg viewBox="0 0 600 270" xmlns="http://www.w3.org/2000/svg">${defs}${edgesSvg}${nodesSvg}</svg>`;
  $('r-diag-title').innerHTML=markup(d.title);
}

/* § JS-LOGICA ── Render, modos, navegación, init ─────────── */

/* ── Viaje del dato: OC-24-0834 ──────────────────────────────── */
const ALL_STEPS=[
  {t:'T+0s', title:'Ingreso en NuestroERP', desc:'OC-24-1021 · 120 porciones churrasco 220g · CECO-0471 · entrega 2024-10-22',
   relato:'María lleva veinte minutos mirando la pantalla. Los últimos meses no han sido buenos. Completa el formulario despacio, revisa el CECO, revisa la fecha. 120 porciones. Martes 22. Presiona Guardar. Siente algo parecido al alivio. Se levanta a buscar agua. Tres minutos después vuelve, no recuerda si presionó. Llena el formulario de nuevo.',
   tecnico:'INSERT INTO dbo.pedidos (id_oc, id_contrato, tipo, cantidad, precio_unit, fecha_entrega)\nVALUES (\'OC-24-1021\', \'CECO-0471\', \'CHURRASCO_220G\', 120, 8500.00, \'2024-10-22\')\nLSN 0x0001B7A2 · 16:02:15.412 · SQL Server 2019\nOC-24-1022 duplicado: LSN 0x0001B7C8 · 16:05:33.089',
   tema:'El ERP acepta ambos pedidos sin distinción. Sin Argos, ambos habrían pasado.'},
  {t:'T+3s',   title:'CDC captura el delta',        desc:'__$operation=2 (INSERT), __$start_lsn asignado. Lectura asíncrona del log sin impacto en producción.'},
  {t:'T+8s',   title:'Extracción vía SHIR-02',      desc:'ADF activa ventana incremental. SHIR-02 transporta el delta encriptado a Azure vía HTTPS.'},
  {t:'T+12s',  title:'Aterrizaje en Bronze Layer',  desc:'Parquet escrito en ADLS Gen2. Partición /2024/11/14/14/. Registro inmutable — append-only.'},
  {t:'T+13s',  title:'DQ Gate — R07 rechaza',       desc:'Monto $1.840.000 supera rango histórico PRV-887. Enviado a subdirectorio de cuarentena.',warn:true},
  {t:'T+14min',title:'Corrección y reingreso',       desc:'Supervisor confirma alza estacional. Aprobación manual. Reingreso: 12/12 reglas aprobadas.'},
  {t:'T+14m3s',title:'Silver Layer — SCD-2',         desc:'Versión 1 creada. PRV-887 vinculado a maestro. Delta Lake escrito con historial completo.'},
  {t:'T+45s*', title:'Gold — KPIs actualizados',    desc:'Sumado al gasto semanal Unidad 7. Forecast recalculado. (*Sin cuarentena el tiempo es T+45s)'},
  {t:'T+46s*', title:'Alerta de anomalía',           desc:'+34% sobre media histórica PRV-887. Azure Functions notifica en tiempo real a jefe de compras.'},
  {t:'T+2min', title:'Dashboard Power BI',           desc:'OC-24-0834 visible en "Pedidos del día". Decisión: confirmar disponibilidad de stock.'}
];