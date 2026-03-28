import { useCallback, useEffect, useRef, useState } from "react";

const GRID_SPACING = 60;
const MOBILE_BREAKPOINT = 768;

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const createNodes = (width, height, tileWidth, isMobile) => {
  const centerY = height * 0.42;
  const startX = width * 0.12;
  const endX = width * 0.88;
  const count = 5;
  const horizontalStep = (endX - startX) / (count - 1);
  const yAmplitude = Math.max(24, Math.min(40, height * 0.06));

  const mobileX = width * 0.5;
  const mobileStartY = Math.max(120, height * 0.14);
  const mobileEndY = Math.min(height * 0.66, height - 300);
  const mobileStep = (mobileEndY - mobileStartY) / (count - 1);
  const mobileStagger = Math.min(28, width * 0.08);

  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const type = i === 0 || i === count - 1 ? "companion" : "repeater";
    const id =
      i === 0 ? "SENDER_NODE" : i === count - 1 ? "RECIP_NODE" : `RPT_TILE_${i}`;

    let elev = "12 ft";
    if (i === 1) elev = "542 ft";
    if (i === 2) elev = "1,180 ft";
    if (i === 3) elev = "625 ft";
    if (i === 4) elev = "18 ft";

    const settings =
      type === "companion"
        ? [
            { label: "BATT", value: "92%", color: "#22c55e" },
            { label: "RSSI", value: "-105 dBm", color: "#475569" },
            { label: "ELEV", value: elev, color: "#475569" },
          ]
        : [
            { label: "SOLAR", value: "4.1V", color: "#f59e0b" },
            { label: "ELEV", value: elev, color: "#3b82f6" },
            { label: "TEMP", value: "22 C", color: "#475569" },
          ];

    nodes.push({
      id,
      type,
      settings,
      x: isMobile
        ? mobileX + (i % 2 === 0 ? -mobileStagger : mobileStagger)
        : startX + i * horizontalStep,
      y: isMobile
        ? mobileStartY + i * mobileStep
        : centerY + (i % 2 === 0 ? -yAmplitude : yAmplitude),
      tileWidth,
      tileHeight: tileWidth * 1.18,
    });
  }

  return nodes;
};

