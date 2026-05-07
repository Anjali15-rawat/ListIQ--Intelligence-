import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BftUDJXA.js";
import { L as Link, u as useNavigate } from "./router-Cd8OO_V4.js";
import { i as frame, j as cancelFrame, k as interpolate, l as isMotionValue, J as JSAnimation, s as supportsViewTimeline, n as supportsScrollTimeline, p as progress, v as velocityPerSecond, o as isHTMLElement, q as defaultOffset$1, r as clamp, t as noop, u as resize, w as frameData, x as useConstant, y as useIsomorphicLayoutEffect, z as invariant, D as motionValue, F as MotionConfigContext, H as collectMotionValues, c as createLucideIcon, m as motion, K as KitiMascot, h as Button, X, S as Sparkles, Z as Zap, g as Star, B as Brain, I as mockStats, a as Search, E as Eye, G as GlassCard, C as ChevronDown, A as AnimatePresence, b as Shield, M as Mail } from "./mockData-DmPj-sOB.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function observeTimeline(update, timeline) {
  let prevProgress;
  const onFrame = () => {
    const { currentTime } = timeline;
    const percentage = currentTime === null ? 0 : currentTime.value;
    const progress2 = percentage / 100;
    if (prevProgress !== progress2) {
      update(progress2);
    }
    prevProgress = progress2;
  };
  frame.preUpdate(onFrame, true);
  return () => cancelFrame(onFrame);
}
function transform(...args) {
  const useImmediate = !Array.isArray(args[0]);
  const argOffset = useImmediate ? 0 : -1;
  const inputValue = args[0 + argOffset];
  const inputRange = args[1 + argOffset];
  const outputRange = args[2 + argOffset];
  const options = args[3 + argOffset];
  const interpolator = interpolate(inputRange, outputRange, options);
  return useImmediate ? interpolator(inputValue) : interpolator;
}
function attachFollow(value, source, options = {}) {
  const initialValue = value.get();
  let activeAnimation = null;
  let latestValue = initialValue;
  let latestSetter;
  const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
  const stopAnimation = () => {
    if (activeAnimation) {
      activeAnimation.stop();
      activeAnimation = null;
    }
    value.animation = void 0;
  };
  const startAnimation = () => {
    const currentValue = asNumber(value.get());
    const targetValue = asNumber(latestValue);
    if (currentValue === targetValue) {
      stopAnimation();
      return;
    }
    const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
    stopAnimation();
    activeAnimation = new JSAnimation({
      keyframes: [currentValue, targetValue],
      velocity,
      // Default to spring if no type specified (matches useSpring behavior)
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...options,
      onUpdate: latestSetter
    });
  };
  const scheduleAnimation = () => {
    startAnimation();
    value.animation = activeAnimation ?? void 0;
    value["events"].animationStart?.notify();
    activeAnimation?.then(() => {
      value.animation = void 0;
      value["events"].animationComplete?.notify();
    });
  };
  value.attach((v, set) => {
    latestValue = v;
    latestSetter = (latest) => set(parseValue(latest, unit));
    frame.postRender(scheduleAnimation);
  }, stopAnimation);
  if (isMotionValue(source)) {
    let skipNextAnimation = options.skipInitialAnimation === true;
    const removeSourceOnChange = source.on("change", (v) => {
      if (skipNextAnimation) {
        skipNextAnimation = false;
        value.jump(parseValue(v, unit), false);
      } else {
        value.set(parseValue(v, unit));
      }
    });
    const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
    return () => {
      removeSourceOnChange();
      removeValueOnDestroy();
    };
  }
  return stopAnimation;
}
function parseValue(v, unit) {
  return unit ? v + unit : v;
}
function asNumber(v) {
  return typeof v === "number" ? v : parseFloat(v);
}
function canUseNativeTimeline(target) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() : supportsScrollTimeline();
}
const maxElapsed = 50;
const createAxisInfo = () => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0
});
const createScrollInfo = () => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo()
});
const keys = {
  x: {
    length: "Width",
    position: "Left"
  },
  y: {
    length: "Height",
    position: "Top"
  }
};
function updateAxisInfo(element, axisName, info, time) {
  const axis = info[axisName];
  const { length, position } = keys[axisName];
  const prev = axis.current;
  const prevTime = info.time;
  axis.current = Math.abs(element[`scroll${position}`]);
  axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
  axis.offset.length = 0;
  axis.offset[0] = 0;
  axis.offset[1] = axis.scrollLength;
  axis.progress = progress(0, axis.scrollLength, axis.current);
  const elapsed = time - prevTime;
  axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time) {
  updateAxisInfo(element, "x", info, time);
  updateAxisInfo(element, "y", info, time);
  info.time = time;
}
function calcInset(element, container) {
  const inset = { x: 0, y: 0 };
  let current = element;
  while (current && current !== container) {
    if (isHTMLElement(current)) {
      inset.x += current.offsetLeft;
      inset.y += current.offsetTop;
      current = current.offsetParent;
    } else if (current.tagName === "svg") {
      const svgBoundingBox = current.getBoundingClientRect();
      current = current.parentElement;
      const parentBoundingBox = current.getBoundingClientRect();
      inset.x += svgBoundingBox.left - parentBoundingBox.left;
      inset.y += svgBoundingBox.top - parentBoundingBox.top;
    } else if (current instanceof SVGGraphicsElement) {
      const { x, y } = current.getBBox();
      inset.x += x;
      inset.y += y;
      let svg = null;
      let parent = current.parentNode;
      while (!svg) {
        if (parent.tagName === "svg") {
          svg = parent;
        }
        parent = current.parentNode;
      }
      current = svg;
    } else {
      break;
    }
  }
  return inset;
}
const namedEdges = {
  start: 0,
  center: 0.5,
  end: 1
};
function resolveEdge(edge, length, inset = 0) {
  let delta = 0;
  if (edge in namedEdges) {
    edge = namedEdges[edge];
  }
  if (typeof edge === "string") {
    const asNumber2 = parseFloat(edge);
    if (edge.endsWith("px")) {
      delta = asNumber2;
    } else if (edge.endsWith("%")) {
      edge = asNumber2 / 100;
    } else if (edge.endsWith("vw")) {
      delta = asNumber2 / 100 * document.documentElement.clientWidth;
    } else if (edge.endsWith("vh")) {
      delta = asNumber2 / 100 * document.documentElement.clientHeight;
    } else {
      edge = asNumber2;
    }
  }
  if (typeof edge === "number") {
    delta = length * edge;
  }
  return inset + delta;
}
const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
  let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
  let targetPoint = 0;
  let containerPoint = 0;
  if (typeof offset === "number") {
    offsetDefinition = [offset, offset];
  } else if (typeof offset === "string") {
    offset = offset.trim();
    if (offset.includes(" ")) {
      offsetDefinition = offset.split(" ");
    } else {
      offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
    }
  }
  targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
  containerPoint = resolveEdge(offsetDefinition[1], containerLength);
  return targetPoint - containerPoint;
}
const ScrollOffset = {
  Enter: [
    [0, 1],
    [1, 1]
  ],
  Exit: [
    [0, 0],
    [1, 0]
  ],
  Any: [
    [1, 0],
    [0, 1]
  ],
  All: [
    [0, 0],
    [1, 1]
  ]
};
const point = { x: 0, y: 0 };
function getTargetSize(target) {
  return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : { width: target.clientWidth, height: target.clientHeight };
}
function resolveOffsets(container, info, options) {
  const { offset: offsetDefinition = ScrollOffset.All } = options;
  const { target = container, axis = "y" } = options;
  const lengthLabel = axis === "y" ? "height" : "width";
  const inset = target !== container ? calcInset(target, container) : point;
  const targetSize = target === container ? { width: container.scrollWidth, height: container.scrollHeight } : getTargetSize(target);
  const containerSize = {
    width: container.clientWidth,
    height: container.clientHeight
  };
  info[axis].offset.length = 0;
  let hasChanged = !info[axis].interpolate;
  const numOffsets = offsetDefinition.length;
  for (let i = 0; i < numOffsets; i++) {
    const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
    if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) {
      hasChanged = true;
    }
    info[axis].offset[i] = offset;
  }
  if (hasChanged) {
    info[axis].interpolate = interpolate(info[axis].offset, defaultOffset$1(offsetDefinition), { clamp: false });
    info[axis].interpolatorOffsets = [...info[axis].offset];
  }
  info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
}
function measure(container, target = container, info) {
  info.x.targetOffset = 0;
  info.y.targetOffset = 0;
  if (target !== container) {
    let node = target;
    while (node && node !== container) {
      info.x.targetOffset += node.offsetLeft;
      info.y.targetOffset += node.offsetTop;
      node = node.offsetParent;
    }
  }
  info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
  info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
  info.x.containerLength = container.clientWidth;
  info.y.containerLength = container.clientHeight;
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
  return {
    measure: (time) => {
      measure(element, options.target, info);
      updateScrollInfo(element, info, time);
      if (options.offset || options.target) {
        resolveOffsets(element, info, options);
      }
    },
    notify: () => onScroll(info)
  };
}
const scrollListeners = /* @__PURE__ */ new WeakMap();
const resizeListeners = /* @__PURE__ */ new WeakMap();
const onScrollHandlers = /* @__PURE__ */ new WeakMap();
const scrollSize = /* @__PURE__ */ new WeakMap();
const dimensionCheckProcesses = /* @__PURE__ */ new WeakMap();
const getEventTarget = (element) => element === document.scrollingElement ? window : element;
function scrollInfo(onScroll, { container = document.scrollingElement, trackContentSize = false, ...options } = {}) {
  if (!container)
    return noop;
  let containerHandlers = onScrollHandlers.get(container);
  if (!containerHandlers) {
    containerHandlers = /* @__PURE__ */ new Set();
    onScrollHandlers.set(container, containerHandlers);
  }
  const info = createScrollInfo();
  const containerHandler = createOnScrollHandler(container, onScroll, info, options);
  containerHandlers.add(containerHandler);
  if (!scrollListeners.has(container)) {
    const measureAll = () => {
      for (const handler of containerHandlers) {
        handler.measure(frameData.timestamp);
      }
      frame.preUpdate(notifyAll);
    };
    const notifyAll = () => {
      for (const handler of containerHandlers) {
        handler.notify();
      }
    };
    const listener2 = () => frame.read(measureAll);
    scrollListeners.set(container, listener2);
    const target = getEventTarget(container);
    window.addEventListener("resize", listener2);
    if (container !== document.documentElement) {
      resizeListeners.set(container, resize(container, listener2));
    }
    target.addEventListener("scroll", listener2);
    listener2();
  }
  if (trackContentSize && !dimensionCheckProcesses.has(container)) {
    const listener2 = scrollListeners.get(container);
    const size = {
      width: container.scrollWidth,
      height: container.scrollHeight
    };
    scrollSize.set(container, size);
    const checkScrollDimensions = () => {
      const newWidth = container.scrollWidth;
      const newHeight = container.scrollHeight;
      if (size.width !== newWidth || size.height !== newHeight) {
        listener2();
        size.width = newWidth;
        size.height = newHeight;
      }
    };
    const dimensionCheckProcess = frame.read(checkScrollDimensions, true);
    dimensionCheckProcesses.set(container, dimensionCheckProcess);
  }
  const listener = scrollListeners.get(container);
  frame.read(listener, false, true);
  return () => {
    cancelFrame(listener);
    const currentHandlers = onScrollHandlers.get(container);
    if (!currentHandlers)
      return;
    currentHandlers.delete(containerHandler);
    if (currentHandlers.size)
      return;
    const scrollListener = scrollListeners.get(container);
    scrollListeners.delete(container);
    if (scrollListener) {
      getEventTarget(container).removeEventListener("scroll", scrollListener);
      resizeListeners.get(container)?.();
      window.removeEventListener("resize", scrollListener);
    }
    const dimensionCheckProcess = dimensionCheckProcesses.get(container);
    if (dimensionCheckProcess) {
      cancelFrame(dimensionCheckProcess);
      dimensionCheckProcesses.delete(container);
    }
    scrollSize.delete(container);
  };
}
const presets = [
  [ScrollOffset.Enter, "entry"],
  [ScrollOffset.Exit, "exit"],
  [ScrollOffset.Any, "cover"],
  [ScrollOffset.All, "contain"]
];
const stringToProgress = {
  start: 0,
  end: 1
};
function parseStringOffset(s) {
  const parts = s.trim().split(/\s+/);
  if (parts.length !== 2)
    return void 0;
  const a = stringToProgress[parts[0]];
  const b = stringToProgress[parts[1]];
  if (a === void 0 || b === void 0)
    return void 0;
  return [a, b];
}
function normaliseOffset(offset) {
  if (offset.length !== 2)
    return void 0;
  const result = [];
  for (const item of offset) {
    if (Array.isArray(item)) {
      result.push(item);
    } else if (typeof item === "string") {
      const parsed = parseStringOffset(item);
      if (!parsed)
        return void 0;
      result.push(parsed);
    } else {
      return void 0;
    }
  }
  return result;
}
function matchesPreset(offset, preset) {
  const normalised = normaliseOffset(offset);
  if (!normalised)
    return false;
  for (let i = 0; i < 2; i++) {
    const o = normalised[i];
    const p = preset[i];
    if (o[0] !== p[0] || o[1] !== p[1])
      return false;
  }
  return true;
}
function offsetToViewTimelineRange(offset) {
  if (!offset) {
    return { rangeStart: "contain 0%", rangeEnd: "contain 100%" };
  }
  for (const [preset, name] of presets) {
    if (matchesPreset(offset, preset)) {
      return { rangeStart: `${name} 0%`, rangeEnd: `${name} 100%` };
    }
  }
  return void 0;
}
const timelineCache = /* @__PURE__ */ new Map();
function scrollTimelineFallback(options) {
  const currentTime = { value: 0 };
  const cancel = scrollInfo((info) => {
    currentTime.value = info[options.axis].progress * 100;
  }, options);
  return { currentTime, cancel };
}
function getTimeline({ source, container, ...options }) {
  const { axis } = options;
  if (source)
    container = source;
  let containerCache = timelineCache.get(container);
  if (!containerCache) {
    containerCache = /* @__PURE__ */ new Map();
    timelineCache.set(container, containerCache);
  }
  const targetKey = options.target ?? "self";
  let targetCache = containerCache.get(targetKey);
  if (!targetCache) {
    targetCache = {};
    containerCache.set(targetKey, targetCache);
  }
  const axisKey = axis + (options.offset ?? []).join(",");
  if (!targetCache[axisKey]) {
    if (options.target && canUseNativeTimeline(options.target)) {
      const range = offsetToViewTimelineRange(options.offset);
      if (range) {
        targetCache[axisKey] = new ViewTimeline({
          subject: options.target,
          axis
        });
      } else {
        targetCache[axisKey] = scrollTimelineFallback({
          container,
          ...options
        });
      }
    } else if (canUseNativeTimeline()) {
      targetCache[axisKey] = new ScrollTimeline({
        source: container,
        axis
      });
    } else {
      targetCache[axisKey] = scrollTimelineFallback({
        container,
        ...options
      });
    }
  }
  return targetCache[axisKey];
}
function attachToAnimation(animation, options) {
  const timeline = getTimeline(options);
  const range = options.target ? offsetToViewTimelineRange(options.offset) : void 0;
  const useNative = options.target ? canUseNativeTimeline(options.target) && !!range : canUseNativeTimeline();
  return animation.attachTimeline({
    timeline: useNative ? timeline : void 0,
    ...range && useNative && {
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd
    },
    observe: (valueAnimation) => {
      valueAnimation.pause();
      return observeTimeline((progress2) => {
        valueAnimation.time = valueAnimation.iterationDuration * progress2;
      }, timeline);
    }
  });
}
function isOnScrollWithInfo(onScroll) {
  return onScroll.length === 2;
}
function attachToFunction(onScroll, options) {
  if (isOnScrollWithInfo(onScroll)) {
    return scrollInfo((info) => {
      onScroll(info[options.axis].progress, info);
    }, options);
  } else {
    return observeTimeline(onScroll, getTimeline(options));
  }
}
function scroll(onScroll, { axis = "y", container = document.scrollingElement, ...options } = {}) {
  if (!container)
    return noop;
  const optionsWithDefaults = { axis, container, ...options };
  return typeof onScroll === "function" ? attachToFunction(onScroll, optionsWithDefaults) : attachToAnimation(onScroll, optionsWithDefaults);
}
const createScrollMotionValues = () => ({
  scrollX: motionValue(0),
  scrollY: motionValue(0),
  scrollXProgress: motionValue(0),
  scrollYProgress: motionValue(0)
});
const isRefPending = (ref) => {
  if (!ref)
    return false;
  return !ref.current;
};
function makeAccelerateConfig(axis, options, container, target) {
  return {
    factory: (animation) => scroll(animation, {
      ...options,
      axis,
      container: container?.current || void 0,
      target: target?.current || void 0
    }),
    times: [0, 1],
    keyframes: [0, 1],
    ease: (v) => v,
    duration: 1
  };
}
function canAccelerateScroll(target, offset) {
  if (typeof window === "undefined")
    return false;
  return target ? supportsViewTimeline() && !!offsetToViewTimelineRange(offset) : supportsScrollTimeline();
}
function useScroll({ container, target, ...options } = {}) {
  const values = useConstant(createScrollMotionValues);
  if (canAccelerateScroll(target, options.offset)) {
    values.scrollXProgress.accelerate = makeAccelerateConfig("x", options, container, target);
    values.scrollYProgress.accelerate = makeAccelerateConfig("y", options, container, target);
  }
  const scrollAnimation = reactExports.useRef(null);
  const needsStart = reactExports.useRef(false);
  const start = reactExports.useCallback(() => {
    scrollAnimation.current = scroll((_progress, { x, y }) => {
      values.scrollX.set(x.current);
      values.scrollXProgress.set(x.progress);
      values.scrollY.set(y.current);
      values.scrollYProgress.set(y.progress);
    }, {
      ...options,
      container: container?.current || void 0,
      target: target?.current || void 0
    });
    return () => {
      scrollAnimation.current?.();
    };
  }, [container, target, JSON.stringify(options.offset)]);
  useIsomorphicLayoutEffect(() => {
    needsStart.current = false;
    if (isRefPending(container) || isRefPending(target)) {
      needsStart.current = true;
      return;
    } else {
      return start();
    }
  }, [start]);
  reactExports.useEffect(() => {
    if (needsStart.current) {
      invariant(!isRefPending(container));
      invariant(!isRefPending(target));
      return start();
    } else {
      return;
    }
  }, [start]);
  return values;
}
function useMotionValue(initial) {
  const value = useConstant(() => motionValue(initial));
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  if (isStatic) {
    const [, setLatest] = reactExports.useState(initial);
    reactExports.useEffect(() => value.on("change", setLatest), []);
  }
  return value;
}
function useCombineMotionValues(values, combineValues) {
  const value = useMotionValue(combineValues());
  const updateValue = () => value.set(combineValues());
  updateValue();
  useIsomorphicLayoutEffect(() => {
    const scheduleUpdate = () => frame.preRender(updateValue, false, true);
    const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      cancelFrame(updateValue);
    };
  });
  return value;
}
function useComputed(compute) {
  collectMotionValues.current = [];
  compute();
  const value = useCombineMotionValues(collectMotionValues.current, compute);
  collectMotionValues.current = void 0;
  return value;
}
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
  if (typeof input === "function") {
    return useComputed(input);
  }
  const outputRange = outputRangeOrMap;
  const transformer = transform(inputRangeOrTransformer, outputRange, options);
  const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
  const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
  if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) {
    result.accelerate = {
      ...inputAccelerate,
      times: inputRangeOrTransformer,
      keyframes: outputRangeOrMap,
      isTransformed: true,
      ...{}
    };
  }
  return result;
}
function useListTransform(values, transformer) {
  const latest = useConstant(() => []);
  return useCombineMotionValues(values, () => {
    latest.length = 0;
    const numValues = values.length;
    for (let i = 0; i < numValues; i++) {
      latest[i] = values[i].get();
    }
    return transformer(latest);
  });
}
function useFollowValue(source, options = {}) {
  const { isStatic } = reactExports.useContext(MotionConfigContext);
  const getFromSource = () => isMotionValue(source) ? source.get() : source;
  if (isStatic) {
    return useTransform(getFromSource);
  }
  const value = useMotionValue(getFromSource());
  reactExports.useInsertionEffect(() => {
    return attachFollow(value, source, options);
  }, [value, JSON.stringify(options)]);
  return value;
}
function useSpring(source, options = {}) {
  return useFollowValue(source, { type: "spring", ...options });
}
const __iconNode$5 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#pricing", label: "Pricing" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.header,
    {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.5 },
      className: "sticky top-0 z-50 px-4 pt-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: `mx-auto max-w-6xl rounded-[2rem] px-6 py-3 flex items-center justify-between border transition-all duration-300 ${scrolled ? "glass-strong shadow-elegant border-white/40" : "glass shadow-soft border-white/20"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary-gradient grid place-items-center shadow-glow group-hover:shadow-hover transition-all overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KitiMascot, { type: "avatar", size: 28, animate: false }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-xl tracking-tight text-foreground", children: "ListIQ - Intelligence" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70", children: [
            navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: l.href, className: "relative group hover:text-foreground transition-colors py-1", children: [
              l.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-0 bottom-0 h-0.5 bg-primary-gradient scale-x-0 group-hover:scale-x-100 transition-transform rounded-full" })
            ] }, l.href)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "hover:text-foreground transition-colors font-semibold", children: "Dashboard" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "hidden md:flex rounded-full bg-primary-gradient hover:opacity-95 shadow-glow hover:shadow-hover transition-all text-white font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: "Try for free" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "md:hidden h-9 w-9 rounded-xl glass grid place-items-center",
                onClick: () => setMobileOpen(!mobileOpen),
                children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            className: "md:hidden mx-4 mt-2 glass-strong rounded-2xl border border-white/30 shadow-elegant overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-1", children: [
              navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: l.href,
                  onClick: () => setMobileOpen(false),
                  className: "block px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors",
                  children: l.label
                },
                l.href
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full rounded-xl bg-primary-gradient text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", onClick: () => setMobileOpen(false), children: "Try for free" }) }) })
            ] })
          }
        )
      ]
    }
  );
}
const floatingCards = [
  { icon: Star, label: "Score: 87/100", sub: "Strong listing ✓", color: "text-emerald-600", bg: "bg-emerald-50", x: "-left-6", y: "top-10" },
  { icon: Zap, label: "3 quick wins", sub: "found by Kiti", color: "text-[var(--primary)]", bg: "bg-[var(--primary-soft)]", x: "-right-4", y: "bottom-16" },
  { icon: Brain, label: "AI analysis", sub: "completed in 8s", color: "text-sky-600", bg: "bg-sky-50", x: "left-4", y: "bottom-4" }
];
function Hero() {
  const [url, setUrl] = reactExports.useState("");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const handleAnalyze = () => {
    if (url.trim()) {
      navigate({ to: "/dashboard", search: { url } });
    } else {
      navigate({ to: "/dashboard" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden px-4 pt-12 pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh opacity-60 pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { scale: [1, 1.1, 1], x: [0, 20, 0] },
        transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        className: "absolute top-10 right-0 h-[500px] w-[500px] rounded-full bg-[var(--primary-soft)] blur-3xl opacity-40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { scale: [1, 1.15, 1], x: [0, -20, 0] },
        transition: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 },
        className: "absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-[var(--lavender-soft)] blur-3xl opacity-40"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { scale: [1, 1.2, 1] },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 },
        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[var(--primary-soft)] blur-3xl opacity-20"
      }
    ),
    [...Array(12)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute rounded-full bg-[var(--primary)] pointer-events-none",
        style: {
          width: 4 + i % 3 * 2,
          height: 4 + i % 3 * 2,
          left: `${8 + i * 7.5}%`,
          top: `${10 + i * 31 % 70}%`,
          opacity: 0.15 + i % 4 * 0.1
        },
        animate: {
          y: [0, -20 - i * 3, 0],
          x: [0, Math.sin(i) * 15, 0],
          opacity: [0.15 + i % 4 * 0.1, 0.5, 0.15 + i % 4 * 0.1]
        },
        transition: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
      },
      i
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.2 },
                className: "inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-foreground/70 mb-6 border border-white/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-[var(--primary)]" }),
                  "AI-powered Amazon intelligence · v2.0 just launched 🎉"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground", children: [
              "Audit any".split("").map((char, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.3 + i * 0.02 },
                  className: "inline-block",
                  children: char === " " ? " " : char
                },
                i
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "hidden md:block" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.span,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.7 },
                  className: "text-gradient",
                  children: "Amazon listing"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.span,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 1 },
                  children: [
                    " ",
                    "with AI"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.8 },
                className: "mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed",
                children: "Paste one product URL and get scores, pain points, competitor gaps, and exact fixes — in seconds."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 1 },
                className: "mt-8 glass-strong rounded-2xl p-2 flex items-center gap-2 shadow-soft max-w-xl border border-white/40 focus-within:border-[var(--primary)] focus-within:shadow-glow transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "url",
                      placeholder: "https://amazon.com/dp/B0...",
                      value: url,
                      onChange: (e) => setUrl(e.target.value),
                      onKeyDown: (e) => e.key === "Enter" && handleAnalyze(),
                      className: "flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      onClick: handleAnalyze,
                      size: "lg",
                      className: "rounded-xl bg-primary-gradient hover:opacity-95 shadow-glow hover:shadow-hover transition-all text-white font-semibold px-6 shrink-0",
                      children: [
                        "Analyze ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 1.2 },
                className: "mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }),
                    " No signup required"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-amber-500" }),
                    " Results in ~12 seconds"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-[var(--primary)]" }),
                    " 1 free audit daily"
                  ] })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.8, delay: 0.3 },
          className: "relative flex items-center justify-center min-h-[400px]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary-gradient rounded-full blur-3xl opacity-10" }),
            [...Array(8)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute h-2.5 w-2.5 rounded-full bg-[var(--primary)] opacity-40",
                animate: {
                  x: Math.cos(i / 8 * 2 * Math.PI) * 180,
                  y: Math.sin(i / 8 * 2 * Math.PI) * 180,
                  rotate: [0, 360]
                },
                transition: {
                  x: { duration: 12, repeat: Infinity, ease: "linear" },
                  y: { duration: 12, repeat: Infinity, ease: "linear" },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                },
                style: {
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%,-50%) rotate(${i / 8 * 360}deg) translateX(180px)`
                }
              },
              i
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { y: [0, -12, 0] },
                transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                className: "relative glass-strong border border-white/50 rounded-[3rem] p-6 shadow-elegant z-10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(KitiMascot, { type: "hero", size: 280, className: "translate-x-4" })
              }
            ),
            floatingCards.map((card, i) => {
              const Icon = card.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1, y: [0, i % 2 === 0 ? -6 : 6, 0] },
                  transition: {
                    opacity: { delay: 1 + i * 0.2 },
                    scale: { delay: 1 + i * 0.2 },
                    y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
                  },
                  className: `absolute ${card.x} ${card.y} glass rounded-2xl p-3 shadow-soft text-xs border border-white/40 z-20`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1.5 font-semibold ${card.color}`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
                      card.label
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mt-0.5", children: card.sub })
                  ]
                },
                i
              );
            })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 2 },
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Scroll to explore" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { y: [0, 6, 0] },
              transition: { duration: 1.5, repeat: Infinity },
              className: "h-5 w-5 rounded-full border border-border flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground" })
            }
          )
        ]
      }
    )
  ] });
}
function AnimatedStat({
  value,
  label
}) {
  const [displayed, setDisplayed] = reactExports.useState("0");
  const ref = reactExports.useRef(null);
  const [triggered, setTriggered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) setTriggered(true);
    }, {
      threshold: 0.5
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggered]);
  reactExports.useEffect(() => {
    if (!triggered) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(num)) {
      setDisplayed(value);
      return;
    }
    let start = 0;
    const step = num / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= num) {
        setDisplayed(value);
        clearInterval(t);
      } else setDisplayed(Math.floor(start) + suffix);
    }, 16);
    return () => clearInterval(t);
  }, [triggered, value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "glass rounded-2xl p-5 text-center shadow-soft hover:shadow-elegant transition-all group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-gradient tabular-nums group-hover:scale-110 transition-transform", children: displayed }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: label })
  ] });
}
const features = [{
  icon: Search,
  title: "Listing audit",
  desc: "47-factor scoring across title, bullets, images, and A+ content with prioritized fixes.",
  color: "from-pink-500 to-rose-400",
  tab: "audit"
}, {
  icon: Brain,
  title: "Review intelligence",
  desc: "Mine thousands of reviews to surface pain points, hidden wins, and emerging issues.",
  color: "from-violet-500 to-purple-400",
  tab: "audit"
}, {
  icon: Eye,
  title: "Competitor spy",
  desc: "Decode the top 3 rivals — strengths, weaknesses, and the gaps you can exploit.",
  color: "from-sky-500 to-blue-400",
  tab: "competitor"
}, {
  icon: ChartColumn,
  title: "Time machine",
  desc: "Track sentiment over time and catch quality slips before they tank your BSR.",
  color: "from-amber-500 to-orange-400",
  tab: "time-machine"
}, {
  icon: Zap,
  title: "12-second results",
  desc: "Paste a URL, get a full intelligence brief faster than a coffee order.",
  color: "from-emerald-500 to-teal-400",
  tab: "audit"
}, {
  icon: Star,
  title: "Action-first output",
  desc: "Every insight ships with the exact copy or fix to apply — no fluff.",
  color: "from-fuchsia-500 to-pink-400",
  tab: "audit"
}];
const testimonials = [{
  name: "Priya S.",
  role: "Amazon FBA Seller",
  text: "ListIQ found 4 title issues I'd missed for 6 months. Fixed them in one afternoon, BSR jumped 40 spots.",
  rating: 5
}, {
  name: "Marcus T.",
  role: "E-commerce Agency",
  text: "We audit 20+ listings a week now. The Competitor Spy tab alone saved us hours of manual research.",
  rating: 5
}, {
  name: "Anjali R.",
  role: "Beauty Brand Owner",
  text: "Kiti's suggestions are surprisingly specific. It caught that my bullet points were feature-first, not benefit-first.",
  rating: 5
}];
const faqs = [{
  q: "Do I need to create an account?",
  a: "No! You can run your first audit for free without signing up. Just paste a URL and hit Analyze."
}, {
  q: "Which Amazon marketplaces are supported?",
  a: "We support amazon.com, amazon.in, amazon.co.uk, amazon.de, amazon.fr, and more. Currency auto-detects."
}, {
  q: "How accurate is the analysis?",
  a: "Scores are calculated from real product data (title, rating, reviews, features). The AI analysis uses the same criteria Amazon's A9 algorithm prioritizes."
}, {
  q: "What happens if the AI is unavailable?",
  a: "Our local analysis engine kicks in automatically — you always get a result, never a blank page."
}, {
  q: "Can I use it for multiple products?",
  a: "Yes. Pro plan gives 100 audits/month. Max gives unlimited with bulk CSV upload."
}];
function FaqItem({
  q,
  a
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { layout: true, className: "glass rounded-2xl overflow-hidden border border-white/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(!open), className: "w-full flex items-center justify-between p-5 text-left font-semibold text-sm hover:bg-white/10 transition-colors", children: [
      q,
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { animate: {
        rotate: open ? 180 : 0
      }, transition: {
        duration: 0.2
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground shrink-0" }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      height: 0
    }, animate: {
      opacity: 1,
      height: "auto"
    }, exit: {
      opacity: 0,
      height: 0
    }, className: "px-5 pb-5 text-sm text-muted-foreground leading-relaxed", children: a })
  ] });
}
function LandingPage() {
  const {
    scrollYProgress
  } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: {
      scaleX
    }, className: "fixed top-0 left-0 right-0 h-1 bg-primary-gradient origin-left z-[100]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4", children: mockStats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedStat, { value: s.value, label: s.label }, s.label)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "features", className: "px-4 py-24 md:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "text-center max-w-2xl mx-auto mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)] mb-4", children: "Capabilities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground", children: [
          "Everything you need to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "win the buy box" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-muted-foreground", children: "From first impression to long-tail SEO — Kiti analyzes, prioritizes, and writes the fix for you." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-5", children: features.map((f, i) => {
        const Icon = f.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 30
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.08
        }, whileHover: {
          y: -8,
          scale: 1.02,
          transition: {
            duration: 0.2
          }
        }, className: "group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { hover: true, className: "h-full cursor-pointer relative overflow-hidden border border-white/40 hover:border-[var(--primary)]/30 hover:shadow-elegant transition-all duration-300 flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", style: {
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} grid place-items-center shadow-soft group-hover:scale-110 group-hover:shadow-hover transition-all duration-300`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 font-semibold text-lg group-hover:text-[var(--primary)] transition-colors duration-200", children: f.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed flex-1", children: f.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", search: {
            tab: f.tab
          }, className: "mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:gap-2 transition-all duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Explore" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" })
          ] })
        ] }) }, f.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how", className: "px-4 py-24 md:py-32 bg-soft-gradient", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.h2, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-foreground", children: [
        "Three steps. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Zero guesswork." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 grid sm:grid-cols-3 gap-8 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-30" }),
        [{
          n: "01",
          t: "Paste your URL",
          d: "Drop any Amazon product link — no installs, no setup.",
          emoji: "🔗"
        }, {
          n: "02",
          t: "Kiti analyzes",
          d: "We scrape, score, and cross-reference against the top competitors.",
          emoji: "🧠"
        }, {
          n: "03",
          t: "Apply the fixes",
          d: "Get prioritized, copy-paste-ready updates for your listing.",
          emoji: "✅"
        }].map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.15
        }, whileHover: {
          y: -6,
          scale: 1.02,
          transition: {
            duration: 0.2
          }
        }, className: "group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { variant: "strong", className: "h-full text-center relative overflow-hidden border border-white/40 hover:border-[var(--primary)]/30 hover:shadow-elegant transition-all duration-300 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary-gradient opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none rounded-inherit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "text-6xl font-bold text-gradient opacity-90 tabular-nums relative", whileHover: {
            scale: 1.1
          }, transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
          }, children: [
            step.n,
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { className: "absolute inset-0 rounded-full border-2 border-[var(--primary)] opacity-0 group-hover:opacity-30", animate: {
              scale: [1, 1.4, 1.8],
              opacity: [0.3, 0.1, 0]
            }, transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mt-1", children: step.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-semibold text-xl group-hover:text-[var(--primary)] transition-colors duration-200", children: step.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: step.d }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Step ",
            i + 1,
            " of 3"
          ] }) })
        ] }) }, step.n))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "testimonials", className: "px-4 py-24 md:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "text-center max-w-xl mx-auto mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 mb-4", children: "⭐ Reviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-extrabold tracking-tight text-foreground", children: [
          "Sellers love ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "ListIQ" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: testimonials.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 30
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.1
      }, whileHover: {
        y: -4
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(GlassCard, { className: "h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 mb-3", children: [...Array(t.rating)].map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }, j)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/80 leading-relaxed flex-1", children: [
          '"',
          t.text,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: t.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.role })
        ] })
      ] }) }, t.name)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "pricing", className: "px-4 py-24 md:py-32 bg-soft-gradient", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "text-center max-w-2xl mx-auto mb-14", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-2 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-medium text-[var(--primary)] mb-4", children: "Pricing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground", children: [
          "Simple, ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "transparent" }),
          " pricing"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Start free. Scale when you're ready. No surprise charges." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6 items-stretch", children: [{
        name: "Free",
        price: "$0",
        period: "/mo",
        desc: "Perfect for sellers just getting started.",
        highlight: false,
        features: ["5 listing audits / month", "Basic 47-factor score", "Pain point summary", "Kiti AI chat (10 msgs/day)", "1 competitor comparison"],
        cta: "Get started free"
      }, {
        name: "Pro",
        price: "$29",
        period: "/mo",
        desc: "For serious sellers scaling their catalog.",
        highlight: true,
        features: ["100 listing audits / month", "Full 47-factor deep audit", "Time Machine sentiment trends", "3 competitor deep-dive per URL", "Kiti AI chat (unlimited)", "Real customer complaint analysis", "Priority support"],
        cta: "Start Pro free trial"
      }, {
        name: "Max",
        price: "$79",
        period: "/mo",
        desc: "For agencies and high-volume brands.",
        highlight: false,
        features: ["Unlimited listing audits", "Multi-marketplace support", "Bulk URL analysis (CSV upload)", "Full competitor intelligence suite", "White-label PDF reports", "Team seats (up to 5 users)", "API access", "Dedicated account manager"],
        cta: "Contact sales"
      }].map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 30
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.1
      }, className: "relative", children: [
        plan.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-4 inset-x-0 flex justify-center z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary-gradient text-white text-xs font-bold px-4 py-1.5 shadow-soft", children: "✨ Most Popular" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full ${plan.highlight ? "rounded-[1.5rem] bg-primary-gradient p-[2px] shadow-elegant" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full flex flex-col ${plan.highlight ? "rounded-[1.4rem] bg-card p-6" : ""}`, children: !plan.highlight ? /* @__PURE__ */ jsxRuntimeExports.jsx(GlassCard, { className: "h-full flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlanContent, { plan, highlight: false }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PlanContent, { plan, highlight: true }) }) })
      ] }, plan.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
        opacity: 0
      }, whileInView: {
        opacity: 1
      }, viewport: {
        once: true
      }, className: "text-center text-sm text-muted-foreground mt-10", children: "All plans include a 7-day free trial. No credit card required. Cancel anytime." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-24 md:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "text-center mb-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl md:text-5xl font-extrabold tracking-tight text-foreground", children: [
        "Frequently asked ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "questions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: faqs.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 10
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.05
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaqItem, { q: f.q, a: f.a }) }, f.q)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true
    }, className: "relative mx-auto max-w-4xl rounded-[2.5rem] bg-primary-gradient p-12 md:p-16 text-center text-white overflow-hidden shadow-elegant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-mesh opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        scale: [1, 1.1, 1]
      }, transition: {
        duration: 8,
        repeat: Infinity
      }, className: "absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight", children: "Ready to outsell your category?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/90 max-w-xl mx-auto", children: "Your first audit is on us. See exactly what's holding your listing back — and fix it today." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "mt-8 rounded-full bg-white text-[var(--primary)] hover:bg-white/95 shadow-glow hover:scale-105 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", children: [
          "Start free audit ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FooterWithModals, {})
  ] });
}
function PlanContent({
  plan,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xs font-semibold uppercase tracking-widest mb-2 ${highlight ? "text-[var(--primary)]" : "text-muted-foreground"}`, children: plan.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl font-extrabold text-foreground", children: plan.price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground mb-1.5", children: plan.period })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: plan.desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3 flex-1 mb-8", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm text-foreground/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${highlight ? "bg-primary-gradient text-white" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`, children: "✓" }),
      f
    ] }, f)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: `w-full rounded-xl ${highlight ? "bg-primary-gradient text-white hover:opacity-90 shadow-soft" : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)]"}`, variant: highlight ? "default" : "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: plan.cta }) })
  ] });
}
function LegalModal({
  title,
  icon: Icon,
  onClose,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0
  }, animate: {
    opacity: 1
  }, exit: {
    opacity: 0
  }, className: "fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    scale: 0.92,
    y: 20
  }, animate: {
    opacity: 1,
    scale: 1,
    y: 0
  }, exit: {
    opacity: 0,
    scale: 0.92,
    y: 20
  }, transition: {
    type: "spring",
    stiffness: 300,
    damping: 25
  }, className: "bg-card rounded-3xl shadow-elegant border border-border/50 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[var(--primary-soft)] shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-bold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-xl bg-primary-gradient grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-white" }) }),
        title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "h-8 w-8 rounded-xl hover:bg-white/60 grid place-items-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-4 border-t border-border/30 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity", children: "Close" }) })
  ] }) });
}
function FooterWithModals() {
  const [modal, setModal] = reactExports.useState(null);
  const [contactForm, setContactForm] = reactExports.useState({
    name: "",
    email: "",
    message: ""
  });
  const [sent, setSent] = reactExports.useState(false);
  const handleContact = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setModal(null);
      setContactForm({
        name: "",
        email: "",
        message: ""
      });
    }, 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "px-4 py-10 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "© 2026 ListIQ — Built for Amazon sellers who refuse to guess." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6", children: [{
        label: "Privacy",
        id: "privacy"
      }, {
        label: "Terms",
        id: "terms"
      }, {
        label: "Contact",
        id: "contact"
      }].map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setModal(link.id), className: "hover:text-[var(--primary)] hover:underline transition-colors font-medium", children: link.label }, link.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
      modal === "privacy" && /* @__PURE__ */ jsxRuntimeExports.jsx(LegalModal, { title: "Privacy Policy", icon: Shield, onClose: () => setModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 text-sm text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Last updated: May 2026" }),
        [{
          h: "Data We Collect",
          b: "ListIQ collects Amazon product URLs you submit, analysis results, account email, and anonymized usage data. We do not collect or store your Amazon login credentials or payment details directly."
        }, {
          h: "How We Use It",
          b: "Your data powers listing intelligence reports and product improvements. We never sell your personal data to third parties. Analysis results are cached 24 hours for performance."
        }, {
          h: "Your Rights",
          b: "You can request data export or deletion at any time by emailing privacy@listiq.ai. We respond within 30 days. You can also opt out of analytics in Settings."
        }, {
          h: "Cookies",
          b: "We use essential session cookies (cannot be disabled) and optional analytics cookies. Disable analytics cookies in your browser without impacting functionality."
        }, {
          h: "Security",
          b: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We conduct regular security audits and follow OWASP best practices."
        }, {
          h: "Contact",
          b: "Privacy questions? Email privacy@listiq.ai or write to: ListIQ Inc., 123 Commerce St, San Francisco CA 94105."
        }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-base mb-1", children: s.h }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: s.b })
        ] }, s.h))
      ] }) }),
      modal === "terms" && /* @__PURE__ */ jsxRuntimeExports.jsx(LegalModal, { title: "Terms of Service", icon: FileText, onClose: () => setModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 text-sm text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Effective: May 2026 · Applies to all ListIQ users" }),
        [{
          h: "Acceptance",
          b: "By using ListIQ you agree to these Terms. If you disagree, please discontinue use. We may update these terms and will notify you by email."
        }, {
          h: "Permitted Use",
          b: "ListIQ is for lawful Amazon listing analysis only. You may not use it to scrape at scale, reverse-engineer our systems, or violate Amazon's terms of service."
        }, {
          h: "Intellectual Property",
          b: "All ListIQ software, designs, and content are owned by ListIQ Inc. Analysis reports generated for your listings belong to you."
        }, {
          h: "Free & Paid Plans",
          b: "Free plans include 5 audits/month. Paid plans auto-renew monthly. Cancellations take effect at period end. No refunds for partial months."
        }, {
          h: "Limitation of Liability",
          b: "ListIQ provides analysis for informational purposes. We are not responsible for business decisions made based on our reports. Liability is capped at fees paid in the last 3 months."
        }, {
          h: "Termination",
          b: "We may suspend accounts that violate these terms. You may cancel anytime from your account settings."
        }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-base mb-1", children: s.h }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: s.b })
        ] }, s.h))
      ] }) }),
      modal === "contact" && /* @__PURE__ */ jsxRuntimeExports.jsx(LegalModal, { title: "Contact Us", icon: MessageSquare, onClose: () => setModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: sent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.9
      }, animate: {
        opacity: 1,
        scale: 1
      }, className: "flex flex-col items-center py-8 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-2xl bg-emerald-100 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: "✅" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-lg text-foreground", children: "Message sent!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground text-center", children: "We'll get back to you within 24 hours." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mb-6", children: [{
          icon: Mail,
          label: "Email",
          val: "hello@listiq.ai"
        }, {
          icon: MessageSquare,
          label: "Response",
          val: "Within 24h"
        }].map((c) => {
          const Icon = c.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-[var(--primary)] shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: c.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold", children: c.val })
            ] })
          ] }, c.label);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleContact, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: contactForm.name, onChange: (e) => setContactForm((p) => ({
              ...p,
              name: e.target.value
            })), placeholder: "Your name", className: "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", value: contactForm.email, onChange: (e) => setContactForm((p) => ({
              ...p,
              email: e.target.value
            })), placeholder: "you@example.com", className: "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 4, value: contactForm.message, onChange: (e) => setContactForm((p) => ({
              ...p,
              message: e.target.value
            })), placeholder: "How can we help?", className: "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all resize-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full py-2.5 rounded-xl bg-primary-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-soft", children: "Send Message →" })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  LandingPage as component
};