const drawCompanion = (ctx, x, y, time, scale) => {
  ctx.fillStyle = "#334155";
  drawRoundedRect(
    ctx,
    x - 20 * scale,
    y - 35 * scale,
    40 * scale,
    60 * scale,
    6 * scale,
  );
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(x - 16 * scale, y - 30 * scale, 32 * scale, 24 * scale);

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(x - 12 * scale, y - 26 * scale, 14 * scale, 2 * scale);
  ctx.fillRect(x - 12 * scale, y - 22 * scale, 20 * scale, 2 * scale);

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(x + 12 * scale, y - 35 * scale);
  ctx.lineTo(x + 12 * scale, y - 55 * scale);
  ctx.stroke();

  const pulse = (Math.sin(time * 0.1) + 1) / 2;
  ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + pulse * 0.6})`;
  ctx.beginPath();
  ctx.arc(x - 10 * scale, y + 15 * scale, 2.5 * scale, 0, Math.PI * 2);
  ctx.fill();
};

const drawRepeater = (ctx, x, y, time, scale) => {
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y + 40 * scale);
  ctx.lineTo(x, y - 40 * scale);
  ctx.stroke();

  ctx.fillStyle = "#f1f5f9";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1 * scale;
  drawRoundedRect(
    ctx,
    x - 15 * scale,
    y - 20 * scale,
    30 * scale,
    40 * scale,
    3 * scale,
  );
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(x - 25 * scale, y - 25 * scale);
  ctx.lineTo(x - 5 * scale, y - 45 * scale);
  ctx.lineTo(x + 15 * scale, y - 45 * scale);
  ctx.lineTo(x - 5 * scale, y - 25 * scale);
  ctx.closePath();
  ctx.fill();

  const ledOn = Math.floor(time * 0.05) % 2 === 0;
  ctx.fillStyle = ledOn ? "#22c55e" : "#064e3b";
  ctx.beginPath();
  ctx.arc(x - 8 * scale, y + 10 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();
};

const drawNode = (ctx, node, time, options = {}) => {
  const {
    showSendButton = false,
    sendDisabled = false,
    sendHover = false,
    sendHotspotRef,
  } = options;
  const tileWidth = node.tileWidth;
  const tileHeight = node.tileHeight;
  const yOffset = -20;
  const iconScale = tileWidth / 180;

  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#ffffff";
  drawRoundedRect(
    ctx,
    node.x - tileWidth / 2,
    node.y - tileHeight / 2,
    tileWidth,
    tileHeight,
    16,
  );
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  if (node.type === "companion") {
    drawCompanion(ctx, node.x, node.y + yOffset, time, iconScale);
  } else {
    drawRepeater(ctx, node.x, node.y + yOffset, time, iconScale);
  }

  const left = node.x - tileWidth / 2 + 14;
  const right = node.x + tileWidth / 2 - 14;
  const startY = node.y + 30;

  ctx.textAlign = "left";
  ctx.fillStyle = "#1e293b";
  ctx.font = "700 11px Inter, system-ui, sans-serif";
  ctx.fillText(node.id, left, startY);

  ctx.strokeStyle = "#f1f5f9";
  ctx.beginPath();
  ctx.moveTo(left, startY + 6);
  ctx.lineTo(right, startY + 6);
  ctx.stroke();

  ctx.font = "600 9px Inter, system-ui, sans-serif";
  node.settings.forEach((setting, index) => {
    const rowY = startY + 18 + index * 14;
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "left";
    ctx.fillText(setting.label, left, rowY);
    ctx.fillStyle = setting.color;
    ctx.textAlign = "right";
    ctx.fillText(setting.value, right, rowY);
  });

  if (showSendButton) {
    const btnWidth = tileWidth - 28;
    const btnHeight = 24;
    const btnX = node.x - btnWidth / 2;
    const btnY = node.y + tileHeight / 2 + 8;

    if (sendHotspotRef) {
      sendHotspotRef.current = {
        x: btnX,
        y: btnY,
        width: btnWidth,
        height: btnHeight,
        enabled: !sendDisabled,
      };
    }

    ctx.fillStyle = sendDisabled ? "#cbd5e1" : sendHover ? "#1d4ed8" : "#2563eb";
    drawRoundedRect(ctx, btnX, btnY, btnWidth, btnHeight, 6);
    ctx.fill();

    ctx.fillStyle = sendDisabled ? "#64748b" : "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "700 10px Inter, system-ui, sans-serif";
    ctx.fillText("SEND DATA", node.x, btnY + 16);
  }
};

const drawConnection = (ctx, line, time) => {
  const yOffset = -20;
  const startX = line.from.x;
  const startY = line.from.y + yOffset;
  const endX = line.to.x;
  const endY = line.to.y + yOffset;
  const currentX = startX + (endX - startX) * line.progress;
  const currentY = startY + (endY - startY) * line.progress;

  ctx.strokeStyle = line.color;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  const glowSize = 5 + Math.sin(time * 0.2) * 3;
  ctx.shadowBlur = 20;
  ctx.shadowColor = line.color;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
};

const toneClass = {
  idle: "text-blue-600",
  active: "text-orange-500",
  complete: "text-green-600",
};

const MeshNetworkTelemetry = ({ startSignal = 0, autoTransmitSignal = 0 }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const boundsRef = useRef({ width: 0, height: 0 });
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const transmissionStepRef = useRef(-1);
  const sendHotspotRef = useRef(null);
  const sendHoverRef = useRef(false);
  const sendLockedRef = useRef(false);
  const autoTransmitHandledRef = useRef(0);
  const mobileLayoutRef = useRef(false);
  const lastAutoScrollTopRef = useRef(null);

  const initialized = startSignal > 0;
  const [status, setStatus] = useState({
    tone: "idle",
    text: "NETWORK IDLE",
    sub: "Click SEND on SENDER_NODE - v2.4.18 Firmware",
  });
  const [sendLocked, setSendLocked] = useState(false);

  useEffect(() => {
    sendLockedRef.current = sendLocked;
  }, [sendLocked]);

  useEffect(() => {
    if (!initialized) return undefined;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(360, rect.height);
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      boundsRef.current = { width, height };
      const isMobile = width < MOBILE_BREAKPOINT;
      mobileLayoutRef.current = isMobile;
      const tileWidth = isMobile
        ? Math.max(102, Math.min(128, width * 0.33))
        : Math.max(120, Math.min(180, width / 6));
      nodesRef.current = createNodes(width, height, tileWidth, isMobile);
      connectionsRef.current = [];
      transmissionStepRef.current = -1;
      sendHotspotRef.current = null;
      sendHoverRef.current = false;
      sendLockedRef.current = false;
      lastAutoScrollTopRef.current = null;
      setSendLocked(false);
      setStatus({
        tone: "idle",
        text: "NETWORK IDLE",
        sub: "Click SEND on SENDER_NODE - v2.4.18 Firmware",
      });
    };

    const autoScrollWithTrace = (traceY) => {
      if (!mobileLayoutRef.current) return;
      const rect = container.getBoundingClientRect();
      const pageTarget = window.scrollY + rect.top + traceY - window.innerHeight * 0.45;
      const clampedTarget = Math.max(0, pageTarget);
      if (
        lastAutoScrollTopRef.current !== null &&
        Math.abs(clampedTarget - lastAutoScrollTopRef.current) < 8
      ) {
        return;
      }
      lastAutoScrollTopRef.current = clampedTarget;
      window.scrollTo({ top: clampedTarget, behavior: "auto" });
    };

    const updateTransmission = () => {
      if (transmissionStepRef.current === -1) return;

      const nodes = nodesRef.current;
      const lines = connectionsRef.current;

      if (
        transmissionStepRef.current < nodes.length - 1 &&
        !lines[transmissionStepRef.current]
      ) {
        lines.push({
          from: nodes[transmissionStepRef.current],
          to: nodes[transmissionStepRef.current + 1],
          progress: 0,
          complete: false,
          color: "#2563eb",
        });
      }

      const currentLine = lines[transmissionStepRef.current];
      if (!currentLine) return;

      if (currentLine.progress < 1) {
        currentLine.progress = Math.min(1, currentLine.progress + 0.02);
        if (currentLine.progress === 1) currentLine.complete = true;
      }

      const yOffset = -20;
      const traceY =
        currentLine.from.y +
        yOffset +
        (currentLine.to.y - currentLine.from.y) * currentLine.progress;
      autoScrollWithTrace(traceY);

      if (currentLine.complete) {
        transmissionStepRef.current += 1;
        if (transmissionStepRef.current >= nodes.length - 1) {
          setStatus({
            tone: "complete",
            text: "HANDSHAKE COMPLETE",
            sub: "Data Delivered - Ack Received (0.4s)",
          });
        }
      }
    };

    const render = () => {
      timeRef.current += 1;
      const { width, height } = boundsRef.current;

      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(15, 23, 42, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      updateTransmission();
      sendHotspotRef.current = null;

      nodesRef.current.forEach((node, index) => {
        drawNode(ctx, node, timeRef.current, {
          showSendButton: index === 0,
          sendDisabled:
            sendLockedRef.current || transmissionStepRef.current !== -1,
          sendHover: index === 0 ? sendHoverRef.current : false,
          sendHotspotRef,
        });
      });

      connectionsRef.current.forEach((line) => drawConnection(ctx, line, timeRef.current));
      animationRef.current = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    resizeCanvas();
    animationRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initialized]);

  const beginTransmission = useCallback(() => {
    if (
      !initialized ||
      sendLockedRef.current ||
      transmissionStepRef.current !== -1
    ) {
      return;
    }

    connectionsRef.current = [];
    transmissionStepRef.current = 0;
    sendLockedRef.current = true;
    setSendLocked(true);
    setStatus({
      tone: "active",
      text: "PATHFINDING...",
      sub: "Establishing secure relay path",
    });

    if (mobileLayoutRef.current && nodesRef.current.length > 0) {
      const container = containerRef.current;
      const firstNode = nodesRef.current[0];
      if (container && firstNode) {
        const rect = container.getBoundingClientRect();
        const initialTop =
          window.scrollY + rect.top + (firstNode.y - 20) - window.innerHeight * 0.45;
        const clampedTop = Math.max(0, initialTop);
        lastAutoScrollTopRef.current = clampedTop;
        window.scrollTo({ top: clampedTop, behavior: "smooth" });
      }
    }
  }, [initialized]);

  useEffect(() => {
    if (
      !initialized ||
      autoTransmitSignal === 0 ||
      autoTransmitSignal === autoTransmitHandledRef.current
    ) {
      return undefined;
    }

    autoTransmitHandledRef.current = autoTransmitSignal;
    const frame = requestAnimationFrame(() => {
      beginTransmission();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoTransmitSignal, initialized, beginTransmission]);

  const resetTransmission = () => {
    connectionsRef.current = [];
    transmissionStepRef.current = -1;
    sendHoverRef.current = false;
    sendLockedRef.current = false;
    lastAutoScrollTopRef.current = null;
    setSendLocked(false);
    setStatus({
      tone: "idle",
      text: "NETWORK IDLE",
      sub: "Click SEND on SENDER_NODE - v2.4.18 Firmware",
    });
  };

  const isInsideSendButton = (clientX, clientY) => {
    const hotspot = sendHotspotRef.current;
    const canvas = canvasRef.current;
    if (!hotspot || !canvas || !hotspot.enabled) return false;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return (
      x >= hotspot.x &&
      x <= hotspot.x + hotspot.width &&
      y >= hotspot.y &&
      y <= hotspot.y + hotspot.height
    );
  };

  const handleCanvasClick = (event) => {
    if (isInsideSendButton(event.clientX, event.clientY)) {
      beginTransmission();
    }
  };

  const handleCanvasPointerMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hovering = isInsideSendButton(event.clientX, event.clientY);
    sendHoverRef.current = hovering;
    canvas.style.cursor = hovering ? "pointer" : "crosshair";
  };

  const handleCanvasPointerLeave = () => {
    const canvas = canvasRef.current;
    sendHoverRef.current = false;
    if (canvas) canvas.style.cursor = "crosshair";
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm h-[980px] md:h-[640px]"
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onPointerMove={handleCanvasPointerMove}
        onPointerLeave={handleCanvasPointerLeave}
        className="absolute inset-0 block h-full w-full cursor-crosshair"
      />

      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-4 md:p-8">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-end justify-center gap-4 md:gap-6">
          <div className="pointer-events-auto bg-white/95 border border-slate-200 backdrop-blur-md rounded-2xl p-5 shadow-md w-full xl:w-72">
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2 h-4 bg-blue-500 rounded-full" />
              Node Types
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-slate-200 rounded bg-white flex items-center justify-center">
                  <div className="w-3 h-5 bg-slate-700 rounded-sm" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Companion</div>
                  <div className="text-slate-500 text-[10px]">Handheld Interface</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-slate-200 rounded bg-white flex items-center justify-center">
                  <div className="w-1 h-5 bg-slate-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">Repeater</div>
                  <div className="text-slate-500 text-[10px]">Infrastructure</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto bg-white/95 border border-slate-200 backdrop-blur-md rounded-2xl p-5 shadow-md w-full xl:min-w-[420px]">
            <div className="text-center w-full">
              <div
                className={`${toneClass[status.tone]} font-mono text-xs font-black uppercase tracking-[0.2em]`}
              >
                {status.text}
              </div>
              <div className="text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-wider">
                {status.sub}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Send control moved to first tile
              </div>
              <button
                type="button"
                onClick={resetTransmission}
                className="bg-white hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-slate-500 transition-colors text-xs font-bold"
              >
                RESET PATH
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeshNetworkTelemetry;
