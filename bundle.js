// node_modules/internmap/src/index.js
var InternMap = class extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: key } });
    if (entries != null) for (const [key2, value] of entries) this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
};
function intern_get({ _intern, _key }, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) return _intern.get(key);
  _intern.set(key, value);
  return value;
}
function intern_delete({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}
function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}

// node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type2, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
    for (t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type2, that, args) {
    if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
    for (var t = this._[type2], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};
function get(type2, name) {
  for (var i = 0, n = type2.length, c2; i < n; ++i) {
    if ((c2 = type2[i]).name === name) {
      return c2.value;
    }
  }
}
function set(type2, name, callback) {
  for (var i = 0, n = type2.length; i < n; ++i) {
    if (type2[i].name === name) {
      type2[i] = noop, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
      break;
    }
  }
  if (callback != null) type2.push({ name, value: callback });
  return type2;
}
var dispatch_default = dispatch;

// node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

// node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/array.js
function array(x4) {
  return x4 == null ? [] : Array.isArray(x4) ? x4 : Array.from(x4);
}

// node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

// node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/d3-selection/src/matcher.js
function matcher_default(selector) {
  return function() {
    return this.matches(selector);
  };
}
function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

// node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

// node_modules/d3-selection/src/constant.js
function constant_default(x4) {
  return function() {
    return x4;
  };
}

// node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length) return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function") value = constant_default(value);
  for (var m2 = groups.length, update = new Array(m2), enter = new Array(m2), exit = new Array(m2), j = 0; j < m2; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove();
  else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m2 = groups.length; ++j < m2; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare) compare = ascending;
  function compareNode(a2, b) {
    return a2 && b ? compare(a2.__data__, b.__data__) : !a2 - !b;
  }
  for (var groups = this._groups, m2 = groups.length, sortgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a2, b) {
  return a2 < b ? -1 : a2 > b ? 1 : a2 >= b ? 0 : NaN;
}

// node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
}

// node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this) ++size;
  return size;
}

// node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m2 = on.length, o; j < m2; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m2 = on.length; j < m2; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on) this.__on = [o];
    else on.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m2 = on.length, o; j < m2; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type2, params) {
  var window2 = window_default(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type2, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params) event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type2, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params);
  };
}
function dispatchFunction(type2, params) {
  return function() {
    return dispatchEvent(this, type2, params.apply(this, arguments));
  };
}
function dispatch_default2(type2, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
}

// node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

// node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/d3-selection/src/select.js
function select_default2(selector) {
  return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
}

// node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

// node_modules/d3-selection/src/pointer.js
function pointer_default(event, node) {
  event = sourceEvent_default(event);
  if (node === void 0) node = event.currentTarget;
  if (node) {
    var svg2 = node.ownerSVGElement || node;
    if (svg2.createSVGPoint) {
      var point = svg2.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// node_modules/d3-drag/src/noevent.js
var nonpassive = { passive: false };
var nonpassivecapture = { capture: true, passive: false };
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent_default(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent_default, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}

// node_modules/d3-drag/src/constant.js
var constant_default2 = (x4) => () => x4;

// node_modules/d3-drag/src/event.js
function DragEvent(type2, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x: x4,
  y: y4,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type2, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x4, enumerable: true, configurable: true },
    y: { value: y4, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// node_modules/d3-drag/src/drag.js
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag_default() {
  var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = dispatch_default("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter2.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select_default2(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    nodrag_default(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent_default(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select_default2(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent_default(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter2.call(this, event, d)) return;
    var touches = event.changedTouches, c2 = container.call(this, event, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c2, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent_default(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners.copy(), p = pointer_default(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null) return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type2, event2, touch2) {
      var p0 = p, n;
      switch (type2) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        // falls through
        case "drag":
          p = pointer_default(touch2 || event2, container2), n = active;
          break;
      }
      dispatch2.call(
        type2,
        that,
        new DragEvent(type2, {
          sourceEvent: event2,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default2(!!_), drag) : filter2;
  };
  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant_default2(_), drag) : container;
  };
  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant_default2(_), drag) : subject;
  };
  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default2(!!_), drag) : touchable;
  };
  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };
  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };
  return drag;
}

// node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

// node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m2, l;
  format = (format + "").trim().toLowerCase();
  return (m2 = reHex.exec(format)) ? (l = m2[1].length, m2 = parseInt(m2[1], 16), l === 6 ? rgbn(m2) : l === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a2) {
  if (a2 <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a2);
}
function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a2 = clampa(this.opacity);
  return `${a2 === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a2 === 1 ? ")" : `, ${a2})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a2) {
  if (a2 <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a2);
}
function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
  if (s) {
    if (r === max2) h = (g - b) / s + (g < b) * 6;
    else if (g === max2) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a2 = clampa(this.opacity);
    return `${a2 === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a2 === 1 ? ")" : `, ${a2})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/d3-interpolate/src/basis.js
function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/d3-interpolate/src/constant.js
var constant_default3 = (x4) => () => x4;

// node_modules/d3-interpolate/src/color.js
function linear(a2, d) {
  return function(t) {
    return a2 + t * d;
  };
}
function exponential(a2, b, y4) {
  return a2 = Math.pow(a2, y4), b = Math.pow(b, y4) - a2, y4 = 1 / y4, function(t) {
    return Math.pow(a2 + t * b, y4);
  };
}
function gamma(y4) {
  return (y4 = +y4) === 1 ? nogamma : function(a2, b) {
    return b - a2 ? exponential(a2, b, y4) : constant_default3(isNaN(a2) ? b : a2);
  };
}
function nogamma(a2, b) {
  var d = b - a2;
  return d ? linear(a2, d) : constant_default3(isNaN(a2) ? b : a2);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = (function rgbGamma(y4) {
  var color3 = gamma(y4);
  function rgb2(start2, end) {
    var r = color3((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color3(start2.g, end.g), b = color3(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
})(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color3;
    for (i = 0; i < n; ++i) {
      color3 = rgb(colors[i]);
      r[i] = color3.r || 0;
      g[i] = color3.g || 0;
      b[i] = color3.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color3.opacity = 1;
    return function(t) {
      color3.r = r(t);
      color3.g = g(t);
      color3.b = b(t);
      return color3 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/d3-interpolate/src/number.js
function number_default(a2, b) {
  return a2 = +a2, b = +b, function(t) {
    return a2 * (1 - t) + b * t;
  };
}

// node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a2, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a2 = a2 + "", b = b + "";
  while ((am = reA.exec(a2)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm;
      else s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs;
    else s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2) s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/d3-interpolate/src/transform/decompose.js
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a2, b, c2, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a2 * a2 + b * b)) a2 /= scaleX, b /= scaleX;
  if (skewX = a2 * c2 + b * d) c2 -= a2 * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c2 * c2 + d * d)) c2 /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a2 * d < b * c2) a2 = -a2, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a2) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}

// node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  const m2 = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m2.isIdentity ? identity : decompose_default(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
}
function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

// node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a2, b, s, q) {
    if (a2 !== b) {
      if (a2 - b > 180) b += 360;
      else if (b - a2 > 180) a2 += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a2, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a2, b, s, q) {
    if (a2 !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a2, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a2, b) {
    var s = [], q = [];
    a2 = parse(a2), b = parse(b);
    translate(a2.translateX, a2.translateY, b.translateX, b.translateY, s, q);
    rotate(a2.rotate, b.rotate, s, q);
    skewX(a2.skewX, b.skewX, s, q);
    scale(a2.scaleX, a2.scaleY, b.scaleX, b.scaleY, s, q);
    a2 = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x4) {
  return ((x4 = Math.exp(x4)) + 1 / x4) / 2;
}
function sinh(x4) {
  return ((x4 = Math.exp(x4)) - 1 / x4) / 2;
}
function tanh(x4) {
  return ((x4 = Math.exp(2 * x4)) - 1) / (x4 + 1);
}
var zoom_default = (function zoomRho(rho, rho2, rho4) {
  function zoom2(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom2.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom2;
})(Math.SQRT2, 2, 4);

// node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

// node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id2, index2, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id2 in schedules) return;
  create(node, id2, {
    name,
    index: index2,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}
function get2(node, id2) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
  return schedule;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed) start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED) return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;
      if (o.state === STARTED) return timeout_default(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules) return;
    delete node.__transition;
  }
}

// node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty2 = true, i;
  if (!schedules) return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }
  if (empty2) delete node.__transition;
}

// node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition2, name, value) {
  var id2 = transition2._id;
  transition2.each(function() {
    var schedule = set2(this, id2);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get2(node, id2).value[name];
  };
}

// node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a2, b) {
  var c2;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c2 = color(b)) ? (b = c2, rgb_default) : string_default)(a2, b);
}

// node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween_default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/d3-transition/src/transition/delay.js
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function delay_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
}

// node_modules/d3-transition/src/transition/duration.js
function durationFunction(id2, value) {
  return function() {
    set2(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set2(this, id2).duration = value;
  };
}
function duration_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
}

// node_modules/d3-transition/src/transition/ease.js
function easeConstant(id2, value) {
  if (typeof value !== "function") throw new Error();
  return function() {
    set2(this, id2).ease = value;
  };
}
function ease_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
}

// node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id2, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error();
    set2(this, id2).ease = v;
  };
}
function easeVarying_default(value) {
  if (typeof value !== "function") throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  if (typeof match !== "function") match = matcher_default(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition2) {
  if (transition2._id !== this._id) throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule = sit(this, id2), on = schedule.on;
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}

// node_modules/d3-transition/src/transition/remove.js
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id2) return;
    if (parent) parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selector_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}

// node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default2(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function") select = selectorAll_default(select);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child = children2[k]) {
            schedule_default(child, name, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}

// node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function styleTween_default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

// node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function text_default2(value) {
  return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function textTween_default(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}

// node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get2(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0) resolve();
    } };
    that.each(function() {
      var schedule = set2(this, id2), on = schedule.on;
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule.on = on1;
    });
    if (size === 0) resolve();
  });
}

// node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function transition(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default2,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}

// node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/d3-brush/src/brush.js
var { abs, max, min } = Math;
function number1(e) {
  return [+e[0], +e[1]];
}
function number2(e) {
  return [number1(e[0]), number1(e[1])];
}
var X = {
  name: "x",
  handles: ["w", "e"].map(type),
  input: function(x4, e) {
    return x4 == null ? null : [[+x4[0], e[0][1]], [+x4[1], e[1][1]]];
  },
  output: function(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y4, e) {
    return y4 == null ? null : [[e[0][0], +y4[0]], [e[1][0], +y4[1]]];
  },
  output: function(xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function(xy) {
    return xy == null ? null : number2(xy);
  },
  output: function(xy) {
    return xy;
  }
};
function type(t) {
  return { type: t };
}

// node_modules/d3-path/src/path.js
var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;
function append(strings) {
  this._ += strings[0];
  for (let i = 1, n = strings.length; i < n; ++i) {
    this._ += arguments[i] + strings[i];
  }
}
function appendRound(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
  if (d > 15) return append;
  const k = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length; i < n; ++i) {
      this._ += Math.round(arguments[i] * k) / k + strings[i];
    }
  };
}
var Path = class {
  constructor(digits) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null;
    this._ = "";
    this._append = digits == null ? append : appendRound(digits);
  }
  moveTo(x4, y4) {
    this._append`M${this._x0 = this._x1 = +x4},${this._y0 = this._y1 = +y4}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x4, y4) {
    this._append`L${this._x1 = +x4},${this._y1 = +y4}`;
  }
  quadraticCurveTo(x1, y1, x4, y4) {
    this._append`Q${+x1},${+y1},${this._x1 = +x4},${this._y1 = +y4}`;
  }
  bezierCurveTo(x1, y1, x22, y22, x4, y4) {
    this._append`C${+x1},${+y1},${+x22},${+y22},${this._x1 = +x4},${this._y1 = +y4}`;
  }
  arcTo(x1, y1, x22, y22, r) {
    x1 = +x1, y1 = +y1, x22 = +x22, y22 = +y22, r = +r;
    if (r < 0) throw new Error(`negative radius: ${r}`);
    let x0 = this._x1, y0 = this._y1, x21 = x22 - x1, y21 = y22 - y1, x01 = x0 - x1, y01 = y0 - y1, l01_2 = x01 * x01 + y01 * y01;
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    } else if (!(l01_2 > epsilon)) ;
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    } else {
      let x20 = x22 - x0, y20 = y22 - y0, l21_2 = x21 * x21 + y21 * y21, l20_2 = x20 * x20 + y20 * y20, l21 = Math.sqrt(l21_2), l01 = Math.sqrt(l01_2), l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2), t01 = l / l01, t21 = l / l21;
      if (Math.abs(t01 - 1) > epsilon) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }
      this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x4, y4, r, a0, a1, ccw) {
    x4 = +x4, y4 = +y4, r = +r, ccw = !!ccw;
    if (r < 0) throw new Error(`negative radius: ${r}`);
    let dx = r * Math.cos(a0), dy = r * Math.sin(a0), x0 = x4 + dx, y0 = y4 + dy, cw = 1 ^ ccw, da = ccw ? a0 - a1 : a1 - a0;
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    } else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._append`L${x0},${y0}`;
    }
    if (!r) return;
    if (da < 0) da = da % tau + tau;
    if (da > tauEpsilon) {
      this._append`A${r},${r},0,1,${cw},${x4 - dx},${y4 - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    } else if (da > epsilon) {
      this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x4 + r * Math.cos(a1)},${this._y1 = y4 + r * Math.sin(a1)}`;
    }
  }
  rect(x4, y4, w, h) {
    this._append`M${this._x0 = this._x1 = +x4},${this._y0 = this._y1 = +y4}h${w = +w}v${+h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
};
function path() {
  return new Path();
}
path.prototype = Path.prototype;

// node_modules/d3-quadtree/src/add.js
function add_default(d) {
  const x4 = +this._x.call(null, d), y4 = +this._y.call(null, d);
  return add(this.cover(x4, y4), x4, y4, d);
}
function add(tree, x4, y4, d) {
  if (isNaN(x4) || isNaN(y4)) return tree;
  var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node) return tree._root = leaf, tree;
  while (node.length) {
    if (right = x4 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y4 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x4 === xp && y4 === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x4 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y4 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
  var d, i, n = data.length, x4, y4, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x4 = +this._x.call(null, d = data[i])) || isNaN(y4 = +this._y.call(null, d))) continue;
    xz[i] = x4;
    yz[i] = y4;
    if (x4 < x0) x0 = x4;
    if (x4 > x1) x1 = x4;
    if (y4 < y0) y0 = y4;
    if (y4 > y1) y1 = y4;
  }
  if (x0 > x1 || y0 > y1) return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }
  return this;
}

// node_modules/d3-quadtree/src/cover.js
function cover_default(x4, y4) {
  if (isNaN(x4 = +x4) || isNaN(y4 = +y4)) return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x4)) + 1;
    y1 = (y0 = Math.floor(y4)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x4 || x4 >= x1 || y0 > y4 || y4 >= y1) {
      i = (y4 < y0) << 1 | x4 < x0;
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0:
          x1 = x0 + z, y1 = y0 + z;
          break;
        case 1:
          x0 = x1 - z, y1 = y0 + z;
          break;
        case 2:
          x1 = x0 + z, y0 = y1 - z;
          break;
        case 3:
          x0 = x1 - z, y0 = y1 - z;
          break;
      }
    }
    if (this._root && this._root.length) this._root = node;
  }
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

// node_modules/d3-quadtree/src/data.js
function data_default2() {
  var data = [];
  this.visit(function(node) {
    if (!node.length) do
      data.push(node.data);
    while (node = node.next);
  });
  return data;
}

// node_modules/d3-quadtree/src/extent.js
function extent_default(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}

// node_modules/d3-quadtree/src/quad.js
function quad_default(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

// node_modules/d3-quadtree/src/find.js
function find_default(x4, y4, radius) {
  var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x32 = this._x1, y32 = this._y1, quads = [], node = this._root, q, i;
  if (node) quads.push(new quad_default(node, x0, y0, x32, y32));
  if (radius == null) radius = Infinity;
  else {
    x0 = x4 - radius, y0 = y4 - radius;
    x32 = x4 + radius, y32 = y4 + radius;
    radius *= radius;
  }
  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x32 || (y1 = q.y0) > y32 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0) continue;
    if (node.length) {
      var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
      quads.push(
        new quad_default(node[3], xm, ym, x22, y22),
        new quad_default(node[2], x1, ym, xm, y22),
        new quad_default(node[1], xm, y1, x22, ym),
        new quad_default(node[0], x1, y1, xm, ym)
      );
      if (i = (y4 >= ym) << 1 | x4 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x4 - +this._x.call(null, node.data), dy = y4 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x4 - d, y0 = y4 - d;
        x32 = x4 + d, y32 = y4 + d;
        data = node.data;
      }
    }
  }
  return data;
}

// node_modules/d3-quadtree/src/remove.js
function remove_default3(d) {
  if (isNaN(x4 = +this._x.call(null, d)) || isNaN(y4 = +this._y.call(null, d))) return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x4, y4, xm, ym, right, bottom, i, j;
  if (!node) return this;
  if (node.length) while (true) {
    if (right = x4 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y4 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
  }
  while (node.data !== d) if (!(previous = node, node = node.next)) return this;
  if (next = node.next) delete node.next;
  if (previous) return next ? previous.next = next : delete previous.next, this;
  if (!parent) return this._root = next, this;
  next ? parent[i] = next : delete parent[i];
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer) retainer[j] = node;
    else this._root = node;
  }
  return this;
}
function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
  return this;
}

// node_modules/d3-quadtree/src/root.js
function root_default() {
  return this._root;
}

// node_modules/d3-quadtree/src/size.js
function size_default2() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length) do
      ++size;
    while (node = node.next);
  });
  return size;
}

// node_modules/d3-quadtree/src/visit.js
function visit_default(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node) quads.push(new quad_default(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
    }
  }
  return this;
}

// node_modules/d3-quadtree/src/visitAfter.js
function visitAfter_default(callback) {
  var quads = [], next = [], q;
  if (this._root) quads.push(new quad_default(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new quad_default(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new quad_default(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new quad_default(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new quad_default(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}

// node_modules/d3-quadtree/src/x.js
function defaultX(d) {
  return d[0];
}
function x_default(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

// node_modules/d3-quadtree/src/y.js
function defaultY(d) {
  return d[1];
}
function y_default(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

// node_modules/d3-quadtree/src/quadtree.js
function quadtree(nodes, x4, y4) {
  var tree = new Quadtree(x4 == null ? defaultX : x4, y4 == null ? defaultY : y4, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x4, y4, x0, y0, x1, y1) {
  this._x = x4;
  this._y = y4;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = void 0;
}
function leaf_copy(leaf) {
  var copy = { data: leaf.data }, next = copy;
  while (leaf = leaf.next) next = next.next = { data: leaf.data };
  return copy;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
  if (!node) return copy;
  if (!node.length) return copy._root = leaf_copy(node), copy;
  nodes = [{ source: node, target: copy._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({ source: child, target: node.target[i] = new Array(4) });
        else node.target[i] = leaf_copy(child);
      }
    }
  }
  return copy;
};
treeProto.add = add_default;
treeProto.addAll = addAll;
treeProto.cover = cover_default;
treeProto.data = data_default2;
treeProto.extent = extent_default;
treeProto.find = find_default;
treeProto.remove = remove_default3;
treeProto.removeAll = removeAll;
treeProto.root = root_default;
treeProto.size = size_default2;
treeProto.visit = visit_default;
treeProto.visitAfter = visitAfter_default;
treeProto.x = x_default;
treeProto.y = y_default;

// node_modules/d3-force/src/constant.js
function constant_default5(x4) {
  return function() {
    return x4;
  };
}

// node_modules/d3-force/src/jiggle.js
function jiggle_default(random) {
  return (random() - 0.5) * 1e-6;
}

// node_modules/d3-force/src/collide.js
function x(d) {
  return d.x + d.vx;
}
function y(d) {
  return d.y + d.vy;
}
function collide_default(radius) {
  var nodes, radii, random, strength = 1, iterations = 1;
  if (typeof radius !== "function") radius = constant_default5(radius == null ? 1 : +radius);
  function force() {
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }
    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;
      if (data) {
        if (data.index > node.index) {
          var x4 = xi - data.x - data.vx, y4 = yi - data.y - data.vy, l = x4 * x4 + y4 * y4;
          if (l < r * r) {
            if (x4 === 0) x4 = jiggle_default(random), l += x4 * x4;
            if (y4 === 0) y4 = jiggle_default(random), l += y4 * y4;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x4 *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y4 *= l) * r;
            data.vx -= x4 * (r = 1 - r);
            data.vy -= y4 * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }
  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : radius;
  };
  return force;
}

// node_modules/d3-force/src/link.js
function index(d) {
  return d.index;
}
function find2(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("node not found: " + nodeId);
  return node;
}
function link_default(links) {
  var id2 = index, strength = defaultStrength, strengths, distance = constant_default5(30), distances, nodes, count, bias, random, iterations = 1;
  if (links == null) links = [];
  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }
  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x4, y4, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x4 = target.x + target.vx - source.x - source.vx || jiggle_default(random);
        y4 = target.y + target.vy - source.y - source.vy || jiggle_default(random);
        l = Math.sqrt(x4 * x4 + y4 * y4);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x4 *= l, y4 *= l;
        target.vx -= x4 * (b = bias[i]);
        target.vy -= y4 * b;
        source.vx += x4 * (b = 1 - b);
        source.vy += y4 * b;
      }
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, m2 = links.length, nodeById = new Map(nodes.map((d, i2) => [id2(d, i2, nodes), d])), link;
    for (i = 0, count = new Array(n); i < m2; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object") link.source = find2(nodeById, link.source);
      if (typeof link.target !== "object") link.target = find2(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }
    for (i = 0, bias = new Array(m2); i < m2; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }
    strengths = new Array(m2), initializeStrength();
    distances = new Array(m2), initializeDistance();
  }
  function initializeStrength() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }
  function initializeDistance() {
    if (!nodes) return;
    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };
  force.id = function(_) {
    return arguments.length ? (id2 = _, force) : id2;
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initializeStrength(), force) : strength;
  };
  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant_default5(+_), initializeDistance(), force) : distance;
  };
  return force;
}

// node_modules/d3-force/src/lcg.js
var a = 1664525;
var c = 1013904223;
var m = 4294967296;
function lcg_default() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}

// node_modules/d3-force/src/simulation.js
function x2(d) {
  return d.x;
}
function y2(d) {
  return d.y;
}
var initialRadius = 10;
var initialAngle = Math.PI * (3 - Math.sqrt(5));
function simulation_default(nodes) {
  var simulation, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = /* @__PURE__ */ new Map(), stepper = timer(step), event = dispatch_default("tick", "end"), random = lcg_default();
  if (nodes == null) nodes = [];
  function step() {
    tick();
    event.call("tick", simulation);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }
  function tick(iterations) {
    var i, n = nodes.length, node;
    if (iterations === void 0) iterations = 1;
    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach(function(force) {
        force(alpha);
      });
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;
        else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;
        else node.y = node.fy, node.vy = 0;
      }
    }
    return simulation;
  }
  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }
  function initializeForce(force) {
    if (force.initialize) force.initialize(nodes, random);
    return force;
  }
  initializeNodes();
  return simulation = {
    tick,
    restart: function() {
      return stepper.restart(step), simulation;
    },
    stop: function() {
      return stepper.stop(), simulation;
    },
    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
    },
    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },
    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },
    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },
    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
    },
    find: function(x4, y4, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null) radius = Infinity;
      else radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x4 - node.x;
        dy = y4 - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius) closest = node, radius = d2;
      }
      return closest;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

// node_modules/d3-force/src/manyBody.js
function manyBody_default() {
  var nodes, node, random, alpha, strength = constant_default5(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x2, y2).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node2;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
  }
  function accumulate(quad) {
    var strength2 = 0, q, c2, weight = 0, x4, y4, i;
    if (quad.length) {
      for (x4 = y4 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x4 += c2 * q.x, y4 += c2 * q.y;
        }
      }
      quad.x = x4 / weight;
      quad.y = y4 / weight;
    } else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do
        strength2 += strengths[q.data.index];
      while (q = q.next);
    }
    quad.value = strength2;
  }
  function apply(quad, x1, _, x22) {
    if (!quad.value) return true;
    var x4 = quad.x - node.x, y4 = quad.y - node.y, w = x22 - x1, l = x4 * x4 + y4 * y4;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x4 === 0) x4 = jiggle_default(random), l += x4 * x4;
        if (y4 === 0) y4 = jiggle_default(random), l += y4 * y4;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x4 * quad.value * alpha / l;
        node.vy += y4 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2) return;
    if (quad.data !== node || quad.next) {
      if (x4 === 0) x4 = jiggle_default(random), l += x4 * x4;
      if (y4 === 0) y4 = jiggle_default(random), l += y4 * y4;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x4 * w;
        node.vy += y4 * w;
      }
    while (quad = quad.next);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : strength;
  };
  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };
  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };
  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };
  return force;
}

// node_modules/d3-force/src/x.js
function x_default2(x4) {
  var strength = constant_default5(0.1), nodes, strengths, xz;
  if (typeof x4 !== "function") x4 = constant_default5(x4 == null ? 0 : +x4);
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(xz[i] = +x4(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }
  force.initialize = function(_) {
    nodes = _;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : strength;
  };
  force.x = function(_) {
    return arguments.length ? (x4 = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : x4;
  };
  return force;
}

// node_modules/d3-force/src/y.js
function y_default2(y4) {
  var strength = constant_default5(0.1), nodes, strengths, yz;
  if (typeof y4 !== "function") y4 = constant_default5(y4 == null ? 0 : +y4);
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    }
  }
  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    yz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(yz[i] = +y4(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }
  force.initialize = function(_) {
    nodes = _;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : strength;
  };
  force.y = function(_) {
    return arguments.length ? (y4 = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : y4;
  };
  return force;
}

// node_modules/d3-scale/src/init.js
function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}

// node_modules/d3-scale/src/ordinal.js
var implicit = Symbol("implicit");
function ordinal() {
  var index2 = new InternMap(), domain = [], range = [], unknown = implicit;
  function scale(d) {
    let i = index2.get(d);
    if (i === void 0) {
      if (unknown !== implicit) return unknown;
      index2.set(d, i = domain.push(d) - 1);
    }
    return range[i % range.length];
  }
  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [], index2 = new InternMap();
    for (const value of _) {
      if (index2.has(value)) continue;
      index2.set(value, domain.push(value) - 1);
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}

// node_modules/d3-scale-chromatic/src/colors.js
function colors_default(specifier) {
  var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
  return colors;
}

// node_modules/d3-scale-chromatic/src/categorical/Tableau10.js
var Tableau10_default = colors_default("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

// node_modules/d3-shape/src/constant.js
function constant_default6(x4) {
  return function constant() {
    return x4;
  };
}

// node_modules/d3-shape/src/path.js
function withPath(shape) {
  let digits = 3;
  shape.digits = function(_) {
    if (!arguments.length) return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };
  return () => new Path(digits);
}

// node_modules/d3-shape/src/array.js
var slice = Array.prototype.slice;
function array_default(x4) {
  return typeof x4 === "object" && "length" in x4 ? x4 : Array.from(x4);
}

// node_modules/d3-shape/src/curve/linear.js
function Linear(context) {
  this._context = context;
}
Linear.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x4, y4) {
    x4 = +x4, y4 = +y4;
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x4, y4) : this._context.moveTo(x4, y4);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(x4, y4);
        break;
    }
  }
};
function linear_default(context) {
  return new Linear(context);
}

// node_modules/d3-shape/src/point.js
function x3(p) {
  return p[0];
}
function y3(p) {
  return p[1];
}

// node_modules/d3-shape/src/line.js
function line_default(x4, y4) {
  var defined = constant_default6(true), context = null, curve = linear_default, output = null, path2 = withPath(line2);
  x4 = typeof x4 === "function" ? x4 : x4 === void 0 ? x3 : constant_default6(x4);
  y4 = typeof y4 === "function" ? y4 : y4 === void 0 ? y3 : constant_default6(y4);
  function line2(data) {
    var i, n = (data = array_default(data)).length, d, defined0 = false, buffer;
    if (context == null) output = curve(buffer = path2());
    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();
        else output.lineEnd();
      }
      if (defined0) output.point(+x4(d, i, data), +y4(d, i, data));
    }
    if (buffer) return output = null, buffer + "" || null;
  }
  line2.x = function(_) {
    return arguments.length ? (x4 = typeof _ === "function" ? _ : constant_default6(+_), line2) : x4;
  };
  line2.y = function(_) {
    return arguments.length ? (y4 = typeof _ === "function" ? _ : constant_default6(+_), line2) : y4;
  };
  line2.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant_default6(!!_), line2) : defined;
  };
  line2.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line2) : curve;
  };
  line2.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line2) : context;
  };
  return line2;
}

// node_modules/d3-zoom/src/constant.js
var constant_default7 = (x4) => () => x4;

// node_modules/d3-zoom/src/event.js
function ZoomEvent(type2, {
  sourceEvent,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type2, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}

// node_modules/d3-zoom/src/transform.js
function Transform(k, x4, y4) {
  this.k = k;
  this.x = x4;
  this.y = y4;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x4, y4) {
    return x4 === 0 & y4 === 0 ? this : new Transform(this.k, this.x + this.k * x4, this.y + this.k * y4);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x4) {
    return x4 * this.k + this.x;
  },
  applyY: function(y4) {
    return y4 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x4) {
    return (x4 - this.x) / this.k;
  },
  invertY: function(y4) {
    return (y4 - this.y) / this.k;
  },
  rescaleX: function(x4) {
    return x4.copy().domain(x4.range().map(this.invertX, this).map(x4.invert, x4));
  },
  rescaleY: function(y4) {
    return y4.copy().domain(y4.range().map(this.invertY, this).map(y4.invert, y4));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity2;
  return node.__zoom;
}

// node_modules/d3-zoom/src/noevent.js
function nopropagation3(event) {
  event.stopImmediatePropagation();
}
function noevent_default3(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/d3-zoom/src/zoom.js
function defaultFilter2(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom_default2() {
  var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom2(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom2.transform = function(collection, transform2, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule(collection, transform2, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom2.scaleBy = function(selection2, k, p, event) {
    zoom2.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };
  zoom2.scaleTo = function(selection2, k, p, event) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };
  zoom2.translateBy = function(selection2, x4, y4, event) {
    zoom2.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x4 === "function" ? x4.apply(this, arguments) : x4,
        typeof y4 === "function" ? y4.apply(this, arguments) : y4
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom2.translateTo = function(selection2, x4, y4, p, event) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x4 === "function" ? -x4.apply(this, arguments) : -x4,
        typeof y4 === "function" ? -y4.apply(this, arguments) : -y4
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x4 = p0[0] - p1[0] * transform2.k, y4 = p0[1] - p1[1] * transform2.k;
    return x4 === transform2.x && y4 === transform2.y ? transform2 : new Transform(transform2.k, x4, y4);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition2, transform2, point, event) {
    transition2.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a2 = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a2.invert(p).concat(w / a2.k), b.invert(p).concat(w / b.k));
      return function(t) {
        if (t === 1) t = b;
        else {
          var l = i(t), k = w / l[2];
          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform2) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type2) {
      var d = select_default2(this.that).datum();
      listeners.call(
        type2,
        this.that,
        new ZoomEvent(type2, {
          sourceEvent: this.sourceEvent,
          target: zoom2,
          type: type2,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k) return;
    else {
      g.mouse = [p, t.invert(p)];
      interrupt_default(this);
      g.start();
    }
    noevent_default3(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments)) return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    nodrag_default(event.view);
    nopropagation3(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt_default(this);
    g.start();
    function mousemoved(event2) {
      noevent_default3(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent_default3(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var t0 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent_default3(event);
    if (duration > 0) select_default2(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select_default2(this).call(zoom2.transform, t1, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
    nopropagation3(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt_default(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
    noevent_default3(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
    nopropagation3(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer_default(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select_default2(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }
  zoom2.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default7(+_), zoom2) : wheelDelta;
  };
  zoom2.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default7(!!_), zoom2) : filter2;
  };
  zoom2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default7(!!_), zoom2) : touchable;
  };
  zoom2.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default7([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom2) : extent;
  };
  zoom2.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom2) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom2.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom2) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom2.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom2) : constrain;
  };
  zoom2.duration = function(_) {
    return arguments.length ? (duration = +_, zoom2) : duration;
  };
  zoom2.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom2) : interpolate;
  };
  zoom2.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom2 : value;
  };
  zoom2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom2) : Math.sqrt(clickDistance2);
  };
  zoom2.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom2) : tapDistance;
  };
  return zoom2;
}

// client.js
var deps = await fetch("./deps.json").then((r) => r.json());
var svg = select_default2("#viz");
var gMain = svg.append("g");
var gLinks = gMain.append("g");
var gNodes = gMain.append("g");
var gLabels = gMain.append("g");
var info = document.querySelector("#info");
var edgeTypeSel = document.querySelector("#edgeType");
var filterInput = document.querySelector("#filter");
var labelsToggle = document.querySelector("#labels");
var color2 = ordinal().domain(["module", "program", "subroutine", "function", "interface", "generic", "type", "unknown"]).range(Tableau10_default);
function nodeKey(d) {
  return d.id;
}
function getNeighborsMap(links) {
  const nb = /* @__PURE__ */ new Map();
  for (const l of links) {
    (nb.get(l.source.id) || nb.set(l.source.id, /* @__PURE__ */ new Set()).get(l.source.id)).add(l.target.id);
    (nb.get(l.target.id) || nb.set(l.target.id, /* @__PURE__ */ new Set()).get(l.target.id)).add(l.source.id);
  }
  return nb;
}
function filterNodes(nodes, q) {
  if (!q) return nodes;
  const t = q.toLowerCase();
  return nodes.filter(
    (n) => n.id.includes(t) || (n.name || "").includes(t) || (n.scope || "").includes(t) || (n.kind || "").includes(t)
  );
}
function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map((n) => [n.id, { ...n }]));
  const rawEdges = deps.links.filter((l) => l.type === edgeType);
  const pairs = Array.from(new Set(
    rawEdges.map((l) => {
      const s = typeof l.source === "string" ? l.source : l.source?.id;
      const t = typeof l.target === "string" ? l.target : l.target?.id;
      return `${s}	${t}`;
    })
  )).map((s) => {
    const [sId, tId] = s.split("	");
    return { source: sId, target: tId };
  }).filter((p) => nodesById.has(p.source) && nodesById.has(p.target));
  const keep = new Set(filterNodes([...nodesById.values()], query).map((n) => n.id));
  const links = pairs.filter((p) => keep.has(p.source) || keep.has(p.target)).map((p) => ({ source: nodesById.get(p.source), target: nodesById.get(p.target) }));
  const used = /* @__PURE__ */ new Set();
  for (const l of links) {
    used.add(l.source.id);
    used.add(l.target.id);
  }
  const nodes = [...used].map((id2) => nodesById.get(id2));
  const deg = new Map([...used].map((id2) => [id2, 0]));
  for (const l of links) {
    deg.set(l.source.id, deg.get(l.source.id) + 1);
    deg.set(l.target.id, deg.get(l.target.id) + 1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;
  return { nodes, links };
}
var line = line_default();
var zoom = zoom_default2().on("zoom", (ev) => gMain.attr("transform", ev.transform));
svg.call(zoom);
function run(edgeType = "call", query = "") {
  const { nodes, links } = buildGraph(edgeType, query);
  const sim = simulation_default(nodes).force("charge", manyBody_default().strength((d) => d.kind === "module" ? -200 : -80)).force("link", link_default(links).id(nodeKey).distance((d) => 40 + 2 * Math.min(d.source.degree, d.target.degree)).strength(0.3)).force("collide", collide_default().radius((d) => 4 + Math.sqrt(2 + d.degree)).iterations(2)).force("x", x_default2().strength(0.06)).force("y", y_default2().strength(0.06));
  const linkSel = gLinks.selectAll("line").data(links, (d) => d.source.id + "\u2192" + d.target.id);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line").attr("class", "link").attr("stroke-width", 1);
  const link = linkEnter.merge(linkSel);
  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle").attr("class", "node").attr("r", (d) => 3 + Math.sqrt(1 + d.degree)).attr("fill", (d) => color2(d.kind)).attr("stroke", "#0b0e12").attr("stroke-width", 0.75).call(
    drag_default().on("start", (ev, d) => {
      if (!ev.active) sim.alphaTarget(0.2).restart();
      d.fx = d.x;
      d.fy = d.y;
    }).on("drag", (ev, d) => {
      d.fx = ev.x;
      d.fy = ev.y;
    }).on("end", (ev, d) => {
      if (!ev.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    })
  ).on("mouseenter", (_, d) => showInfo(d, links)).on("mouseleave", () => clearHighlight()).on("mousemove", (ev, d) => maybeHighlight(d));
  const node = nodeEnter.merge(nodeSel);
  const labelSel = gLabels.selectAll("text").data(nodes, nodeKey);
  labelSel.exit().remove();
  const label = labelSel.enter().append("text").attr("class", "label").attr("text-anchor", "middle").attr("dy", "-0.75em").text((d) => d.name || d.id).merge(labelSel);
  const neighbors = getNeighborsMap(links);
  function maybeHighlight(d) {
    const nb = neighbors.get(d.id) || /* @__PURE__ */ new Set();
    node.classed("highlight", (n) => n.id === d.id || nb.has(n.id)).attr("opacity", (n) => n.id === d.id || nb.has(n.id) ? 1 : 0.2);
    link.classed("highlight", (l) => l.source.id === d.id || l.target.id === d.id).attr("opacity", (l) => l.source.id === d.id || l.target.id === d.id ? 0.9 : 0.1);
    label.attr("opacity", (n) => labelsToggle.checked ? n.id === d.id || nb.has(n.id) ? 1 : 0.05 : 0);
  }
  function clearHighlight() {
    node.classed("highlight", false).attr("opacity", 1);
    link.classed("highlight", false).attr("opacity", 0.25);
    label.attr("opacity", labelsToggle.checked ? 1 : 0);
  }
  function showInfo(d, links2) {
    const incoming = links2.filter((l) => l.target.id === d.id).map((l) => l.source.id);
    const outgoing = links2.filter((l) => l.source.id === d.id).map((l) => l.target.id);
    const details = {
      id: d.id,
      name: d.name,
      kind: d.kind,
      scope: d.scope,
      file: d.file,
      line: d.line,
      visibility: d.visibility,
      attrs: d.attrs,
      result: d.result,
      dummies: d.dummies,
      // compact neighbors
      in_degree: incoming.length,
      out_degree: outgoing.length
    };
    info.innerHTML = `
      <h1>${d.name || d.id}</h1>
      <div class="muted">${d.kind}${d.scope ? ` \u2014 scope: ${d.scope}` : ""}</div>
      <div style="margin:8px 0">in: <b>${incoming.length}</b> \u2022 out: <b>${outgoing.length}</b></div>
      <pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre>
    `;
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m2) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m2]);
  }
  sim.on("tick", () => {
    link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });
  label.attr("opacity", labelsToggle.checked ? 1 : 0);
  if (nodes.length) {
    setTimeout(() => {
      const [minX, minY, maxX, maxY] = extentXY(nodes);
      const w = maxX - minX, h = maxY - minY;
      const vb = [minX - 40, minY - 40, w + 80, h + 80];
      svg.transition().duration(400).call(zoom.transform, identity2.translate(svg.node().clientWidth / 2, svg.node().clientHeight / 2).scale(Math.min(svg.node().clientWidth / vb[2], svg.node().clientHeight / vb[3])).translate(-(vb[0] + vb[2] / 2), -(vb[1] + vb[3] / 2)));
    }, 300);
  }
}
function extentXY(nodes) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  }
  return [minX, minY, maxX, maxY];
}
edgeTypeSel.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
filterInput.addEventListener("input", (void 0)?.(() => run(edgeTypeSel.value, filterInput.value), 200) || (() => run(edgeTypeSel.value, filterInput.value)));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
run(edgeTypeSel.value, filterInput.value);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL2ludGVybm1hcC9zcmMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2QzLWRpc3BhdGNoL3NyYy9kaXNwYXRjaC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jcmVhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvYXJyYXkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9tYXRjaGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0Q2hpbGRyZW4uanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZXhpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vam9pbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29yZGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zb3J0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2Rlcy5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbm9kZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW1wdHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VhY2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvd2luZG93LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zdHlsZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NsYXNzZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3RleHQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JhaXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9sb3dlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbnNlcnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JlbW92ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdHVtLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2l0ZXJhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc291cmNlRXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvcG9pbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9ldmVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9kcmFnLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1kcmFnL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWRyYWcvc3JjL2RyYWcuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9kZWZpbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jb2xvci5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2Jhc2lzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYmFzaXNDbG9zZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvbnVtYmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvc3RyaW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvdHJhbnNmb3JtL2RlY29tcG9zZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9wYXJzZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3pvb20uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRpbWVyL3NyYy90aW1lci5qcyIsICJub2RlX21vZHVsZXMvZDMtdGltZXIvc3JjL3RpbWVvdXQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2NoZWR1bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvc2VsZWN0aW9uL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90d2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbnRlcnBvbGF0ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9hdHRyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2F0dHJUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kZWxheS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kdXJhdGlvbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9lYXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2Vhc2VWYXJ5aW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9tZXJnZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9yZW1vdmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2VsZWN0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9zZWxlY3Rpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGVUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90ZXh0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3RleHRUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2VuZC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtZWFzZS9zcmMvY3ViaWMuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3NlbGVjdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2QzLWJydXNoL3NyYy9icnVzaC5qcyIsICJub2RlX21vZHVsZXMvZDMtcGF0aC9zcmMvcGF0aC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2FkZC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2NvdmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2V4dGVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy9maW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcmVtb3ZlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcm9vdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3NpemUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy92aXNpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3Zpc2l0QWZ0ZXIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy94LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMveS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWR0cmVlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvY29uc3RhbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9qaWdnbGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9jb2xsaWRlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvbGluay5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL2xjZy5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3NpbXVsYXRpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9tYW55Qm9keS5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3guanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy95LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvaW5pdC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL29yZGluYWwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY29sb3JzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1RhYmxlYXUxMC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2hhcGUvc3JjL2NvbnN0YW50LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zaGFwZS9zcmMvcGF0aC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2hhcGUvc3JjL2FycmF5LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zaGFwZS9zcmMvY3VydmUvbGluZWFyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zaGFwZS9zcmMvcG9pbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNoYXBlL3NyYy9saW5lLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy16b29tL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXpvb20vc3JjL3RyYW5zZm9ybS5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvbm9ldmVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvem9vbS5qcyIsICJjbGllbnQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBjbGFzcyBJbnRlcm5NYXAgZXh0ZW5kcyBNYXAge1xuICBjb25zdHJ1Y3RvcihlbnRyaWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKGVudHJpZXMgIT0gbnVsbCkgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgZW50cmllcykgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBzdXBlci5nZXQoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBoYXMoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIGtleSkpO1xuICB9XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLnNldChpbnRlcm5fc2V0KHRoaXMsIGtleSksIHZhbHVlKTtcbiAgfVxuICBkZWxldGUoa2V5KSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIGtleSkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRlcm5TZXQgZXh0ZW5kcyBTZXQge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZXMsIGtleSA9IGtleW9mKSB7XG4gICAgc3VwZXIoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7X2ludGVybjoge3ZhbHVlOiBuZXcgTWFwKCl9LCBfa2V5OiB7dmFsdWU6IGtleX19KTtcbiAgICBpZiAodmFsdWVzICE9IG51bGwpIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB0aGlzLmFkZCh2YWx1ZSk7XG4gIH1cbiAgaGFzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmhhcyhpbnRlcm5fZ2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmFkZChpbnRlcm5fc2V0KHRoaXMsIHZhbHVlKSk7XG4gIH1cbiAgZGVsZXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN1cGVyLmRlbGV0ZShpbnRlcm5fZGVsZXRlKHRoaXMsIHZhbHVlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW50ZXJuX2dldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICByZXR1cm4gX2ludGVybi5oYXMoa2V5KSA/IF9pbnRlcm4uZ2V0KGtleSkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJuX3NldCh7X2ludGVybiwgX2tleX0sIHZhbHVlKSB7XG4gIGNvbnN0IGtleSA9IF9rZXkodmFsdWUpO1xuICBpZiAoX2ludGVybi5oYXMoa2V5KSkgcmV0dXJuIF9pbnRlcm4uZ2V0KGtleSk7XG4gIF9pbnRlcm4uc2V0KGtleSwgdmFsdWUpO1xuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9kZWxldGUoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHtcbiAgICB2YWx1ZSA9IF9pbnRlcm4uZ2V0KGtleSk7XG4gICAgX2ludGVybi5kZWxldGUoa2V5KTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleW9mKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbn1cbiIsICJ2YXIgbm9vcCA9IHt2YWx1ZTogKCkgPT4ge319O1xuXG5mdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcmd1bWVudHMubGVuZ3RoLCBfID0ge30sIHQ7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoISh0ID0gYXJndW1lbnRzW2ldICsgXCJcIikgfHwgKHQgaW4gXykgfHwgL1tcXHMuXS8udGVzdCh0KSkgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCB0eXBlOiBcIiArIHQpO1xuICAgIF9bdF0gPSBbXTtcbiAgfVxuICByZXR1cm4gbmV3IERpc3BhdGNoKF8pO1xufVxuXG5mdW5jdGlvbiBEaXNwYXRjaChfKSB7XG4gIHRoaXMuXyA9IF87XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcywgdHlwZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIGlmICh0ICYmICF0eXBlcy5oYXNPd25Qcm9wZXJ0eSh0KSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHQpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5EaXNwYXRjaC5wcm90b3R5cGUgPSBkaXNwYXRjaC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBEaXNwYXRjaCxcbiAgb246IGZ1bmN0aW9uKHR5cGVuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBfID0gdGhpcy5fLFxuICAgICAgICBUID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiLCBfKSxcbiAgICAgICAgdCxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gVC5sZW5ndGg7XG5cbiAgICAvLyBJZiBubyBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGNhbGxiYWNrIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpICYmICh0ID0gZ2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUpKSkgcmV0dXJuIHQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgYSB0eXBlIHdhcyBzcGVjaWZpZWQsIHNldCB0aGUgY2FsbGJhY2sgZm9yIHRoZSBnaXZlbiB0eXBlIGFuZCBuYW1lLlxuICAgIC8vIE90aGVyd2lzZSwgaWYgYSBudWxsIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJlbW92ZSBjYWxsYmFja3Mgb2YgdGhlIGdpdmVuIG5hbWUuXG4gICAgaWYgKGNhbGxiYWNrICE9IG51bGwgJiYgdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgY2FsbGJhY2s6IFwiICsgY2FsbGJhY2spO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICBpZiAodCA9ICh0eXBlbmFtZSA9IFRbaV0pLnR5cGUpIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgY2FsbGJhY2spO1xuICAgICAgZWxzZSBpZiAoY2FsbGJhY2sgPT0gbnVsbCkgZm9yICh0IGluIF8pIF9bdF0gPSBzZXQoX1t0XSwgdHlwZW5hbWUubmFtZSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNvcHk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3B5ID0ge30sIF8gPSB0aGlzLl87XG4gICAgZm9yICh2YXIgdCBpbiBfKSBjb3B5W3RdID0gX1t0XS5zbGljZSgpO1xuICAgIHJldHVybiBuZXcgRGlzcGF0Y2goY29weSk7XG4gIH0sXG4gIGNhbGw6IGZ1bmN0aW9uKHR5cGUsIHRoYXQpIHtcbiAgICBpZiAoKG4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMikgPiAwKSBmb3IgKHZhciBhcmdzID0gbmV3IEFycmF5KG4pLCBpID0gMCwgbiwgdDsgaSA8IG47ICsraSkgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbih0eXBlLCB0aGF0LCBhcmdzKSB7XG4gICAgaWYgKCF0aGlzLl8uaGFzT3duUHJvcGVydHkodHlwZSkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0eXBlKTtcbiAgICBmb3IgKHZhciB0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXQodHlwZSwgbmFtZSkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoLCBjOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKChjID0gdHlwZVtpXSkubmFtZSA9PT0gbmFtZSkge1xuICAgICAgcmV0dXJuIGMudmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHNldCh0eXBlLCBuYW1lLCBjYWxsYmFjaykge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IHR5cGUubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKHR5cGVbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgdHlwZVtpXSA9IG5vb3AsIHR5cGUgPSB0eXBlLnNsaWNlKDAsIGkpLmNvbmNhdCh0eXBlLnNsaWNlKGkgKyAxKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHR5cGUucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IGNhbGxiYWNrfSk7XG4gIHJldHVybiB0eXBlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwYXRjaDtcbiIsICJleHBvcnQgdmFyIHhodG1sID0gXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3ZnOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gIHhodG1sOiB4aHRtbCxcbiAgeGxpbms6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiLFxuICB4bWw6IFwiaHR0cDovL3d3dy53My5vcmcvWE1MLzE5OTgvbmFtZXNwYWNlXCIsXG4gIHhtbG5zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCJcbn07XG4iLCAiaW1wb3J0IG5hbWVzcGFjZXMgZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBwcmVmaXggPSBuYW1lICs9IFwiXCIsIGkgPSBwcmVmaXguaW5kZXhPZihcIjpcIik7XG4gIGlmIChpID49IDAgJiYgKHByZWZpeCA9IG5hbWUuc2xpY2UoMCwgaSkpICE9PSBcInhtbG5zXCIpIG5hbWUgPSBuYW1lLnNsaWNlKGkgKyAxKTtcbiAgcmV0dXJuIG5hbWVzcGFjZXMuaGFzT3duUHJvcGVydHkocHJlZml4KSA/IHtzcGFjZTogbmFtZXNwYWNlc1twcmVmaXhdLCBsb2NhbDogbmFtZX0gOiBuYW1lOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4vbmFtZXNwYWNlLmpzXCI7XG5pbXBvcnQge3hodG1sfSBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmZ1bmN0aW9uIGNyZWF0b3JJbmhlcml0KG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkb2N1bWVudCA9IHRoaXMub3duZXJEb2N1bWVudCxcbiAgICAgICAgdXJpID0gdGhpcy5uYW1lc3BhY2VVUkk7XG4gICAgcmV0dXJuIHVyaSA9PT0geGh0bWwgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm5hbWVzcGFjZVVSSSA9PT0geGh0bWxcbiAgICAgICAgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpXG4gICAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKHVyaSwgbmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0b3JGaXhlZChmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG4gIHJldHVybiAoZnVsbG5hbWUubG9jYWxcbiAgICAgID8gY3JlYXRvckZpeGVkXG4gICAgICA6IGNyZWF0b3JJbmhlcml0KShmdWxsbmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gbm9uZSgpIHt9XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gbm9uZSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICIvLyBHaXZlbiBzb21ldGhpbmcgYXJyYXkgbGlrZSAob3IgbnVsbCksIHJldHVybnMgc29tZXRoaW5nIHRoYXQgaXMgc3RyaWN0bHkgYW5cbi8vIGFycmF5LiBUaGlzIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgYXJyYXktbGlrZSBvYmplY3RzIHBhc3NlZCB0byBkMy5zZWxlY3RBbGxcbi8vIG9yIHNlbGVjdGlvbi5zZWxlY3RBbGwgYXJlIGNvbnZlcnRlZCBpbnRvIHByb3BlciBhcnJheXMgd2hlbiBjcmVhdGluZyBhXG4vLyBzZWxlY3Rpb247IHdlIGRvblx1MjAxOXQgZXZlciB3YW50IHRvIGNyZWF0ZSBhIHNlbGVjdGlvbiBiYWNrZWQgYnkgYSBsaXZlXG4vLyBIVE1MQ29sbGVjdGlvbiBvciBOb2RlTGlzdC4gSG93ZXZlciwgbm90ZSB0aGF0IHNlbGVjdGlvbi5zZWxlY3RBbGwgd2lsbCB1c2UgYVxuLy8gc3RhdGljIE5vZGVMaXN0IGFzIGEgZ3JvdXAsIHNpbmNlIGl0IHNhZmVseSBkZXJpdmVkIGZyb20gcXVlcnlTZWxlY3RvckFsbC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFycmF5KHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbCA/IFtdIDogQXJyYXkuaXNBcnJheSh4KSA/IHggOiBBcnJheS5mcm9tKHgpO1xufVxuIiwgImZ1bmN0aW9uIGVtcHR5KCkge1xuICByZXR1cm4gW107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gZW1wdHkgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBhcnJheSBmcm9tIFwiLi4vYXJyYXkuanNcIjtcbmltcG9ydCBzZWxlY3RvckFsbCBmcm9tIFwiLi4vc2VsZWN0b3JBbGwuanNcIjtcblxuZnVuY3Rpb24gYXJyYXlBbGwoc2VsZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYXJyYXkoc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgPT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gYXJyYXlBbGwoc2VsZWN0KTtcbiAgZWxzZSBzZWxlY3QgPSBzZWxlY3RvckFsbChzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IFtdLCBwYXJlbnRzID0gW10sIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSk7XG4gICAgICAgIHBhcmVudHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHBhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkTWF0Y2hlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBub2RlLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaW5kID0gQXJyYXkucHJvdG90eXBlLmZpbmQ7XG5cbmZ1bmN0aW9uIGNoaWxkRmluZChtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbmQuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoaWxkRmlyc3QoKSB7XG4gIHJldHVybiB0aGlzLmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QobWF0Y2ggPT0gbnVsbCA/IGNoaWxkRmlyc3RcbiAgICAgIDogY2hpbGRGaW5kKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtjaGlsZE1hdGNoZXJ9IGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbnZhciBmaWx0ZXIgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyO1xuXG5mdW5jdGlvbiBjaGlsZHJlbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbik7XG59XG5cbmZ1bmN0aW9uIGNoaWxkcmVuRmlsdGVyKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3RBbGwobWF0Y2ggPT0gbnVsbCA/IGNoaWxkcmVuXG4gICAgICA6IGNoaWxkcmVuRmlsdGVyKHR5cGVvZiBtYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gbWF0Y2ggOiBjaGlsZE1hdGNoZXIobWF0Y2gpKSk7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgbWF0Y2hlciBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICBpZiAodHlwZW9mIG1hdGNoICE9PSBcImZ1bmN0aW9uXCIpIG1hdGNoID0gbWF0Y2hlcihtYXRjaCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IFtdLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIG1hdGNoLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cbiIsICJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9lbnRlciB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gRW50ZXJOb2RlKHBhcmVudCwgZGF0dW0pIHtcbiAgdGhpcy5vd25lckRvY3VtZW50ID0gcGFyZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHRoaXMubmFtZXNwYWNlVVJJID0gcGFyZW50Lm5hbWVzcGFjZVVSSTtcbiAgdGhpcy5fbmV4dCA9IG51bGw7XG4gIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5fX2RhdGFfXyA9IGRhdHVtO1xufVxuXG5FbnRlck5vZGUucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRW50ZXJOb2RlLFxuICBhcHBlbmRDaGlsZDogZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIHRoaXMuX25leHQpOyB9LFxuICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKGNoaWxkLCBuZXh0KSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgfSxcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsZWN0b3IpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTsgfVxufTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCB7RW50ZXJOb2RlfSBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuLi9jb25zdGFudC5qc1wiO1xuXG5mdW5jdGlvbiBiaW5kSW5kZXgocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSkge1xuICB2YXIgaSA9IDAsXG4gICAgICBub2RlLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGZpdCBpbnRvIHVwZGF0ZS5cbiAgLy8gUHV0IGFueSBudWxsIG5vZGVzIGludG8gZW50ZXIuXG4gIC8vIFB1dCBhbnkgcmVtYWluaW5nIGRhdGEgaW50byBlbnRlci5cbiAgZm9yICg7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBkb25cdTIwMTl0IGZpdCBpbnRvIGV4aXQuXG4gIGZvciAoOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBiaW5kS2V5KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEsIGtleSkge1xuICB2YXIgaSxcbiAgICAgIG5vZGUsXG4gICAgICBub2RlQnlLZXlWYWx1ZSA9IG5ldyBNYXAsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgIGtleVZhbHVlcyA9IG5ldyBBcnJheShncm91cExlbmd0aCksXG4gICAgICBrZXlWYWx1ZTtcblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggbm9kZS5cbiAgLy8gSWYgbXVsdGlwbGUgbm9kZXMgaGF2ZSB0aGUgc2FtZSBrZXksIHRoZSBkdXBsaWNhdGVzIGFyZSBhZGRlZCB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIGtleVZhbHVlc1tpXSA9IGtleVZhbHVlID0ga2V5LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApICsgXCJcIjtcbiAgICAgIGlmIChub2RlQnlLZXlWYWx1ZS5oYXMoa2V5VmFsdWUpKSB7XG4gICAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZUJ5S2V5VmFsdWUuc2V0KGtleVZhbHVlLCBub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21wdXRlIHRoZSBrZXkgZm9yIGVhY2ggZGF0dW0uXG4gIC8vIElmIHRoZXJlIGEgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXksIGpvaW4gYW5kIGFkZCBpdCB0byB1cGRhdGUuXG4gIC8vIElmIHRoZXJlIGlzIG5vdCAob3IgdGhlIGtleSBpcyBhIGR1cGxpY2F0ZSksIGFkZCBpdCB0byBlbnRlci5cbiAgZm9yIChpID0gMDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGtleVZhbHVlID0ga2V5LmNhbGwocGFyZW50LCBkYXRhW2ldLCBpLCBkYXRhKSArIFwiXCI7XG4gICAgaWYgKG5vZGUgPSBub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWUpKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZS5kZWxldGUoa2V5VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZXNbaV0pID09PSBub2RlKSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRhdHVtKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuX19kYXRhX187XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLCBkYXR1bSk7XG5cbiAgdmFyIGJpbmQgPSBrZXkgPyBiaW5kS2V5IDogYmluZEluZGV4LFxuICAgICAgcGFyZW50cyA9IHRoaXMuX3BhcmVudHMsXG4gICAgICBncm91cHMgPSB0aGlzLl9ncm91cHM7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB2YWx1ZSA9IGNvbnN0YW50KHZhbHVlKTtcblxuICBmb3IgKHZhciBtID0gZ3JvdXBzLmxlbmd0aCwgdXBkYXRlID0gbmV3IEFycmF5KG0pLCBlbnRlciA9IG5ldyBBcnJheShtKSwgZXhpdCA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICB2YXIgcGFyZW50ID0gcGFyZW50c1tqXSxcbiAgICAgICAgZ3JvdXAgPSBncm91cHNbal0sXG4gICAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgICBkYXRhID0gYXJyYXlsaWtlKHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSksXG4gICAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aCxcbiAgICAgICAgZW50ZXJHcm91cCA9IGVudGVyW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICB1cGRhdGVHcm91cCA9IHVwZGF0ZVtqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgZXhpdEdyb3VwID0gZXhpdFtqXSA9IG5ldyBBcnJheShncm91cExlbmd0aCk7XG5cbiAgICBiaW5kKHBhcmVudCwgZ3JvdXAsIGVudGVyR3JvdXAsIHVwZGF0ZUdyb3VwLCBleGl0R3JvdXAsIGRhdGEsIGtleSk7XG5cbiAgICAvLyBOb3cgY29ubmVjdCB0aGUgZW50ZXIgbm9kZXMgdG8gdGhlaXIgZm9sbG93aW5nIHVwZGF0ZSBub2RlLCBzdWNoIHRoYXRcbiAgICAvLyBhcHBlbmRDaGlsZCBjYW4gaW5zZXJ0IHRoZSBtYXRlcmlhbGl6ZWQgZW50ZXIgbm9kZSBiZWZvcmUgdGhpcyBub2RlLFxuICAgIC8vIHJhdGhlciB0aGFuIGF0IHRoZSBlbmQgb2YgdGhlIHBhcmVudCBub2RlLlxuICAgIGZvciAodmFyIGkwID0gMCwgaTEgPSAwLCBwcmV2aW91cywgbmV4dDsgaTAgPCBkYXRhTGVuZ3RoOyArK2kwKSB7XG4gICAgICBpZiAocHJldmlvdXMgPSBlbnRlckdyb3VwW2kwXSkge1xuICAgICAgICBpZiAoaTAgPj0gaTEpIGkxID0gaTAgKyAxO1xuICAgICAgICB3aGlsZSAoIShuZXh0ID0gdXBkYXRlR3JvdXBbaTFdKSAmJiArK2kxIDwgZGF0YUxlbmd0aCk7XG4gICAgICAgIHByZXZpb3VzLl9uZXh0ID0gbmV4dCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSA9IG5ldyBTZWxlY3Rpb24odXBkYXRlLCBwYXJlbnRzKTtcbiAgdXBkYXRlLl9lbnRlciA9IGVudGVyO1xuICB1cGRhdGUuX2V4aXQgPSBleGl0O1xuICByZXR1cm4gdXBkYXRlO1xufVxuXG4vLyBHaXZlbiBzb21lIGRhdGEsIHRoaXMgcmV0dXJucyBhbiBhcnJheS1saWtlIHZpZXcgb2YgaXQ6IGFuIG9iamVjdCB0aGF0XG4vLyBleHBvc2VzIGEgbGVuZ3RoIHByb3BlcnR5IGFuZCBhbGxvd3MgbnVtZXJpYyBpbmRleGluZy4gTm90ZSB0aGF0IHVubGlrZVxuLy8gc2VsZWN0QWxsLCB0aGlzIGlzblx1MjAxOXQgd29ycmllZCBhYm91dCBcdTIwMUNsaXZlXHUyMDFEIGNvbGxlY3Rpb25zIGJlY2F1c2UgdGhlIHJlc3VsdGluZ1xuLy8gYXJyYXkgd2lsbCBvbmx5IGJlIHVzZWQgYnJpZWZseSB3aGlsZSBkYXRhIGlzIGJlaW5nIGJvdW5kLiAoSXQgaXMgcG9zc2libGUgdG9cbi8vIGNhdXNlIHRoZSBkYXRhIHRvIGNoYW5nZSB3aGlsZSBpdGVyYXRpbmcgYnkgdXNpbmcgYSBrZXkgZnVuY3Rpb24sIGJ1dCBwbGVhc2Vcbi8vIGRvblx1MjAxOXQ7IHdlXHUyMDE5ZCByYXRoZXIgYXZvaWQgYSBncmF0dWl0b3VzIGNvcHkuKVxuZnVuY3Rpb24gYXJyYXlsaWtlKGRhdGEpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmIFwibGVuZ3RoXCIgaW4gZGF0YVxuICAgID8gZGF0YSAvLyBBcnJheSwgVHlwZWRBcnJheSwgTm9kZUxpc3QsIGFycmF5LWxpa2VcbiAgICA6IEFycmF5LmZyb20oZGF0YSk7IC8vIE1hcCwgU2V0LCBpdGVyYWJsZSwgc3RyaW5nLCBvciBhbnl0aGluZyBlbHNlXG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZXhpdCB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9uZW50ZXIsIG9udXBkYXRlLCBvbmV4aXQpIHtcbiAgdmFyIGVudGVyID0gdGhpcy5lbnRlcigpLCB1cGRhdGUgPSB0aGlzLCBleGl0ID0gdGhpcy5leGl0KCk7XG4gIGlmICh0eXBlb2Ygb25lbnRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZW50ZXIgPSBvbmVudGVyKGVudGVyKTtcbiAgICBpZiAoZW50ZXIpIGVudGVyID0gZW50ZXIuc2VsZWN0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgZW50ZXIgPSBlbnRlci5hcHBlbmQob25lbnRlciArIFwiXCIpO1xuICB9XG4gIGlmIChvbnVwZGF0ZSAhPSBudWxsKSB7XG4gICAgdXBkYXRlID0gb251cGRhdGUodXBkYXRlKTtcbiAgICBpZiAodXBkYXRlKSB1cGRhdGUgPSB1cGRhdGUuc2VsZWN0aW9uKCk7XG4gIH1cbiAgaWYgKG9uZXhpdCA9PSBudWxsKSBleGl0LnJlbW92ZSgpOyBlbHNlIG9uZXhpdChleGl0KTtcbiAgcmV0dXJuIGVudGVyICYmIHVwZGF0ZSA/IGVudGVyLm1lcmdlKHVwZGF0ZSkub3JkZXIoKSA6IHVwZGF0ZTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29udGV4dCkge1xuICB2YXIgc2VsZWN0aW9uID0gY29udGV4dC5zZWxlY3Rpb24gPyBjb250ZXh0LnNlbGVjdGlvbigpIDogY29udGV4dDtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gLTEsIG0gPSBncm91cHMubGVuZ3RoOyArK2ogPCBtOykge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gZ3JvdXAubGVuZ3RoIC0gMSwgbmV4dCA9IGdyb3VwW2ldLCBub2RlOyAtLWkgPj0gMDspIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgaWYgKG5leHQgJiYgbm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihuZXh0KSBeIDQpIG5leHQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZSwgbmV4dCk7XG4gICAgICAgIG5leHQgPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb21wYXJlKSB7XG4gIGlmICghY29tcGFyZSkgY29tcGFyZSA9IGFzY2VuZGluZztcblxuICBmdW5jdGlvbiBjb21wYXJlTm9kZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgJiYgYiA/IGNvbXBhcmUoYS5fX2RhdGFfXywgYi5fX2RhdGFfXykgOiAhYSAtICFiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc29ydGdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc29ydGdyb3VwID0gc29ydGdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc29ydGdyb3VwW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGdyb3VwLnNvcnQoY29tcGFyZU5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc29ydGdyb3VwcywgdGhpcy5fcGFyZW50cykub3JkZXIoKTtcbn1cblxuZnVuY3Rpb24gYXNjZW5kaW5nKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiBhID49IGIgPyAwIDogTmFOO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgdmFyIG5vZGUgPSBncm91cFtpXTtcbiAgICAgIGlmIChub2RlKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgbGV0IHNpemUgPSAwO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgdGhpcykgKytzaXplOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHJldHVybiBzaXplO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMubm9kZSgpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIGNhbGxiYWNrLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBuYW1lc3BhY2UgZnJvbSBcIi4uL25hbWVzcGFjZS5qc1wiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCB2KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIHYpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm5vZGUoKTtcbiAgICByZXR1cm4gZnVsbG5hbWUubG9jYWxcbiAgICAgICAgPyBub2RlLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbClcbiAgICAgICAgOiBub2RlLmdldEF0dHJpYnV0ZShmdWxsbmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkpKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXc7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIHN0eWxlUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQobmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdiwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgICAgPyBzdHlsZVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICA/IHN0eWxlRnVuY3Rpb25cbiAgICAgICAgICAgIDogc3R5bGVDb25zdGFudCkobmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKVxuICAgICAgOiBzdHlsZVZhbHVlKHRoaXMubm9kZSgpLCBuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlVmFsdWUobm9kZSwgbmFtZSkge1xuICByZXR1cm4gbm9kZS5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpXG4gICAgICB8fCBkZWZhdWx0Vmlldyhub2RlKS5nZXRDb21wdXRlZFN0eWxlKG5vZGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUobmFtZSk7XG59XG4iLCAiZnVuY3Rpb24gcHJvcGVydHlSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZGVsZXRlIHRoaXNbbmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5Q29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIGRlbGV0ZSB0aGlzW25hbWVdO1xuICAgIGVsc2UgdGhpc1tuYW1lXSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG4iLCAiZnVuY3Rpb24gY2xhc3NBcnJheShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy50cmltKCkuc3BsaXQoL158XFxzKy8pO1xufVxuXG5mdW5jdGlvbiBjbGFzc0xpc3Qobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc0xpc3QgfHwgbmV3IENsYXNzTGlzdChub2RlKTtcbn1cblxuZnVuY3Rpb24gQ2xhc3NMaXN0KG5vZGUpIHtcbiAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gIHRoaXMuX25hbWVzID0gY2xhc3NBcnJheShub2RlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpO1xufVxuXG5DbGFzc0xpc3QucHJvdG90eXBlID0ge1xuICBhZGQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5wdXNoKG5hbWUpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaSA9IHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSk7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgdGhpcy5fbmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLl9uYW1lcy5qb2luKFwiIFwiKSk7XG4gICAgfVxuICB9LFxuICBjb250YWluczogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpID49IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNsYXNzZWRBZGQobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QuYWRkKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFJlbW92ZShub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5yZW1vdmUobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkVHJ1ZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZEFkZCh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGYWxzZShuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY2xhc3NlZFJlbW92ZSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRGdW5jdGlvbihuYW1lcywgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICh2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpID8gY2xhc3NlZEFkZCA6IGNsYXNzZWRSZW1vdmUpKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIG5hbWVzID0gY2xhc3NBcnJheShuYW1lICsgXCJcIik7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIGxpc3QgPSBjbGFzc0xpc3QodGhpcy5ub2RlKCkpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIGlmICghbGlzdC5jb250YWlucyhuYW1lc1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGNsYXNzZWRGdW5jdGlvbiA6IHZhbHVlXG4gICAgICA/IGNsYXNzZWRUcnVlXG4gICAgICA6IGNsYXNzZWRGYWxzZSkobmFtZXMsIHZhbHVlKSk7XG59XG4iLCAiZnVuY3Rpb24gdGV4dFJlbW92ZSgpIHtcbiAgdGhpcy50ZXh0Q29udGVudCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIHRleHRDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyB0ZXh0UmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyB0ZXh0RnVuY3Rpb25cbiAgICAgICAgICA6IHRleHRDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS50ZXh0Q29udGVudDtcbn1cbiIsICJmdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cbiIsICJmdW5jdGlvbiByYWlzZSgpIHtcbiAgaWYgKHRoaXMubmV4dFNpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5hcHBlbmRDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmFpc2UpO1xufVxuIiwgImZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChsb3dlcik7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kQ2hpbGQoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yIGZyb20gXCIuLi9zZWxlY3Rvci5qc1wiO1xuXG5mdW5jdGlvbiBjb25zdGFudE51bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCBiZWZvcmUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKSxcbiAgICAgIHNlbGVjdCA9IGJlZm9yZSA9PSBudWxsID8gY29uc3RhbnROdWxsIDogdHlwZW9mIGJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gYmVmb3JlIDogc2VsZWN0b3IoYmVmb3JlKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluc2VydEJlZm9yZShjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgc2VsZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgbnVsbCk7XG4gIH0pO1xufVxuIiwgImZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyZW1vdmUpO1xufVxuIiwgImZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZVNoYWxsb3coKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKGZhbHNlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lRGVlcCgpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUodHJ1ZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGRlZXApIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGRlZXAgPyBzZWxlY3Rpb25fY2xvbmVEZWVwIDogc2VsZWN0aW9uX2Nsb25lU2hhbGxvdyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5wcm9wZXJ0eShcIl9fZGF0YV9fXCIsIHZhbHVlKVxuICAgICAgOiB0aGlzLm5vZGUoKS5fX2RhdGFfXztcbn1cbiIsICJmdW5jdGlvbiBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCwgdGhpcy5fX2RhdGFfXyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlKHR5cGVuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb247XG4gICAgaWYgKCFvbikgcmV0dXJuO1xuICAgIGZvciAodmFyIGogPSAwLCBpID0gLTEsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGlmIChvID0gb25bal0sICghdHlwZW5hbWUudHlwZSB8fCBvLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUpICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb25bKytpXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgrK2kpIG9uLmxlbmd0aCA9IGk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fX29uO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbkFkZCh0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbiwgbywgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIodmFsdWUpO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8ub3B0aW9ucyA9IG9wdGlvbnMpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBvcHRpb25zOiBvcHRpb25zfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlbmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGVuYW1lcyA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiksIGksIG4gPSB0eXBlbmFtZXMubGVuZ3RoLCB0O1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBvbiA9IHRoaXMubm9kZSgpLl9fb247XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgZm9yIChpID0gMCwgbyA9IG9uW2pdOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICgodCA9IHR5cGVuYW1lc1tpXSkudHlwZSA9PT0gby50eXBlICYmIHQubmFtZSA9PT0gby5uYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG8udmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb24gPSB2YWx1ZSA/IG9uQWRkIDogb25SZW1vdmU7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBvcHRpb25zKSk7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBkZWZhdWx0VmlldyBmcm9tIFwiLi4vd2luZG93LmpzXCI7XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gIGlmICh0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gZGlzcGF0Y2hGdW5jdGlvblxuICAgICAgOiBkaXNwYXRjaENvbnN0YW50KSh0eXBlLCBwYXJhbXMpKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiooKSB7XG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB5aWVsZCBub2RlO1xuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCBzZWxlY3Rpb25fc2VsZWN0IGZyb20gXCIuL3NlbGVjdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RBbGwgZnJvbSBcIi4vc2VsZWN0QWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkIGZyb20gXCIuL3NlbGVjdENoaWxkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuIGZyb20gXCIuL3NlbGVjdENoaWxkcmVuLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2ZpbHRlciBmcm9tIFwiLi9maWx0ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VudGVyIGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2V4aXQgZnJvbSBcIi4vZXhpdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9qb2luIGZyb20gXCIuL2pvaW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb3JkZXIgZnJvbSBcIi4vb3JkZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc29ydCBmcm9tIFwiLi9zb3J0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NhbGwgZnJvbSBcIi4vY2FsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlcyBmcm9tIFwiLi9ub2Rlcy5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9ub2RlIGZyb20gXCIuL25vZGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2l6ZSBmcm9tIFwiLi9zaXplLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VtcHR5IGZyb20gXCIuL2VtcHR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2VhY2ggZnJvbSBcIi4vZWFjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hdHRyIGZyb20gXCIuL2F0dHIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcHJvcGVydHkgZnJvbSBcIi4vcHJvcGVydHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xhc3NlZCBmcm9tIFwiLi9jbGFzc2VkLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9odG1sIGZyb20gXCIuL2h0bWwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmFpc2UgZnJvbSBcIi4vcmFpc2UuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbG93ZXIgZnJvbSBcIi4vbG93ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXBwZW5kIGZyb20gXCIuL2FwcGVuZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnNlcnQgZnJvbSBcIi4vaW5zZXJ0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2xvbmUgZnJvbSBcIi4vY2xvbmUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGF0dW0gZnJvbSBcIi4vZGF0dW0uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fb24gZnJvbSBcIi4vb24uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZGlzcGF0Y2ggZnJvbSBcIi4vZGlzcGF0Y2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faXRlcmF0b3IgZnJvbSBcIi4vaXRlcmF0b3IuanNcIjtcblxuZXhwb3J0IHZhciByb290ID0gW251bGxdO1xuXG5leHBvcnQgZnVuY3Rpb24gU2VsZWN0aW9uKGdyb3VwcywgcGFyZW50cykge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XV0sIHJvb3QpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fc2VsZWN0aW9uKCkge1xuICByZXR1cm4gdGhpcztcbn1cblxuU2VsZWN0aW9uLnByb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBTZWxlY3Rpb24sXG4gIHNlbGVjdDogc2VsZWN0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiBzZWxlY3Rpb25fc2VsZWN0QWxsLFxuICBzZWxlY3RDaGlsZDogc2VsZWN0aW9uX3NlbGVjdENoaWxkLFxuICBzZWxlY3RDaGlsZHJlbjogc2VsZWN0aW9uX3NlbGVjdENoaWxkcmVuLFxuICBmaWx0ZXI6IHNlbGVjdGlvbl9maWx0ZXIsXG4gIGRhdGE6IHNlbGVjdGlvbl9kYXRhLFxuICBlbnRlcjogc2VsZWN0aW9uX2VudGVyLFxuICBleGl0OiBzZWxlY3Rpb25fZXhpdCxcbiAgam9pbjogc2VsZWN0aW9uX2pvaW4sXG4gIG1lcmdlOiBzZWxlY3Rpb25fbWVyZ2UsXG4gIHNlbGVjdGlvbjogc2VsZWN0aW9uX3NlbGVjdGlvbixcbiAgb3JkZXI6IHNlbGVjdGlvbl9vcmRlcixcbiAgc29ydDogc2VsZWN0aW9uX3NvcnQsXG4gIGNhbGw6IHNlbGVjdGlvbl9jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX25vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fbm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3NpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9lYWNoLFxuICBhdHRyOiBzZWxlY3Rpb25fYXR0cixcbiAgc3R5bGU6IHNlbGVjdGlvbl9zdHlsZSxcbiAgcHJvcGVydHk6IHNlbGVjdGlvbl9wcm9wZXJ0eSxcbiAgY2xhc3NlZDogc2VsZWN0aW9uX2NsYXNzZWQsXG4gIHRleHQ6IHNlbGVjdGlvbl90ZXh0LFxuICBodG1sOiBzZWxlY3Rpb25faHRtbCxcbiAgcmFpc2U6IHNlbGVjdGlvbl9yYWlzZSxcbiAgbG93ZXI6IHNlbGVjdGlvbl9sb3dlcixcbiAgYXBwZW5kOiBzZWxlY3Rpb25fYXBwZW5kLFxuICBpbnNlcnQ6IHNlbGVjdGlvbl9pbnNlcnQsXG4gIHJlbW92ZTogc2VsZWN0aW9uX3JlbW92ZSxcbiAgY2xvbmU6IHNlbGVjdGlvbl9jbG9uZSxcbiAgZGF0dW06IHNlbGVjdGlvbl9kYXR1bSxcbiAgb246IHNlbGVjdGlvbl9vbixcbiAgZGlzcGF0Y2g6IHNlbGVjdGlvbl9kaXNwYXRjaCxcbiAgW1N5bWJvbC5pdGVyYXRvcl06IHNlbGVjdGlvbl9pdGVyYXRvclxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VsZWN0aW9uO1xuIiwgImltcG9ydCB7U2VsZWN0aW9uLCByb290fSBmcm9tIFwiLi9zZWxlY3Rpb24vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcildXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW1tzZWxlY3Rvcl1dLCByb290KTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihldmVudCkge1xuICBsZXQgc291cmNlRXZlbnQ7XG4gIHdoaWxlIChzb3VyY2VFdmVudCA9IGV2ZW50LnNvdXJjZUV2ZW50KSBldmVudCA9IHNvdXJjZUV2ZW50O1xuICByZXR1cm4gZXZlbnQ7XG59XG4iLCAiaW1wb3J0IHNvdXJjZUV2ZW50IGZyb20gXCIuL3NvdXJjZUV2ZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGV2ZW50LCBub2RlKSB7XG4gIGV2ZW50ID0gc291cmNlRXZlbnQoZXZlbnQpO1xuICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSBub2RlID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgaWYgKG5vZGUpIHtcbiAgICB2YXIgc3ZnID0gbm9kZS5vd25lclNWR0VsZW1lbnQgfHwgbm9kZTtcbiAgICBpZiAoc3ZnLmNyZWF0ZVNWR1BvaW50KSB7XG4gICAgICB2YXIgcG9pbnQgPSBzdmcuY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICAgIHBvaW50LnggPSBldmVudC5jbGllbnRYLCBwb2ludC55ID0gZXZlbnQuY2xpZW50WTtcbiAgICAgIHBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKG5vZGUuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcbiAgICAgIHJldHVybiBbcG9pbnQueCwgcG9pbnQueV07XG4gICAgfVxuICAgIGlmIChub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCkge1xuICAgICAgdmFyIHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgcmV0dXJuIFtldmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gbm9kZS5jbGllbnRMZWZ0LCBldmVudC5jbGllbnRZIC0gcmVjdC50b3AgLSBub2RlLmNsaWVudFRvcF07XG4gICAgfVxuICB9XG4gIHJldHVybiBbZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZXTtcbn1cbiIsICIvLyBUaGVzZSBhcmUgdHlwaWNhbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBub2V2ZW50IHRvIGVuc3VyZSB0aGF0IHdlIGNhblxuLy8gcHJldmVudERlZmF1bHQgb24gdGhlIGV2ZW50LlxuZXhwb3J0IGNvbnN0IG5vbnBhc3NpdmUgPSB7cGFzc2l2ZTogZmFsc2V9O1xuZXhwb3J0IGNvbnN0IG5vbnBhc3NpdmVjYXB0dXJlID0ge2NhcHR1cmU6IHRydWUsIHBhc3NpdmU6IGZhbHNlfTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcHJvcGFnYXRpb24oZXZlbnQpIHtcbiAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuIiwgImltcG9ydCB7c2VsZWN0fSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQgbm9ldmVudCwge25vbnBhc3NpdmVjYXB0dXJlfSBmcm9tIFwiLi9ub2V2ZW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZpZXcpIHtcbiAgdmFyIHJvb3QgPSB2aWV3LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdCh2aWV3KS5vbihcImRyYWdzdGFydC5kcmFnXCIsIG5vZXZlbnQsIG5vbnBhc3NpdmVjYXB0dXJlKTtcbiAgaWYgKFwib25zZWxlY3RzdGFydFwiIGluIHJvb3QpIHtcbiAgICBzZWxlY3Rpb24ub24oXCJzZWxlY3RzdGFydC5kcmFnXCIsIG5vZXZlbnQsIG5vbnBhc3NpdmVjYXB0dXJlKTtcbiAgfSBlbHNlIHtcbiAgICByb290Ll9fbm9zZWxlY3QgPSByb290LnN0eWxlLk1velVzZXJTZWxlY3Q7XG4gICAgcm9vdC5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gXCJub25lXCI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHllc2RyYWcodmlldywgbm9jbGljaykge1xuICB2YXIgcm9vdCA9IHZpZXcuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgc2VsZWN0aW9uID0gc2VsZWN0KHZpZXcpLm9uKFwiZHJhZ3N0YXJ0LmRyYWdcIiwgbnVsbCk7XG4gIGlmIChub2NsaWNrKSB7XG4gICAgc2VsZWN0aW9uLm9uKFwiY2xpY2suZHJhZ1wiLCBub2V2ZW50LCBub25wYXNzaXZlY2FwdHVyZSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgc2VsZWN0aW9uLm9uKFwiY2xpY2suZHJhZ1wiLCBudWxsKTsgfSwgMCk7XG4gIH1cbiAgaWYgKFwib25zZWxlY3RzdGFydFwiIGluIHJvb3QpIHtcbiAgICBzZWxlY3Rpb24ub24oXCJzZWxlY3RzdGFydC5kcmFnXCIsIG51bGwpO1xuICB9IGVsc2Uge1xuICAgIHJvb3Quc3R5bGUuTW96VXNlclNlbGVjdCA9IHJvb3QuX19ub3NlbGVjdDtcbiAgICBkZWxldGUgcm9vdC5fX25vc2VsZWN0O1xuICB9XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgeCA9PiAoKSA9PiB4O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERyYWdFdmVudCh0eXBlLCB7XG4gIHNvdXJjZUV2ZW50LFxuICBzdWJqZWN0LFxuICB0YXJnZXQsXG4gIGlkZW50aWZpZXIsXG4gIGFjdGl2ZSxcbiAgeCwgeSwgZHgsIGR5LFxuICBkaXNwYXRjaFxufSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLCB7XG4gICAgdHlwZToge3ZhbHVlOiB0eXBlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHNvdXJjZUV2ZW50OiB7dmFsdWU6IHNvdXJjZUV2ZW50LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHN1YmplY3Q6IHt2YWx1ZTogc3ViamVjdCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB0YXJnZXQ6IHt2YWx1ZTogdGFyZ2V0LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIGlkZW50aWZpZXI6IHt2YWx1ZTogaWRlbnRpZmllciwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBhY3RpdmU6IHt2YWx1ZTogYWN0aXZlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHg6IHt2YWx1ZTogeCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB5OiB7dmFsdWU6IHksIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgZHg6IHt2YWx1ZTogZHgsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgZHk6IHt2YWx1ZTogZHksIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgXzoge3ZhbHVlOiBkaXNwYXRjaH1cbiAgfSk7XG59XG5cbkRyYWdFdmVudC5wcm90b3R5cGUub24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHZhbHVlID0gdGhpcy5fLm9uLmFwcGx5KHRoaXMuXywgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHZhbHVlID09PSB0aGlzLl8gPyB0aGlzIDogdmFsdWU7XG59O1xuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHtzZWxlY3QsIHBvaW50ZXJ9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCBub2RyYWcsIHt5ZXNkcmFnfSBmcm9tIFwiLi9ub2RyYWcuanNcIjtcbmltcG9ydCBub2V2ZW50LCB7bm9ucGFzc2l2ZSwgbm9ucGFzc2l2ZWNhcHR1cmUsIG5vcHJvcGFnYXRpb259IGZyb20gXCIuL25vZXZlbnQuanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IERyYWdFdmVudCBmcm9tIFwiLi9ldmVudC5qc1wiO1xuXG4vLyBJZ25vcmUgcmlnaHQtY2xpY2ssIHNpbmNlIHRoYXQgc2hvdWxkIG9wZW4gdGhlIGNvbnRleHQgbWVudS5cbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXIoZXZlbnQpIHtcbiAgcmV0dXJuICFldmVudC5jdHJsS2V5ICYmICFldmVudC5idXR0b247XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb250YWluZXIoKSB7XG4gIHJldHVybiB0aGlzLnBhcmVudE5vZGU7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRTdWJqZWN0KGV2ZW50LCBkKSB7XG4gIHJldHVybiBkID09IG51bGwgPyB7eDogZXZlbnQueCwgeTogZXZlbnQueX0gOiBkO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VG91Y2hhYmxlKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IChcIm9udG91Y2hzdGFydFwiIGluIHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGZpbHRlciA9IGRlZmF1bHRGaWx0ZXIsXG4gICAgICBjb250YWluZXIgPSBkZWZhdWx0Q29udGFpbmVyLFxuICAgICAgc3ViamVjdCA9IGRlZmF1bHRTdWJqZWN0LFxuICAgICAgdG91Y2hhYmxlID0gZGVmYXVsdFRvdWNoYWJsZSxcbiAgICAgIGdlc3R1cmVzID0ge30sXG4gICAgICBsaXN0ZW5lcnMgPSBkaXNwYXRjaChcInN0YXJ0XCIsIFwiZHJhZ1wiLCBcImVuZFwiKSxcbiAgICAgIGFjdGl2ZSA9IDAsXG4gICAgICBtb3VzZWRvd254LFxuICAgICAgbW91c2Vkb3dueSxcbiAgICAgIG1vdXNlbW92aW5nLFxuICAgICAgdG91Y2hlbmRpbmcsXG4gICAgICBjbGlja0Rpc3RhbmNlMiA9IDA7XG5cbiAgZnVuY3Rpb24gZHJhZyhzZWxlY3Rpb24pIHtcbiAgICBzZWxlY3Rpb25cbiAgICAgICAgLm9uKFwibW91c2Vkb3duLmRyYWdcIiwgbW91c2Vkb3duZWQpXG4gICAgICAuZmlsdGVyKHRvdWNoYWJsZSlcbiAgICAgICAgLm9uKFwidG91Y2hzdGFydC5kcmFnXCIsIHRvdWNoc3RhcnRlZClcbiAgICAgICAgLm9uKFwidG91Y2htb3ZlLmRyYWdcIiwgdG91Y2htb3ZlZCwgbm9ucGFzc2l2ZSlcbiAgICAgICAgLm9uKFwidG91Y2hlbmQuZHJhZyB0b3VjaGNhbmNlbC5kcmFnXCIsIHRvdWNoZW5kZWQpXG4gICAgICAgIC5zdHlsZShcInRvdWNoLWFjdGlvblwiLCBcIm5vbmVcIilcbiAgICAgICAgLnN0eWxlKFwiLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yXCIsIFwicmdiYSgwLDAsMCwwKVwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlZG93bmVkKGV2ZW50LCBkKSB7XG4gICAgaWYgKHRvdWNoZW5kaW5nIHx8ICFmaWx0ZXIuY2FsbCh0aGlzLCBldmVudCwgZCkpIHJldHVybjtcbiAgICB2YXIgZ2VzdHVyZSA9IGJlZm9yZXN0YXJ0KHRoaXMsIGNvbnRhaW5lci5jYWxsKHRoaXMsIGV2ZW50LCBkKSwgZXZlbnQsIGQsIFwibW91c2VcIik7XG4gICAgaWYgKCFnZXN0dXJlKSByZXR1cm47XG4gICAgc2VsZWN0KGV2ZW50LnZpZXcpXG4gICAgICAub24oXCJtb3VzZW1vdmUuZHJhZ1wiLCBtb3VzZW1vdmVkLCBub25wYXNzaXZlY2FwdHVyZSlcbiAgICAgIC5vbihcIm1vdXNldXAuZHJhZ1wiLCBtb3VzZXVwcGVkLCBub25wYXNzaXZlY2FwdHVyZSk7XG4gICAgbm9kcmFnKGV2ZW50LnZpZXcpO1xuICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIG1vdXNlbW92aW5nID0gZmFsc2U7XG4gICAgbW91c2Vkb3dueCA9IGV2ZW50LmNsaWVudFg7XG4gICAgbW91c2Vkb3dueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgZ2VzdHVyZShcInN0YXJ0XCIsIGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlbW92ZWQoZXZlbnQpIHtcbiAgICBub2V2ZW50KGV2ZW50KTtcbiAgICBpZiAoIW1vdXNlbW92aW5nKSB7XG4gICAgICB2YXIgZHggPSBldmVudC5jbGllbnRYIC0gbW91c2Vkb3dueCwgZHkgPSBldmVudC5jbGllbnRZIC0gbW91c2Vkb3dueTtcbiAgICAgIG1vdXNlbW92aW5nID0gZHggKiBkeCArIGR5ICogZHkgPiBjbGlja0Rpc3RhbmNlMjtcbiAgICB9XG4gICAgZ2VzdHVyZXMubW91c2UoXCJkcmFnXCIsIGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNldXBwZWQoZXZlbnQpIHtcbiAgICBzZWxlY3QoZXZlbnQudmlldykub24oXCJtb3VzZW1vdmUuZHJhZyBtb3VzZXVwLmRyYWdcIiwgbnVsbCk7XG4gICAgeWVzZHJhZyhldmVudC52aWV3LCBtb3VzZW1vdmluZyk7XG4gICAgbm9ldmVudChldmVudCk7XG4gICAgZ2VzdHVyZXMubW91c2UoXCJlbmRcIiwgZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hzdGFydGVkKGV2ZW50LCBkKSB7XG4gICAgaWYgKCFmaWx0ZXIuY2FsbCh0aGlzLCBldmVudCwgZCkpIHJldHVybjtcbiAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLFxuICAgICAgICBjID0gY29udGFpbmVyLmNhbGwodGhpcywgZXZlbnQsIGQpLFxuICAgICAgICBuID0gdG91Y2hlcy5sZW5ndGgsIGksIGdlc3R1cmU7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoZ2VzdHVyZSA9IGJlZm9yZXN0YXJ0KHRoaXMsIGMsIGV2ZW50LCBkLCB0b3VjaGVzW2ldLmlkZW50aWZpZXIsIHRvdWNoZXNbaV0pKSB7XG4gICAgICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgICAgICBnZXN0dXJlKFwic3RhcnRcIiwgZXZlbnQsIHRvdWNoZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNobW92ZWQoZXZlbnQpIHtcbiAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLFxuICAgICAgICBuID0gdG91Y2hlcy5sZW5ndGgsIGksIGdlc3R1cmU7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoZ2VzdHVyZSA9IGdlc3R1cmVzW3RvdWNoZXNbaV0uaWRlbnRpZmllcl0pIHtcbiAgICAgICAgbm9ldmVudChldmVudCk7XG4gICAgICAgIGdlc3R1cmUoXCJkcmFnXCIsIGV2ZW50LCB0b3VjaGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaGVuZGVkKGV2ZW50KSB7XG4gICAgdmFyIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCBnZXN0dXJlO1xuXG4gICAgaWYgKHRvdWNoZW5kaW5nKSBjbGVhclRpbWVvdXQodG91Y2hlbmRpbmcpO1xuICAgIHRvdWNoZW5kaW5nID0gc2V0VGltZW91dChmdW5jdGlvbigpIHsgdG91Y2hlbmRpbmcgPSBudWxsOyB9LCA1MDApOyAvLyBHaG9zdCBjbGlja3MgYXJlIGRlbGF5ZWQhXG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKGdlc3R1cmUgPSBnZXN0dXJlc1t0b3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgICAgICBnZXN0dXJlKFwiZW5kXCIsIGV2ZW50LCB0b3VjaGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiZWZvcmVzdGFydCh0aGF0LCBjb250YWluZXIsIGV2ZW50LCBkLCBpZGVudGlmaWVyLCB0b3VjaCkge1xuICAgIHZhciBkaXNwYXRjaCA9IGxpc3RlbmVycy5jb3B5KCksXG4gICAgICAgIHAgPSBwb2ludGVyKHRvdWNoIHx8IGV2ZW50LCBjb250YWluZXIpLCBkeCwgZHksXG4gICAgICAgIHM7XG5cbiAgICBpZiAoKHMgPSBzdWJqZWN0LmNhbGwodGhhdCwgbmV3IERyYWdFdmVudChcImJlZm9yZXN0YXJ0XCIsIHtcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50LFxuICAgICAgICB0YXJnZXQ6IGRyYWcsXG4gICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgIGFjdGl2ZSxcbiAgICAgICAgeDogcFswXSxcbiAgICAgICAgeTogcFsxXSxcbiAgICAgICAgZHg6IDAsXG4gICAgICAgIGR5OiAwLFxuICAgICAgICBkaXNwYXRjaFxuICAgICAgfSksIGQpKSA9PSBudWxsKSByZXR1cm47XG5cbiAgICBkeCA9IHMueCAtIHBbMF0gfHwgMDtcbiAgICBkeSA9IHMueSAtIHBbMV0gfHwgMDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBnZXN0dXJlKHR5cGUsIGV2ZW50LCB0b3VjaCkge1xuICAgICAgdmFyIHAwID0gcCwgbjtcbiAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFwic3RhcnRcIjogZ2VzdHVyZXNbaWRlbnRpZmllcl0gPSBnZXN0dXJlLCBuID0gYWN0aXZlKys7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiZW5kXCI6IGRlbGV0ZSBnZXN0dXJlc1tpZGVudGlmaWVyXSwgLS1hY3RpdmU7IC8vIGZhbGxzIHRocm91Z2hcbiAgICAgICAgY2FzZSBcImRyYWdcIjogcCA9IHBvaW50ZXIodG91Y2ggfHwgZXZlbnQsIGNvbnRhaW5lciksIG4gPSBhY3RpdmU7IGJyZWFrO1xuICAgICAgfVxuICAgICAgZGlzcGF0Y2guY2FsbChcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdGhhdCxcbiAgICAgICAgbmV3IERyYWdFdmVudCh0eXBlLCB7XG4gICAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIHN1YmplY3Q6IHMsXG4gICAgICAgICAgdGFyZ2V0OiBkcmFnLFxuICAgICAgICAgIGlkZW50aWZpZXIsXG4gICAgICAgICAgYWN0aXZlOiBuLFxuICAgICAgICAgIHg6IHBbMF0gKyBkeCxcbiAgICAgICAgICB5OiBwWzFdICsgZHksXG4gICAgICAgICAgZHg6IHBbMF0gLSBwMFswXSxcbiAgICAgICAgICBkeTogcFsxXSAtIHAwWzFdLFxuICAgICAgICAgIGRpc3BhdGNoXG4gICAgICAgIH0pLFxuICAgICAgICBkXG4gICAgICApO1xuICAgIH07XG4gIH1cblxuICBkcmFnLmZpbHRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmaWx0ZXIgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIGRyYWcpIDogZmlsdGVyO1xuICB9O1xuXG4gIGRyYWcuY29udGFpbmVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNvbnRhaW5lciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoXyksIGRyYWcpIDogY29udGFpbmVyO1xuICB9O1xuXG4gIGRyYWcuc3ViamVjdCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzdWJqZWN0ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudChfKSwgZHJhZykgOiBzdWJqZWN0O1xuICB9O1xuXG4gIGRyYWcudG91Y2hhYmxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoYWJsZSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgZHJhZykgOiB0b3VjaGFibGU7XG4gIH07XG5cbiAgZHJhZy5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGxpc3RlbmVycy5vbi5hcHBseShsaXN0ZW5lcnMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBsaXN0ZW5lcnMgPyBkcmFnIDogdmFsdWU7XG4gIH07XG5cbiAgZHJhZy5jbGlja0Rpc3RhbmNlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsaWNrRGlzdGFuY2UyID0gKF8gPSArXykgKiBfLCBkcmFnKSA6IE1hdGguc3FydChjbGlja0Rpc3RhbmNlMik7XG4gIH07XG5cbiAgcmV0dXJuIGRyYWc7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29uc3RydWN0b3IsIGZhY3RvcnksIHByb3RvdHlwZSkge1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBmYWN0b3J5LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgcHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQocGFyZW50LCBkZWZpbml0aW9uKSB7XG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHBhcmVudC5wcm90b3R5cGUpO1xuICBmb3IgKHZhciBrZXkgaW4gZGVmaW5pdGlvbikgcHJvdG90eXBlW2tleV0gPSBkZWZpbml0aW9uW2tleV07XG4gIHJldHVybiBwcm90b3R5cGU7XG59XG4iLCAiaW1wb3J0IGRlZmluZSwge2V4dGVuZH0gZnJvbSBcIi4vZGVmaW5lLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2xvcigpIHt9XG5cbmV4cG9ydCB2YXIgZGFya2VyID0gMC43O1xuZXhwb3J0IHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbnZhciByZUkgPSBcIlxcXFxzKihbKy1dP1xcXFxkKylcXFxccypcIixcbiAgICByZU4gPSBcIlxcXFxzKihbKy1dPyg/OlxcXFxkKlxcXFwuKT9cXFxcZCsoPzpbZUVdWystXT9cXFxcZCspPylcXFxccypcIixcbiAgICByZVAgPSBcIlxcXFxzKihbKy1dPyg/OlxcXFxkKlxcXFwuKT9cXFxcZCsoPzpbZUVdWystXT9cXFxcZCspPyklXFxcXHMqXCIsXG4gICAgcmVIZXggPSAvXiMoWzAtOWEtZl17Myw4fSkkLyxcbiAgICByZVJnYkludGVnZXIgPSBuZXcgUmVnRXhwKGBecmdiXFxcXCgke3JlSX0sJHtyZUl9LCR7cmVJfVxcXFwpJGApLFxuICAgIHJlUmdiUGVyY2VudCA9IG5ldyBSZWdFeHAoYF5yZ2JcXFxcKCR7cmVQfSwke3JlUH0sJHtyZVB9XFxcXCkkYCksXG4gICAgcmVSZ2JhSW50ZWdlciA9IG5ldyBSZWdFeHAoYF5yZ2JhXFxcXCgke3JlSX0sJHtyZUl9LCR7cmVJfSwke3JlTn1cXFxcKSRgKSxcbiAgICByZVJnYmFQZXJjZW50ID0gbmV3IFJlZ0V4cChgXnJnYmFcXFxcKCR7cmVQfSwke3JlUH0sJHtyZVB9LCR7cmVOfVxcXFwpJGApLFxuICAgIHJlSHNsUGVyY2VudCA9IG5ldyBSZWdFeHAoYF5oc2xcXFxcKCR7cmVOfSwke3JlUH0sJHtyZVB9XFxcXCkkYCksXG4gICAgcmVIc2xhUGVyY2VudCA9IG5ldyBSZWdFeHAoYF5oc2xhXFxcXCgke3JlTn0sJHtyZVB9LCR7cmVQfSwke3JlTn1cXFxcKSRgKTtcblxudmFyIG5hbWVkID0ge1xuICBhbGljZWJsdWU6IDB4ZjBmOGZmLFxuICBhbnRpcXVld2hpdGU6IDB4ZmFlYmQ3LFxuICBhcXVhOiAweDAwZmZmZixcbiAgYXF1YW1hcmluZTogMHg3ZmZmZDQsXG4gIGF6dXJlOiAweGYwZmZmZixcbiAgYmVpZ2U6IDB4ZjVmNWRjLFxuICBiaXNxdWU6IDB4ZmZlNGM0LFxuICBibGFjazogMHgwMDAwMDAsXG4gIGJsYW5jaGVkYWxtb25kOiAweGZmZWJjZCxcbiAgYmx1ZTogMHgwMDAwZmYsXG4gIGJsdWV2aW9sZXQ6IDB4OGEyYmUyLFxuICBicm93bjogMHhhNTJhMmEsXG4gIGJ1cmx5d29vZDogMHhkZWI4ODcsXG4gIGNhZGV0Ymx1ZTogMHg1ZjllYTAsXG4gIGNoYXJ0cmV1c2U6IDB4N2ZmZjAwLFxuICBjaG9jb2xhdGU6IDB4ZDI2OTFlLFxuICBjb3JhbDogMHhmZjdmNTAsXG4gIGNvcm5mbG93ZXJibHVlOiAweDY0OTVlZCxcbiAgY29ybnNpbGs6IDB4ZmZmOGRjLFxuICBjcmltc29uOiAweGRjMTQzYyxcbiAgY3lhbjogMHgwMGZmZmYsXG4gIGRhcmtibHVlOiAweDAwMDA4YixcbiAgZGFya2N5YW46IDB4MDA4YjhiLFxuICBkYXJrZ29sZGVucm9kOiAweGI4ODYwYixcbiAgZGFya2dyYXk6IDB4YTlhOWE5LFxuICBkYXJrZ3JlZW46IDB4MDA2NDAwLFxuICBkYXJrZ3JleTogMHhhOWE5YTksXG4gIGRhcmtraGFraTogMHhiZGI3NmIsXG4gIGRhcmttYWdlbnRhOiAweDhiMDA4YixcbiAgZGFya29saXZlZ3JlZW46IDB4NTU2YjJmLFxuICBkYXJrb3JhbmdlOiAweGZmOGMwMCxcbiAgZGFya29yY2hpZDogMHg5OTMyY2MsXG4gIGRhcmtyZWQ6IDB4OGIwMDAwLFxuICBkYXJrc2FsbW9uOiAweGU5OTY3YSxcbiAgZGFya3NlYWdyZWVuOiAweDhmYmM4ZixcbiAgZGFya3NsYXRlYmx1ZTogMHg0ODNkOGIsXG4gIGRhcmtzbGF0ZWdyYXk6IDB4MmY0ZjRmLFxuICBkYXJrc2xhdGVncmV5OiAweDJmNGY0ZixcbiAgZGFya3R1cnF1b2lzZTogMHgwMGNlZDEsXG4gIGRhcmt2aW9sZXQ6IDB4OTQwMGQzLFxuICBkZWVwcGluazogMHhmZjE0OTMsXG4gIGRlZXBza3libHVlOiAweDAwYmZmZixcbiAgZGltZ3JheTogMHg2OTY5NjksXG4gIGRpbWdyZXk6IDB4Njk2OTY5LFxuICBkb2RnZXJibHVlOiAweDFlOTBmZixcbiAgZmlyZWJyaWNrOiAweGIyMjIyMixcbiAgZmxvcmFsd2hpdGU6IDB4ZmZmYWYwLFxuICBmb3Jlc3RncmVlbjogMHgyMjhiMjIsXG4gIGZ1Y2hzaWE6IDB4ZmYwMGZmLFxuICBnYWluc2Jvcm86IDB4ZGNkY2RjLFxuICBnaG9zdHdoaXRlOiAweGY4ZjhmZixcbiAgZ29sZDogMHhmZmQ3MDAsXG4gIGdvbGRlbnJvZDogMHhkYWE1MjAsXG4gIGdyYXk6IDB4ODA4MDgwLFxuICBncmVlbjogMHgwMDgwMDAsXG4gIGdyZWVueWVsbG93OiAweGFkZmYyZixcbiAgZ3JleTogMHg4MDgwODAsXG4gIGhvbmV5ZGV3OiAweGYwZmZmMCxcbiAgaG90cGluazogMHhmZjY5YjQsXG4gIGluZGlhbnJlZDogMHhjZDVjNWMsXG4gIGluZGlnbzogMHg0YjAwODIsXG4gIGl2b3J5OiAweGZmZmZmMCxcbiAga2hha2k6IDB4ZjBlNjhjLFxuICBsYXZlbmRlcjogMHhlNmU2ZmEsXG4gIGxhdmVuZGVyYmx1c2g6IDB4ZmZmMGY1LFxuICBsYXduZ3JlZW46IDB4N2NmYzAwLFxuICBsZW1vbmNoaWZmb246IDB4ZmZmYWNkLFxuICBsaWdodGJsdWU6IDB4YWRkOGU2LFxuICBsaWdodGNvcmFsOiAweGYwODA4MCxcbiAgbGlnaHRjeWFuOiAweGUwZmZmZixcbiAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IDB4ZmFmYWQyLFxuICBsaWdodGdyYXk6IDB4ZDNkM2QzLFxuICBsaWdodGdyZWVuOiAweDkwZWU5MCxcbiAgbGlnaHRncmV5OiAweGQzZDNkMyxcbiAgbGlnaHRwaW5rOiAweGZmYjZjMSxcbiAgbGlnaHRzYWxtb246IDB4ZmZhMDdhLFxuICBsaWdodHNlYWdyZWVuOiAweDIwYjJhYSxcbiAgbGlnaHRza3libHVlOiAweDg3Y2VmYSxcbiAgbGlnaHRzbGF0ZWdyYXk6IDB4Nzc4ODk5LFxuICBsaWdodHNsYXRlZ3JleTogMHg3Nzg4OTksXG4gIGxpZ2h0c3RlZWxibHVlOiAweGIwYzRkZSxcbiAgbGlnaHR5ZWxsb3c6IDB4ZmZmZmUwLFxuICBsaW1lOiAweDAwZmYwMCxcbiAgbGltZWdyZWVuOiAweDMyY2QzMixcbiAgbGluZW46IDB4ZmFmMGU2LFxuICBtYWdlbnRhOiAweGZmMDBmZixcbiAgbWFyb29uOiAweDgwMDAwMCxcbiAgbWVkaXVtYXF1YW1hcmluZTogMHg2NmNkYWEsXG4gIG1lZGl1bWJsdWU6IDB4MDAwMGNkLFxuICBtZWRpdW1vcmNoaWQ6IDB4YmE1NWQzLFxuICBtZWRpdW1wdXJwbGU6IDB4OTM3MGRiLFxuICBtZWRpdW1zZWFncmVlbjogMHgzY2IzNzEsXG4gIG1lZGl1bXNsYXRlYmx1ZTogMHg3YjY4ZWUsXG4gIG1lZGl1bXNwcmluZ2dyZWVuOiAweDAwZmE5YSxcbiAgbWVkaXVtdHVycXVvaXNlOiAweDQ4ZDFjYyxcbiAgbWVkaXVtdmlvbGV0cmVkOiAweGM3MTU4NSxcbiAgbWlkbmlnaHRibHVlOiAweDE5MTk3MCxcbiAgbWludGNyZWFtOiAweGY1ZmZmYSxcbiAgbWlzdHlyb3NlOiAweGZmZTRlMSxcbiAgbW9jY2FzaW46IDB4ZmZlNGI1LFxuICBuYXZham93aGl0ZTogMHhmZmRlYWQsXG4gIG5hdnk6IDB4MDAwMDgwLFxuICBvbGRsYWNlOiAweGZkZjVlNixcbiAgb2xpdmU6IDB4ODA4MDAwLFxuICBvbGl2ZWRyYWI6IDB4NmI4ZTIzLFxuICBvcmFuZ2U6IDB4ZmZhNTAwLFxuICBvcmFuZ2VyZWQ6IDB4ZmY0NTAwLFxuICBvcmNoaWQ6IDB4ZGE3MGQ2LFxuICBwYWxlZ29sZGVucm9kOiAweGVlZThhYSxcbiAgcGFsZWdyZWVuOiAweDk4ZmI5OCxcbiAgcGFsZXR1cnF1b2lzZTogMHhhZmVlZWUsXG4gIHBhbGV2aW9sZXRyZWQ6IDB4ZGI3MDkzLFxuICBwYXBheWF3aGlwOiAweGZmZWZkNSxcbiAgcGVhY2hwdWZmOiAweGZmZGFiOSxcbiAgcGVydTogMHhjZDg1M2YsXG4gIHBpbms6IDB4ZmZjMGNiLFxuICBwbHVtOiAweGRkYTBkZCxcbiAgcG93ZGVyYmx1ZTogMHhiMGUwZTYsXG4gIHB1cnBsZTogMHg4MDAwODAsXG4gIHJlYmVjY2FwdXJwbGU6IDB4NjYzMzk5LFxuICByZWQ6IDB4ZmYwMDAwLFxuICByb3N5YnJvd246IDB4YmM4ZjhmLFxuICByb3lhbGJsdWU6IDB4NDE2OWUxLFxuICBzYWRkbGVicm93bjogMHg4YjQ1MTMsXG4gIHNhbG1vbjogMHhmYTgwNzIsXG4gIHNhbmR5YnJvd246IDB4ZjRhNDYwLFxuICBzZWFncmVlbjogMHgyZThiNTcsXG4gIHNlYXNoZWxsOiAweGZmZjVlZSxcbiAgc2llbm5hOiAweGEwNTIyZCxcbiAgc2lsdmVyOiAweGMwYzBjMCxcbiAgc2t5Ymx1ZTogMHg4N2NlZWIsXG4gIHNsYXRlYmx1ZTogMHg2YTVhY2QsXG4gIHNsYXRlZ3JheTogMHg3MDgwOTAsXG4gIHNsYXRlZ3JleTogMHg3MDgwOTAsXG4gIHNub3c6IDB4ZmZmYWZhLFxuICBzcHJpbmdncmVlbjogMHgwMGZmN2YsXG4gIHN0ZWVsYmx1ZTogMHg0NjgyYjQsXG4gIHRhbjogMHhkMmI0OGMsXG4gIHRlYWw6IDB4MDA4MDgwLFxuICB0aGlzdGxlOiAweGQ4YmZkOCxcbiAgdG9tYXRvOiAweGZmNjM0NyxcbiAgdHVycXVvaXNlOiAweDQwZTBkMCxcbiAgdmlvbGV0OiAweGVlODJlZSxcbiAgd2hlYXQ6IDB4ZjVkZWIzLFxuICB3aGl0ZTogMHhmZmZmZmYsXG4gIHdoaXRlc21va2U6IDB4ZjVmNWY1LFxuICB5ZWxsb3c6IDB4ZmZmZjAwLFxuICB5ZWxsb3dncmVlbjogMHg5YWNkMzJcbn07XG5cbmRlZmluZShDb2xvciwgY29sb3IsIHtcbiAgY29weShjaGFubmVscykge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLmNvbnN0cnVjdG9yLCB0aGlzLCBjaGFubmVscyk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLnJnYigpLmRpc3BsYXlhYmxlKCk7XG4gIH0sXG4gIGhleDogY29sb3JfZm9ybWF0SGV4LCAvLyBEZXByZWNhdGVkISBVc2UgY29sb3IuZm9ybWF0SGV4LlxuICBmb3JtYXRIZXg6IGNvbG9yX2Zvcm1hdEhleCxcbiAgZm9ybWF0SGV4ODogY29sb3JfZm9ybWF0SGV4OCxcbiAgZm9ybWF0SHNsOiBjb2xvcl9mb3JtYXRIc2wsXG4gIGZvcm1hdFJnYjogY29sb3JfZm9ybWF0UmdiLFxuICB0b1N0cmluZzogY29sb3JfZm9ybWF0UmdiXG59KTtcblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0SGV4KCkge1xuICByZXR1cm4gdGhpcy5yZ2IoKS5mb3JtYXRIZXgoKTtcbn1cblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0SGV4OCgpIHtcbiAgcmV0dXJuIHRoaXMucmdiKCkuZm9ybWF0SGV4OCgpO1xufVxuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRIc2woKSB7XG4gIHJldHVybiBoc2xDb252ZXJ0KHRoaXMpLmZvcm1hdEhzbCgpO1xufVxuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRSZ2IoKSB7XG4gIHJldHVybiB0aGlzLnJnYigpLmZvcm1hdFJnYigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb2xvcihmb3JtYXQpIHtcbiAgdmFyIG0sIGw7XG4gIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIChtID0gcmVIZXguZXhlYyhmb3JtYXQpKSA/IChsID0gbVsxXS5sZW5ndGgsIG0gPSBwYXJzZUludChtWzFdLCAxNiksIGwgPT09IDYgPyByZ2JuKG0pIC8vICNmZjAwMDBcbiAgICAgIDogbCA9PT0gMyA/IG5ldyBSZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHhmMCksIChtID4+IDQgJiAweGYpIHwgKG0gJiAweGYwKSwgKChtICYgMHhmKSA8PCA0KSB8IChtICYgMHhmKSwgMSkgLy8gI2YwMFxuICAgICAgOiBsID09PSA4ID8gcmdiYShtID4+IDI0ICYgMHhmZiwgbSA+PiAxNiAmIDB4ZmYsIG0gPj4gOCAmIDB4ZmYsIChtICYgMHhmZikgLyAweGZmKSAvLyAjZmYwMDAwMDBcbiAgICAgIDogbCA9PT0gNCA/IHJnYmEoKG0gPj4gMTIgJiAweGYpIHwgKG0gPj4gOCAmIDB4ZjApLCAobSA+PiA4ICYgMHhmKSB8IChtID4+IDQgJiAweGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKChtICYgMHhmKSA8PCA0KSB8IChtICYgMHhmKSkgLyAweGZmKSAvLyAjZjAwMFxuICAgICAgOiBudWxsKSAvLyBpbnZhbGlkIGhleFxuICAgICAgOiAobSA9IHJlUmdiSW50ZWdlci5leGVjKGZvcm1hdCkpID8gbmV3IFJnYihtWzFdLCBtWzJdLCBtWzNdLCAxKSAvLyByZ2IoMjU1LCAwLCAwKVxuICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gbmV3IFJnYihtWzFdICogMjU1IC8gMTAwLCBtWzJdICogMjU1IC8gMTAwLCBtWzNdICogMjU1IC8gMTAwLCAxKSAvLyByZ2IoMTAwJSwgMCUsIDAlKVxuICAgICAgOiAobSA9IHJlUmdiYUludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSwgbVsyXSwgbVszXSwgbVs0XSkgLy8gcmdiYSgyNTUsIDAsIDAsIDEpXG4gICAgICA6IChtID0gcmVSZ2JhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiYShtWzFdICogMjU1IC8gMTAwLCBtWzJdICogMjU1IC8gMTAwLCBtWzNdICogMjU1IC8gMTAwLCBtWzRdKSAvLyByZ2IoMTAwJSwgMCUsIDAlLCAxKVxuICAgICAgOiAobSA9IHJlSHNsUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCAxKSAvLyBoc2woMTIwLCA1MCUsIDUwJSlcbiAgICAgIDogKG0gPSByZUhzbGFQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2xhKG1bMV0sIG1bMl0gLyAxMDAsIG1bM10gLyAxMDAsIG1bNF0pIC8vIGhzbGEoMTIwLCA1MCUsIDUwJSwgMSlcbiAgICAgIDogbmFtZWQuaGFzT3duUHJvcGVydHkoZm9ybWF0KSA/IHJnYm4obmFtZWRbZm9ybWF0XSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICAgIDogZm9ybWF0ID09PSBcInRyYW5zcGFyZW50XCIgPyBuZXcgUmdiKE5hTiwgTmFOLCBOYU4sIDApXG4gICAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIHJnYm4obikge1xuICByZXR1cm4gbmV3IFJnYihuID4+IDE2ICYgMHhmZiwgbiA+PiA4ICYgMHhmZiwgbiAmIDB4ZmYsIDEpO1xufVxuXG5mdW5jdGlvbiByZ2JhKHIsIGcsIGIsIGEpIHtcbiAgaWYgKGEgPD0gMCkgciA9IGcgPSBiID0gTmFOO1xuICByZXR1cm4gbmV3IFJnYihyLCBnLCBiLCBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYkNvbnZlcnQobykge1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBSZ2I7XG4gIG8gPSBvLnJnYigpO1xuICByZXR1cm4gbmV3IFJnYihvLnIsIG8uZywgby5iLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyByZ2JDb252ZXJ0KHIpIDogbmV3IFJnYihyLCBnLCBiLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBSZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICB0aGlzLnIgPSArcjtcbiAgdGhpcy5nID0gK2c7XG4gIHRoaXMuYiA9ICtiO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKFJnYiwgcmdiLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY2xhbXAoKSB7XG4gICAgcmV0dXJuIG5ldyBSZ2IoY2xhbXBpKHRoaXMuciksIGNsYW1waSh0aGlzLmcpLCBjbGFtcGkodGhpcy5iKSwgY2xhbXBhKHRoaXMub3BhY2l0eSkpO1xuICB9LFxuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gKC0wLjUgPD0gdGhpcy5yICYmIHRoaXMuciA8IDI1NS41KVxuICAgICAgICAmJiAoLTAuNSA8PSB0aGlzLmcgJiYgdGhpcy5nIDwgMjU1LjUpXG4gICAgICAgICYmICgtMC41IDw9IHRoaXMuYiAmJiB0aGlzLmIgPCAyNTUuNSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgaGV4OiByZ2JfZm9ybWF0SGV4LCAvLyBEZXByZWNhdGVkISBVc2UgY29sb3IuZm9ybWF0SGV4LlxuICBmb3JtYXRIZXg6IHJnYl9mb3JtYXRIZXgsXG4gIGZvcm1hdEhleDg6IHJnYl9mb3JtYXRIZXg4LFxuICBmb3JtYXRSZ2I6IHJnYl9mb3JtYXRSZ2IsXG4gIHRvU3RyaW5nOiByZ2JfZm9ybWF0UmdiXG59KSk7XG5cbmZ1bmN0aW9uIHJnYl9mb3JtYXRIZXgoKSB7XG4gIHJldHVybiBgIyR7aGV4KHRoaXMucil9JHtoZXgodGhpcy5nKX0ke2hleCh0aGlzLmIpfWA7XG59XG5cbmZ1bmN0aW9uIHJnYl9mb3JtYXRIZXg4KCkge1xuICByZXR1cm4gYCMke2hleCh0aGlzLnIpfSR7aGV4KHRoaXMuZyl9JHtoZXgodGhpcy5iKX0ke2hleCgoaXNOYU4odGhpcy5vcGFjaXR5KSA/IDEgOiB0aGlzLm9wYWNpdHkpICogMjU1KX1gO1xufVxuXG5mdW5jdGlvbiByZ2JfZm9ybWF0UmdiKCkge1xuICBjb25zdCBhID0gY2xhbXBhKHRoaXMub3BhY2l0eSk7XG4gIHJldHVybiBgJHthID09PSAxID8gXCJyZ2IoXCIgOiBcInJnYmEoXCJ9JHtjbGFtcGkodGhpcy5yKX0sICR7Y2xhbXBpKHRoaXMuZyl9LCAke2NsYW1waSh0aGlzLmIpfSR7YSA9PT0gMSA/IFwiKVwiIDogYCwgJHthfSlgfWA7XG59XG5cbmZ1bmN0aW9uIGNsYW1wYShvcGFjaXR5KSB7XG4gIHJldHVybiBpc05hTihvcGFjaXR5KSA/IDEgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBvcGFjaXR5KSk7XG59XG5cbmZ1bmN0aW9uIGNsYW1waSh2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBNYXRoLnJvdW5kKHZhbHVlKSB8fCAwKSk7XG59XG5cbmZ1bmN0aW9uIGhleCh2YWx1ZSkge1xuICB2YWx1ZSA9IGNsYW1waSh2YWx1ZSk7XG4gIHJldHVybiAodmFsdWUgPCAxNiA/IFwiMFwiIDogXCJcIikgKyB2YWx1ZS50b1N0cmluZygxNik7XG59XG5cbmZ1bmN0aW9uIGhzbGEoaCwgcywgbCwgYSkge1xuICBpZiAoYSA8PSAwKSBoID0gcyA9IGwgPSBOYU47XG4gIGVsc2UgaWYgKGwgPD0gMCB8fCBsID49IDEpIGggPSBzID0gTmFOO1xuICBlbHNlIGlmIChzIDw9IDApIGggPSBOYU47XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsQ29udmVydChvKSB7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbmV3IEhzbChvLmgsIG8ucywgby5sLCBvLm9wYWNpdHkpO1xuICBpZiAoIShvIGluc3RhbmNlb2YgQ29sb3IpKSBvID0gY29sb3Iobyk7XG4gIGlmICghbykgcmV0dXJuIG5ldyBIc2w7XG4gIGlmIChvIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gbztcbiAgbyA9IG8ucmdiKCk7XG4gIHZhciByID0gby5yIC8gMjU1LFxuICAgICAgZyA9IG8uZyAvIDI1NSxcbiAgICAgIGIgPSBvLmIgLyAyNTUsXG4gICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgaCA9IE5hTixcbiAgICAgIHMgPSBtYXggLSBtaW4sXG4gICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICBpZiAocykge1xuICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcyArIChnIDwgYikgKiA2O1xuICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyBzICsgMjtcbiAgICBlbHNlIGggPSAociAtIGcpIC8gcyArIDQ7XG4gICAgcyAvPSBsIDwgMC41ID8gbWF4ICsgbWluIDogMiAtIG1heCAtIG1pbjtcbiAgICBoICo9IDYwO1xuICB9IGVsc2Uge1xuICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICB9XG4gIHJldHVybiBuZXcgSHNsKGgsIHMsIGwsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IGhzbENvbnZlcnQoaCkgOiBuZXcgSHNsKGgsIHMsIGwsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZnVuY3Rpb24gSHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgdGhpcy5oID0gK2g7XG4gIHRoaXMucyA9ICtzO1xuICB0aGlzLmwgPSArbDtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShIc2wsIGhzbCwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIHJnYigpIHtcbiAgICB2YXIgaCA9IHRoaXMuaCAlIDM2MCArICh0aGlzLmggPCAwKSAqIDM2MCxcbiAgICAgICAgcyA9IGlzTmFOKGgpIHx8IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zLFxuICAgICAgICBsID0gdGhpcy5sLFxuICAgICAgICBtMiA9IGwgKyAobCA8IDAuNSA/IGwgOiAxIC0gbCkgKiBzLFxuICAgICAgICBtMSA9IDIgKiBsIC0gbTI7XG4gICAgcmV0dXJuIG5ldyBSZ2IoXG4gICAgICBoc2wycmdiKGggPj0gMjQwID8gaCAtIDI0MCA6IGggKyAxMjAsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGgsIG0xLCBtMiksXG4gICAgICBoc2wycmdiKGggPCAxMjAgPyBoICsgMjQwIDogaCAtIDEyMCwgbTEsIG0yKSxcbiAgICAgIHRoaXMub3BhY2l0eVxuICAgICk7XG4gIH0sXG4gIGNsYW1wKCkge1xuICAgIHJldHVybiBuZXcgSHNsKGNsYW1waCh0aGlzLmgpLCBjbGFtcHQodGhpcy5zKSwgY2xhbXB0KHRoaXMubCksIGNsYW1wYSh0aGlzLm9wYWNpdHkpKTtcbiAgfSxcbiAgZGlzcGxheWFibGUoKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMucyAmJiB0aGlzLnMgPD0gMSB8fCBpc05hTih0aGlzLnMpKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmwgJiYgdGhpcy5sIDw9IDEpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH0sXG4gIGZvcm1hdEhzbCgpIHtcbiAgICBjb25zdCBhID0gY2xhbXBhKHRoaXMub3BhY2l0eSk7XG4gICAgcmV0dXJuIGAke2EgPT09IDEgPyBcImhzbChcIiA6IFwiaHNsYShcIn0ke2NsYW1waCh0aGlzLmgpfSwgJHtjbGFtcHQodGhpcy5zKSAqIDEwMH0lLCAke2NsYW1wdCh0aGlzLmwpICogMTAwfSUke2EgPT09IDEgPyBcIilcIiA6IGAsICR7YX0pYH1gO1xuICB9XG59KSk7XG5cbmZ1bmN0aW9uIGNsYW1waCh2YWx1ZSkge1xuICB2YWx1ZSA9ICh2YWx1ZSB8fCAwKSAlIDM2MDtcbiAgcmV0dXJuIHZhbHVlIDwgMCA/IHZhbHVlICsgMzYwIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGNsYW1wdCh2YWx1ZSkge1xuICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdmFsdWUgfHwgMCkpO1xufVxuXG4vKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG5mdW5jdGlvbiBoc2wycmdiKGgsIG0xLCBtMikge1xuICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgOiBoIDwgMjQwID8gbTEgKyAobTIgLSBtMSkgKiAoMjQwIC0gaCkgLyA2MFxuICAgICAgOiBtMSkgKiAyNTU7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGJhc2lzKHQxLCB2MCwgdjEsIHYyLCB2Mykge1xuICB2YXIgdDIgPSB0MSAqIHQxLCB0MyA9IHQyICogdDE7XG4gIHJldHVybiAoKDEgLSAzICogdDEgKyAzICogdDIgLSB0MykgKiB2MFxuICAgICAgKyAoNCAtIDYgKiB0MiArIDMgKiB0MykgKiB2MVxuICAgICAgKyAoMSArIDMgKiB0MSArIDMgKiB0MiAtIDMgKiB0MykgKiB2MlxuICAgICAgKyB0MyAqIHYzKSAvIDY7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGggLSAxO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHZhciBpID0gdCA8PSAwID8gKHQgPSAwKSA6IHQgPj0gMSA/ICh0ID0gMSwgbiAtIDEpIDogTWF0aC5mbG9vcih0ICogbiksXG4gICAgICAgIHYxID0gdmFsdWVzW2ldLFxuICAgICAgICB2MiA9IHZhbHVlc1tpICsgMV0sXG4gICAgICAgIHYwID0gaSA+IDAgPyB2YWx1ZXNbaSAtIDFdIDogMiAqIHYxIC0gdjIsXG4gICAgICAgIHYzID0gaSA8IG4gLSAxID8gdmFsdWVzW2kgKyAyXSA6IDIgKiB2MiAtIHYxO1xuICAgIHJldHVybiBiYXNpcygodCAtIGkgLyBuKSAqIG4sIHYwLCB2MSwgdjIsIHYzKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge2Jhc2lzfSBmcm9tIFwiLi9iYXNpcy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoO1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHZhciBpID0gTWF0aC5mbG9vcigoKHQgJT0gMSkgPCAwID8gKyt0IDogdCkgKiBuKSxcbiAgICAgICAgdjAgPSB2YWx1ZXNbKGkgKyBuIC0gMSkgJSBuXSxcbiAgICAgICAgdjEgPSB2YWx1ZXNbaSAlIG5dLFxuICAgICAgICB2MiA9IHZhbHVlc1soaSArIDEpICUgbl0sXG4gICAgICAgIHYzID0gdmFsdWVzWyhpICsgMikgJSBuXTtcbiAgICByZXR1cm4gYmFzaXMoKHQgLSBpIC8gbikgKiBuLCB2MCwgdjEsIHYyLCB2Myk7XG4gIH07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgeCA9PiAoKSA9PiB4O1xuIiwgImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuXG5mdW5jdGlvbiBsaW5lYXIoYSwgZCkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICsgdCAqIGQ7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGV4cG9uZW50aWFsKGEsIGIsIHkpIHtcbiAgcmV0dXJuIGEgPSBNYXRoLnBvdyhhLCB5KSwgYiA9IE1hdGgucG93KGIsIHkpIC0gYSwgeSA9IDEgLyB5LCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGEgKyB0ICogYiwgeSk7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBodWUoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkID4gMTgwIHx8IGQgPCAtMTgwID8gZCAtIDM2MCAqIE1hdGgucm91bmQoZCAvIDM2MCkgOiBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2FtbWEoeSkge1xuICByZXR1cm4gKHkgPSAreSkgPT09IDEgPyBub2dhbW1hIDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiIC0gYSA/IGV4cG9uZW50aWFsKGEsIGIsIHkpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vZ2FtbWEoYSwgYikge1xuICB2YXIgZCA9IGIgLSBhO1xuICByZXR1cm4gZCA/IGxpbmVhcihhLCBkKSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xufVxuIiwgImltcG9ydCB7cmdiIGFzIGNvbG9yUmdifSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCBiYXNpcyBmcm9tIFwiLi9iYXNpcy5qc1wiO1xuaW1wb3J0IGJhc2lzQ2xvc2VkIGZyb20gXCIuL2Jhc2lzQ2xvc2VkLmpzXCI7XG5pbXBvcnQgbm9nYW1tYSwge2dhbW1hfSBmcm9tIFwiLi9jb2xvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gcmdiR2FtbWEoeSkge1xuICB2YXIgY29sb3IgPSBnYW1tYSh5KTtcblxuICBmdW5jdGlvbiByZ2Ioc3RhcnQsIGVuZCkge1xuICAgIHZhciByID0gY29sb3IoKHN0YXJ0ID0gY29sb3JSZ2Ioc3RhcnQpKS5yLCAoZW5kID0gY29sb3JSZ2IoZW5kKSkuciksXG4gICAgICAgIGcgPSBjb2xvcihzdGFydC5nLCBlbmQuZyksXG4gICAgICAgIGIgPSBjb2xvcihzdGFydC5iLCBlbmQuYiksXG4gICAgICAgIG9wYWNpdHkgPSBub2dhbW1hKHN0YXJ0Lm9wYWNpdHksIGVuZC5vcGFjaXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgc3RhcnQuciA9IHIodCk7XG4gICAgICBzdGFydC5nID0gZyh0KTtcbiAgICAgIHN0YXJ0LmIgPSBiKHQpO1xuICAgICAgc3RhcnQub3BhY2l0eSA9IG9wYWNpdHkodCk7XG4gICAgICByZXR1cm4gc3RhcnQgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICByZ2IuZ2FtbWEgPSByZ2JHYW1tYTtcblxuICByZXR1cm4gcmdiO1xufSkoMSk7XG5cbmZ1bmN0aW9uIHJnYlNwbGluZShzcGxpbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbG9ycykge1xuICAgIHZhciBuID0gY29sb3JzLmxlbmd0aCxcbiAgICAgICAgciA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgZyA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgYiA9IG5ldyBBcnJheShuKSxcbiAgICAgICAgaSwgY29sb3I7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgY29sb3IgPSBjb2xvclJnYihjb2xvcnNbaV0pO1xuICAgICAgcltpXSA9IGNvbG9yLnIgfHwgMDtcbiAgICAgIGdbaV0gPSBjb2xvci5nIHx8IDA7XG4gICAgICBiW2ldID0gY29sb3IuYiB8fCAwO1xuICAgIH1cbiAgICByID0gc3BsaW5lKHIpO1xuICAgIGcgPSBzcGxpbmUoZyk7XG4gICAgYiA9IHNwbGluZShiKTtcbiAgICBjb2xvci5vcGFjaXR5ID0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgY29sb3IuciA9IHIodCk7XG4gICAgICBjb2xvci5nID0gZyh0KTtcbiAgICAgIGNvbG9yLmIgPSBiKHQpO1xuICAgICAgcmV0dXJuIGNvbG9yICsgXCJcIjtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnQgdmFyIHJnYkJhc2lzID0gcmdiU3BsaW5lKGJhc2lzKTtcbmV4cG9ydCB2YXIgcmdiQmFzaXNDbG9zZWQgPSByZ2JTcGxpbmUoYmFzaXNDbG9zZWQpO1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPSArYSwgYiA9ICtiLCBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGEgKiAoMSAtIHQpICsgYiAqIHQ7XG4gIH07XG59XG4iLCAiaW1wb3J0IG51bWJlciBmcm9tIFwiLi9udW1iZXIuanNcIjtcblxudmFyIHJlQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZyxcbiAgICByZUIgPSBuZXcgUmVnRXhwKHJlQS5zb3VyY2UsIFwiZ1wiKTtcblxuZnVuY3Rpb24gemVybyhiKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25lKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYih0KSArIFwiXCI7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIGJpID0gcmVBLmxhc3RJbmRleCA9IHJlQi5sYXN0SW5kZXggPSAwLCAvLyBzY2FuIGluZGV4IGZvciBuZXh0IG51bWJlciBpbiBiXG4gICAgICBhbSwgLy8gY3VycmVudCBtYXRjaCBpbiBhXG4gICAgICBibSwgLy8gY3VycmVudCBtYXRjaCBpbiBiXG4gICAgICBicywgLy8gc3RyaW5nIHByZWNlZGluZyBjdXJyZW50IG51bWJlciBpbiBiLCBpZiBhbnlcbiAgICAgIGkgPSAtMSwgLy8gaW5kZXggaW4gc1xuICAgICAgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgIHEgPSBbXTsgLy8gbnVtYmVyIGludGVycG9sYXRvcnNcblxuICAvLyBDb2VyY2UgaW5wdXRzIHRvIHN0cmluZ3MuXG4gIGEgPSBhICsgXCJcIiwgYiA9IGIgKyBcIlwiO1xuXG4gIC8vIEludGVycG9sYXRlIHBhaXJzIG9mIG51bWJlcnMgaW4gYSAmIGIuXG4gIHdoaWxlICgoYW0gPSByZUEuZXhlYyhhKSlcbiAgICAgICYmIChibSA9IHJlQi5leGVjKGIpKSkge1xuICAgIGlmICgoYnMgPSBibS5pbmRleCkgPiBiaSkgeyAvLyBhIHN0cmluZyBwcmVjZWRlcyB0aGUgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYnMgPSBiLnNsaWNlKGJpLCBicyk7XG4gICAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gICAgfVxuICAgIGlmICgoYW0gPSBhbVswXSkgPT09IChibSA9IGJtWzBdKSkgeyAvLyBudW1iZXJzIGluIGEgJiBiIG1hdGNoXG4gICAgICBpZiAoc1tpXSkgc1tpXSArPSBibTsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgIGVsc2Ugc1srK2ldID0gYm07XG4gICAgfSBlbHNlIHsgLy8gaW50ZXJwb2xhdGUgbm9uLW1hdGNoaW5nIG51bWJlcnNcbiAgICAgIHNbKytpXSA9IG51bGw7XG4gICAgICBxLnB1c2goe2k6IGksIHg6IG51bWJlcihhbSwgYm0pfSk7XG4gICAgfVxuICAgIGJpID0gcmVCLmxhc3RJbmRleDtcbiAgfVxuXG4gIC8vIEFkZCByZW1haW5zIG9mIGIuXG4gIGlmIChiaSA8IGIubGVuZ3RoKSB7XG4gICAgYnMgPSBiLnNsaWNlKGJpKTtcbiAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICBlbHNlIHNbKytpXSA9IGJzO1xuICB9XG5cbiAgLy8gU3BlY2lhbCBvcHRpbWl6YXRpb24gZm9yIG9ubHkgYSBzaW5nbGUgbWF0Y2guXG4gIC8vIE90aGVyd2lzZSwgaW50ZXJwb2xhdGUgZWFjaCBvZiB0aGUgbnVtYmVycyBhbmQgcmVqb2luIHRoZSBzdHJpbmcuXG4gIHJldHVybiBzLmxlbmd0aCA8IDIgPyAocVswXVxuICAgICAgPyBvbmUocVswXS54KVxuICAgICAgOiB6ZXJvKGIpKVxuICAgICAgOiAoYiA9IHEubGVuZ3RoLCBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG87IGkgPCBiOyArK2kpIHNbKG8gPSBxW2ldKS5pXSA9IG8ueCh0KTtcbiAgICAgICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgICAgICB9KTtcbn1cbiIsICJ2YXIgZGVncmVlcyA9IDE4MCAvIE1hdGguUEk7XG5cbmV4cG9ydCB2YXIgaWRlbnRpdHkgPSB7XG4gIHRyYW5zbGF0ZVg6IDAsXG4gIHRyYW5zbGF0ZVk6IDAsXG4gIHJvdGF0ZTogMCxcbiAgc2tld1g6IDAsXG4gIHNjYWxlWDogMSxcbiAgc2NhbGVZOiAxXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIHZhciBzY2FsZVgsIHNjYWxlWSwgc2tld1g7XG4gIGlmIChzY2FsZVggPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYikpIGEgLz0gc2NhbGVYLCBiIC89IHNjYWxlWDtcbiAgaWYgKHNrZXdYID0gYSAqIGMgKyBiICogZCkgYyAtPSBhICogc2tld1gsIGQgLT0gYiAqIHNrZXdYO1xuICBpZiAoc2NhbGVZID0gTWF0aC5zcXJ0KGMgKiBjICsgZCAqIGQpKSBjIC89IHNjYWxlWSwgZCAvPSBzY2FsZVksIHNrZXdYIC89IHNjYWxlWTtcbiAgaWYgKGEgKiBkIDwgYiAqIGMpIGEgPSAtYSwgYiA9IC1iLCBza2V3WCA9IC1za2V3WCwgc2NhbGVYID0gLXNjYWxlWDtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2xhdGVYOiBlLFxuICAgIHRyYW5zbGF0ZVk6IGYsXG4gICAgcm90YXRlOiBNYXRoLmF0YW4yKGIsIGEpICogZGVncmVlcyxcbiAgICBza2V3WDogTWF0aC5hdGFuKHNrZXdYKSAqIGRlZ3JlZXMsXG4gICAgc2NhbGVYOiBzY2FsZVgsXG4gICAgc2NhbGVZOiBzY2FsZVlcbiAgfTtcbn1cbiIsICJpbXBvcnQgZGVjb21wb3NlLCB7aWRlbnRpdHl9IGZyb20gXCIuL2RlY29tcG9zZS5qc1wiO1xuXG52YXIgc3ZnTm9kZTtcblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNzcyh2YWx1ZSkge1xuICBjb25zdCBtID0gbmV3ICh0eXBlb2YgRE9NTWF0cml4ID09PSBcImZ1bmN0aW9uXCIgPyBET01NYXRyaXggOiBXZWJLaXRDU1NNYXRyaXgpKHZhbHVlICsgXCJcIik7XG4gIHJldHVybiBtLmlzSWRlbnRpdHkgPyBpZGVudGl0eSA6IGRlY29tcG9zZShtLmEsIG0uYiwgbS5jLCBtLmQsIG0uZSwgbS5mKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU3ZnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gaWRlbnRpdHk7XG4gIGlmICghc3ZnTm9kZSkgc3ZnTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwiZ1wiKTtcbiAgc3ZnTm9kZS5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgdmFsdWUpO1xuICBpZiAoISh2YWx1ZSA9IHN2Z05vZGUudHJhbnNmb3JtLmJhc2VWYWwuY29uc29saWRhdGUoKSkpIHJldHVybiBpZGVudGl0eTtcbiAgdmFsdWUgPSB2YWx1ZS5tYXRyaXg7XG4gIHJldHVybiBkZWNvbXBvc2UodmFsdWUuYSwgdmFsdWUuYiwgdmFsdWUuYywgdmFsdWUuZCwgdmFsdWUuZSwgdmFsdWUuZik7XG59XG4iLCAiaW1wb3J0IG51bWJlciBmcm9tIFwiLi4vbnVtYmVyLmpzXCI7XG5pbXBvcnQge3BhcnNlQ3NzLCBwYXJzZVN2Z30gZnJvbSBcIi4vcGFyc2UuanNcIjtcblxuZnVuY3Rpb24gaW50ZXJwb2xhdGVUcmFuc2Zvcm0ocGFyc2UsIHB4Q29tbWEsIHB4UGFyZW4sIGRlZ1BhcmVuKSB7XG5cbiAgZnVuY3Rpb24gcG9wKHMpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPyBzLnBvcCgpICsgXCIgXCIgOiBcIlwiO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhbnNsYXRlKHhhLCB5YSwgeGIsIHliLCBzLCBxKSB7XG4gICAgaWYgKHhhICE9PSB4YiB8fCB5YSAhPT0geWIpIHtcbiAgICAgIHZhciBpID0gcy5wdXNoKFwidHJhbnNsYXRlKFwiLCBudWxsLCBweENvbW1hLCBudWxsLCBweFBhcmVuKTtcbiAgICAgIHEucHVzaCh7aTogaSAtIDQsIHg6IG51bWJlcih4YSwgeGIpfSwge2k6IGkgLSAyLCB4OiBudW1iZXIoeWEsIHliKX0pO1xuICAgIH0gZWxzZSBpZiAoeGIgfHwgeWIpIHtcbiAgICAgIHMucHVzaChcInRyYW5zbGF0ZShcIiArIHhiICsgcHhDb21tYSArIHliICsgcHhQYXJlbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcm90YXRlKGEsIGIsIHMsIHEpIHtcbiAgICBpZiAoYSAhPT0gYikge1xuICAgICAgaWYgKGEgLSBiID4gMTgwKSBiICs9IDM2MDsgZWxzZSBpZiAoYiAtIGEgPiAxODApIGEgKz0gMzYwOyAvLyBzaG9ydGVzdCBwYXRoXG4gICAgICBxLnB1c2goe2k6IHMucHVzaChwb3AocykgKyBcInJvdGF0ZShcIiwgbnVsbCwgZGVnUGFyZW4pIC0gMiwgeDogbnVtYmVyKGEsIGIpfSk7XG4gICAgfSBlbHNlIGlmIChiKSB7XG4gICAgICBzLnB1c2gocG9wKHMpICsgXCJyb3RhdGUoXCIgKyBiICsgZGVnUGFyZW4pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNrZXdYKGEsIGIsIHMsIHEpIHtcbiAgICBpZiAoYSAhPT0gYikge1xuICAgICAgcS5wdXNoKHtpOiBzLnB1c2gocG9wKHMpICsgXCJza2V3WChcIiwgbnVsbCwgZGVnUGFyZW4pIC0gMiwgeDogbnVtYmVyKGEsIGIpfSk7XG4gICAgfSBlbHNlIGlmIChiKSB7XG4gICAgICBzLnB1c2gocG9wKHMpICsgXCJza2V3WChcIiArIGIgKyBkZWdQYXJlbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2NhbGUoeGEsIHlhLCB4YiwgeWIsIHMsIHEpIHtcbiAgICBpZiAoeGEgIT09IHhiIHx8IHlhICE9PSB5Yikge1xuICAgICAgdmFyIGkgPSBzLnB1c2gocG9wKHMpICsgXCJzY2FsZShcIiwgbnVsbCwgXCIsXCIsIG51bGwsIFwiKVwiKTtcbiAgICAgIHEucHVzaCh7aTogaSAtIDQsIHg6IG51bWJlcih4YSwgeGIpfSwge2k6IGkgLSAyLCB4OiBudW1iZXIoeWEsIHliKX0pO1xuICAgIH0gZWxzZSBpZiAoeGIgIT09IDEgfHwgeWIgIT09IDEpIHtcbiAgICAgIHMucHVzaChwb3AocykgKyBcInNjYWxlKFwiICsgeGIgKyBcIixcIiArIHliICsgXCIpXCIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICAgIHEgPSBbXTsgLy8gbnVtYmVyIGludGVycG9sYXRvcnNcbiAgICBhID0gcGFyc2UoYSksIGIgPSBwYXJzZShiKTtcbiAgICB0cmFuc2xhdGUoYS50cmFuc2xhdGVYLCBhLnRyYW5zbGF0ZVksIGIudHJhbnNsYXRlWCwgYi50cmFuc2xhdGVZLCBzLCBxKTtcbiAgICByb3RhdGUoYS5yb3RhdGUsIGIucm90YXRlLCBzLCBxKTtcbiAgICBza2V3WChhLnNrZXdYLCBiLnNrZXdYLCBzLCBxKTtcbiAgICBzY2FsZShhLnNjYWxlWCwgYS5zY2FsZVksIGIuc2NhbGVYLCBiLnNjYWxlWSwgcywgcSk7XG4gICAgYSA9IGIgPSBudWxsOyAvLyBnY1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICB2YXIgaSA9IC0xLCBuID0gcS5sZW5ndGgsIG87XG4gICAgICB3aGlsZSAoKytpIDwgbikgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICB9O1xuICB9O1xufVxuXG5leHBvcnQgdmFyIGludGVycG9sYXRlVHJhbnNmb3JtQ3NzID0gaW50ZXJwb2xhdGVUcmFuc2Zvcm0ocGFyc2VDc3MsIFwicHgsIFwiLCBcInB4KVwiLCBcImRlZylcIik7XG5leHBvcnQgdmFyIGludGVycG9sYXRlVHJhbnNmb3JtU3ZnID0gaW50ZXJwb2xhdGVUcmFuc2Zvcm0ocGFyc2VTdmcsIFwiLCBcIiwgXCIpXCIsIFwiKVwiKTtcbiIsICJ2YXIgZXBzaWxvbjIgPSAxZS0xMjtcblxuZnVuY3Rpb24gY29zaCh4KSB7XG4gIHJldHVybiAoKHggPSBNYXRoLmV4cCh4KSkgKyAxIC8geCkgLyAyO1xufVxuXG5mdW5jdGlvbiBzaW5oKHgpIHtcbiAgcmV0dXJuICgoeCA9IE1hdGguZXhwKHgpKSAtIDEgLyB4KSAvIDI7XG59XG5cbmZ1bmN0aW9uIHRhbmgoeCkge1xuICByZXR1cm4gKCh4ID0gTWF0aC5leHAoMiAqIHgpKSAtIDEpIC8gKHggKyAxKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIHpvb21SaG8ocmhvLCByaG8yLCByaG80KSB7XG5cbiAgLy8gcDAgPSBbdXgwLCB1eTAsIHcwXVxuICAvLyBwMSA9IFt1eDEsIHV5MSwgdzFdXG4gIGZ1bmN0aW9uIHpvb20ocDAsIHAxKSB7XG4gICAgdmFyIHV4MCA9IHAwWzBdLCB1eTAgPSBwMFsxXSwgdzAgPSBwMFsyXSxcbiAgICAgICAgdXgxID0gcDFbMF0sIHV5MSA9IHAxWzFdLCB3MSA9IHAxWzJdLFxuICAgICAgICBkeCA9IHV4MSAtIHV4MCxcbiAgICAgICAgZHkgPSB1eTEgLSB1eTAsXG4gICAgICAgIGQyID0gZHggKiBkeCArIGR5ICogZHksXG4gICAgICAgIGksXG4gICAgICAgIFM7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHUwIFx1MjI0NSB1MS5cbiAgICBpZiAoZDIgPCBlcHNpbG9uMikge1xuICAgICAgUyA9IE1hdGgubG9nKHcxIC8gdzApIC8gcmhvO1xuICAgICAgaSA9IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB1eDAgKyB0ICogZHgsXG4gICAgICAgICAgdXkwICsgdCAqIGR5LFxuICAgICAgICAgIHcwICogTWF0aC5leHAocmhvICogdCAqIFMpXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhbCBjYXNlLlxuICAgIGVsc2Uge1xuICAgICAgdmFyIGQxID0gTWF0aC5zcXJ0KGQyKSxcbiAgICAgICAgICBiMCA9ICh3MSAqIHcxIC0gdzAgKiB3MCArIHJobzQgKiBkMikgLyAoMiAqIHcwICogcmhvMiAqIGQxKSxcbiAgICAgICAgICBiMSA9ICh3MSAqIHcxIC0gdzAgKiB3MCAtIHJobzQgKiBkMikgLyAoMiAqIHcxICogcmhvMiAqIGQxKSxcbiAgICAgICAgICByMCA9IE1hdGgubG9nKE1hdGguc3FydChiMCAqIGIwICsgMSkgLSBiMCksXG4gICAgICAgICAgcjEgPSBNYXRoLmxvZyhNYXRoLnNxcnQoYjEgKiBiMSArIDEpIC0gYjEpO1xuICAgICAgUyA9IChyMSAtIHIwKSAvIHJobztcbiAgICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICAgIHZhciBzID0gdCAqIFMsXG4gICAgICAgICAgICBjb3NocjAgPSBjb3NoKHIwKSxcbiAgICAgICAgICAgIHUgPSB3MCAvIChyaG8yICogZDEpICogKGNvc2hyMCAqIHRhbmgocmhvICogcyArIHIwKSAtIHNpbmgocjApKTtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB1eDAgKyB1ICogZHgsXG4gICAgICAgICAgdXkwICsgdSAqIGR5LFxuICAgICAgICAgIHcwICogY29zaHIwIC8gY29zaChyaG8gKiBzICsgcjApXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaS5kdXJhdGlvbiA9IFMgKiAxMDAwICogcmhvIC8gTWF0aC5TUVJUMjtcblxuICAgIHJldHVybiBpO1xuICB9XG5cbiAgem9vbS5yaG8gPSBmdW5jdGlvbihfKSB7XG4gICAgdmFyIF8xID0gTWF0aC5tYXgoMWUtMywgK18pLCBfMiA9IF8xICogXzEsIF80ID0gXzIgKiBfMjtcbiAgICByZXR1cm4gem9vbVJobyhfMSwgXzIsIF80KTtcbiAgfTtcblxuICByZXR1cm4gem9vbTtcbn0pKE1hdGguU1FSVDIsIDIsIDQpO1xuIiwgInZhciBmcmFtZSA9IDAsIC8vIGlzIGFuIGFuaW1hdGlvbiBmcmFtZSBwZW5kaW5nP1xuICAgIHRpbWVvdXQgPSAwLCAvLyBpcyBhIHRpbWVvdXQgcGVuZGluZz9cbiAgICBpbnRlcnZhbCA9IDAsIC8vIGFyZSBhbnkgdGltZXJzIGFjdGl2ZT9cbiAgICBwb2tlRGVsYXkgPSAxMDAwLCAvLyBob3cgZnJlcXVlbnRseSB3ZSBjaGVjayBmb3IgY2xvY2sgc2tld1xuICAgIHRhc2tIZWFkLFxuICAgIHRhc2tUYWlsLFxuICAgIGNsb2NrTGFzdCA9IDAsXG4gICAgY2xvY2tOb3cgPSAwLFxuICAgIGNsb2NrU2tldyA9IDAsXG4gICAgY2xvY2sgPSB0eXBlb2YgcGVyZm9ybWFuY2UgPT09IFwib2JqZWN0XCIgJiYgcGVyZm9ybWFuY2Uubm93ID8gcGVyZm9ybWFuY2UgOiBEYXRlLFxuICAgIHNldEZyYW1lID0gdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID8gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZS5iaW5kKHdpbmRvdykgOiBmdW5jdGlvbihmKSB7IHNldFRpbWVvdXQoZiwgMTcpOyB9O1xuXG5leHBvcnQgZnVuY3Rpb24gbm93KCkge1xuICByZXR1cm4gY2xvY2tOb3cgfHwgKHNldEZyYW1lKGNsZWFyTm93KSwgY2xvY2tOb3cgPSBjbG9jay5ub3coKSArIGNsb2NrU2tldyk7XG59XG5cbmZ1bmN0aW9uIGNsZWFyTm93KCkge1xuICBjbG9ja05vdyA9IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUaW1lcigpIHtcbiAgdGhpcy5fY2FsbCA9XG4gIHRoaXMuX3RpbWUgPVxuICB0aGlzLl9uZXh0ID0gbnVsbDtcbn1cblxuVGltZXIucHJvdG90eXBlID0gdGltZXIucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogVGltZXIsXG4gIHJlc3RhcnQ6IGZ1bmN0aW9uKGNhbGxiYWNrLCBkZWxheSwgdGltZSkge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuICAgIHRpbWUgPSAodGltZSA9PSBudWxsID8gbm93KCkgOiArdGltZSkgKyAoZGVsYXkgPT0gbnVsbCA/IDAgOiArZGVsYXkpO1xuICAgIGlmICghdGhpcy5fbmV4dCAmJiB0YXNrVGFpbCAhPT0gdGhpcykge1xuICAgICAgaWYgKHRhc2tUYWlsKSB0YXNrVGFpbC5fbmV4dCA9IHRoaXM7XG4gICAgICBlbHNlIHRhc2tIZWFkID0gdGhpcztcbiAgICAgIHRhc2tUYWlsID0gdGhpcztcbiAgICB9XG4gICAgdGhpcy5fY2FsbCA9IGNhbGxiYWNrO1xuICAgIHRoaXMuX3RpbWUgPSB0aW1lO1xuICAgIHNsZWVwKCk7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9jYWxsKSB7XG4gICAgICB0aGlzLl9jYWxsID0gbnVsbDtcbiAgICAgIHRoaXMuX3RpbWUgPSBJbmZpbml0eTtcbiAgICAgIHNsZWVwKCk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdGltZXIoY2FsbGJhY2ssIGRlbGF5LCB0aW1lKSB7XG4gIHZhciB0ID0gbmV3IFRpbWVyO1xuICB0LnJlc3RhcnQoY2FsbGJhY2ssIGRlbGF5LCB0aW1lKTtcbiAgcmV0dXJuIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lckZsdXNoKCkge1xuICBub3coKTsgLy8gR2V0IHRoZSBjdXJyZW50IHRpbWUsIGlmIG5vdCBhbHJlYWR5IHNldC5cbiAgKytmcmFtZTsgLy8gUHJldGVuZCB3ZVx1MjAxOXZlIHNldCBhbiBhbGFybSwgaWYgd2UgaGF2ZW5cdTIwMTl0IGFscmVhZHkuXG4gIHZhciB0ID0gdGFza0hlYWQsIGU7XG4gIHdoaWxlICh0KSB7XG4gICAgaWYgKChlID0gY2xvY2tOb3cgLSB0Ll90aW1lKSA+PSAwKSB0Ll9jYWxsLmNhbGwodW5kZWZpbmVkLCBlKTtcbiAgICB0ID0gdC5fbmV4dDtcbiAgfVxuICAtLWZyYW1lO1xufVxuXG5mdW5jdGlvbiB3YWtlKCkge1xuICBjbG9ja05vdyA9IChjbG9ja0xhc3QgPSBjbG9jay5ub3coKSkgKyBjbG9ja1NrZXc7XG4gIGZyYW1lID0gdGltZW91dCA9IDA7XG4gIHRyeSB7XG4gICAgdGltZXJGbHVzaCgpO1xuICB9IGZpbmFsbHkge1xuICAgIGZyYW1lID0gMDtcbiAgICBuYXAoKTtcbiAgICBjbG9ja05vdyA9IDA7XG4gIH1cbn1cblxuZnVuY3Rpb24gcG9rZSgpIHtcbiAgdmFyIG5vdyA9IGNsb2NrLm5vdygpLCBkZWxheSA9IG5vdyAtIGNsb2NrTGFzdDtcbiAgaWYgKGRlbGF5ID4gcG9rZURlbGF5KSBjbG9ja1NrZXcgLT0gZGVsYXksIGNsb2NrTGFzdCA9IG5vdztcbn1cblxuZnVuY3Rpb24gbmFwKCkge1xuICB2YXIgdDAsIHQxID0gdGFza0hlYWQsIHQyLCB0aW1lID0gSW5maW5pdHk7XG4gIHdoaWxlICh0MSkge1xuICAgIGlmICh0MS5fY2FsbCkge1xuICAgICAgaWYgKHRpbWUgPiB0MS5fdGltZSkgdGltZSA9IHQxLl90aW1lO1xuICAgICAgdDAgPSB0MSwgdDEgPSB0MS5fbmV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgdDIgPSB0MS5fbmV4dCwgdDEuX25leHQgPSBudWxsO1xuICAgICAgdDEgPSB0MCA/IHQwLl9uZXh0ID0gdDIgOiB0YXNrSGVhZCA9IHQyO1xuICAgIH1cbiAgfVxuICB0YXNrVGFpbCA9IHQwO1xuICBzbGVlcCh0aW1lKTtcbn1cblxuZnVuY3Rpb24gc2xlZXAodGltZSkge1xuICBpZiAoZnJhbWUpIHJldHVybjsgLy8gU29vbmVzdCBhbGFybSBhbHJlYWR5IHNldCwgb3Igd2lsbCBiZS5cbiAgaWYgKHRpbWVvdXQpIHRpbWVvdXQgPSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gIHZhciBkZWxheSA9IHRpbWUgLSBjbG9ja05vdzsgLy8gU3RyaWN0bHkgbGVzcyB0aGFuIGlmIHdlIHJlY29tcHV0ZWQgY2xvY2tOb3cuXG4gIGlmIChkZWxheSA+IDI0KSB7XG4gICAgaWYgKHRpbWUgPCBJbmZpbml0eSkgdGltZW91dCA9IHNldFRpbWVvdXQod2FrZSwgdGltZSAtIGNsb2NrLm5vdygpIC0gY2xvY2tTa2V3KTtcbiAgICBpZiAoaW50ZXJ2YWwpIGludGVydmFsID0gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFpbnRlcnZhbCkgY2xvY2tMYXN0ID0gY2xvY2subm93KCksIGludGVydmFsID0gc2V0SW50ZXJ2YWwocG9rZSwgcG9rZURlbGF5KTtcbiAgICBmcmFtZSA9IDEsIHNldEZyYW1lKHdha2UpO1xuICB9XG59XG4iLCAiaW1wb3J0IHtUaW1lcn0gZnJvbSBcIi4vdGltZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2ssIGRlbGF5LCB0aW1lKSB7XG4gIHZhciB0ID0gbmV3IFRpbWVyO1xuICBkZWxheSA9IGRlbGF5ID09IG51bGwgPyAwIDogK2RlbGF5O1xuICB0LnJlc3RhcnQoZWxhcHNlZCA9PiB7XG4gICAgdC5zdG9wKCk7XG4gICAgY2FsbGJhY2soZWxhcHNlZCArIGRlbGF5KTtcbiAgfSwgZGVsYXksIHRpbWUpO1xuICByZXR1cm4gdDtcbn1cbiIsICJpbXBvcnQge2Rpc3BhdGNofSBmcm9tIFwiZDMtZGlzcGF0Y2hcIjtcbmltcG9ydCB7dGltZXIsIHRpbWVvdXR9IGZyb20gXCJkMy10aW1lclwiO1xuXG52YXIgZW1wdHlPbiA9IGRpc3BhdGNoKFwic3RhcnRcIiwgXCJlbmRcIiwgXCJjYW5jZWxcIiwgXCJpbnRlcnJ1cHRcIik7XG52YXIgZW1wdHlUd2VlbiA9IFtdO1xuXG5leHBvcnQgdmFyIENSRUFURUQgPSAwO1xuZXhwb3J0IHZhciBTQ0hFRFVMRUQgPSAxO1xuZXhwb3J0IHZhciBTVEFSVElORyA9IDI7XG5leHBvcnQgdmFyIFNUQVJURUQgPSAzO1xuZXhwb3J0IHZhciBSVU5OSU5HID0gNDtcbmV4cG9ydCB2YXIgRU5ESU5HID0gNTtcbmV4cG9ydCB2YXIgRU5ERUQgPSA2O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlLCBuYW1lLCBpZCwgaW5kZXgsIGdyb3VwLCB0aW1pbmcpIHtcbiAgdmFyIHNjaGVkdWxlcyA9IG5vZGUuX190cmFuc2l0aW9uO1xuICBpZiAoIXNjaGVkdWxlcykgbm9kZS5fX3RyYW5zaXRpb24gPSB7fTtcbiAgZWxzZSBpZiAoaWQgaW4gc2NoZWR1bGVzKSByZXR1cm47XG4gIGNyZWF0ZShub2RlLCBpZCwge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgaW5kZXg6IGluZGV4LCAvLyBGb3IgY29udGV4dCBkdXJpbmcgY2FsbGJhY2suXG4gICAgZ3JvdXA6IGdyb3VwLCAvLyBGb3IgY29udGV4dCBkdXJpbmcgY2FsbGJhY2suXG4gICAgb246IGVtcHR5T24sXG4gICAgdHdlZW46IGVtcHR5VHdlZW4sXG4gICAgdGltZTogdGltaW5nLnRpbWUsXG4gICAgZGVsYXk6IHRpbWluZy5kZWxheSxcbiAgICBkdXJhdGlvbjogdGltaW5nLmR1cmF0aW9uLFxuICAgIGVhc2U6IHRpbWluZy5lYXNlLFxuICAgIHRpbWVyOiBudWxsLFxuICAgIHN0YXRlOiBDUkVBVEVEXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdChub2RlLCBpZCkge1xuICB2YXIgc2NoZWR1bGUgPSBnZXQobm9kZSwgaWQpO1xuICBpZiAoc2NoZWR1bGUuc3RhdGUgPiBDUkVBVEVEKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b28gbGF0ZTsgYWxyZWFkeSBzY2hlZHVsZWRcIik7XG4gIHJldHVybiBzY2hlZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldChub2RlLCBpZCkge1xuICB2YXIgc2NoZWR1bGUgPSBnZXQobm9kZSwgaWQpO1xuICBpZiAoc2NoZWR1bGUuc3RhdGUgPiBTVEFSVEVEKSB0aHJvdyBuZXcgRXJyb3IoXCJ0b28gbGF0ZTsgYWxyZWFkeSBydW5uaW5nXCIpO1xuICByZXR1cm4gc2NoZWR1bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQobm9kZSwgaWQpIHtcbiAgdmFyIHNjaGVkdWxlID0gbm9kZS5fX3RyYW5zaXRpb247XG4gIGlmICghc2NoZWR1bGUgfHwgIShzY2hlZHVsZSA9IHNjaGVkdWxlW2lkXSkpIHRocm93IG5ldyBFcnJvcihcInRyYW5zaXRpb24gbm90IGZvdW5kXCIpO1xuICByZXR1cm4gc2NoZWR1bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZShub2RlLCBpZCwgc2VsZikge1xuICB2YXIgc2NoZWR1bGVzID0gbm9kZS5fX3RyYW5zaXRpb24sXG4gICAgICB0d2VlbjtcblxuICAvLyBJbml0aWFsaXplIHRoZSBzZWxmIHRpbWVyIHdoZW4gdGhlIHRyYW5zaXRpb24gaXMgY3JlYXRlZC5cbiAgLy8gTm90ZSB0aGUgYWN0dWFsIGRlbGF5IGlzIG5vdCBrbm93biB1bnRpbCB0aGUgZmlyc3QgY2FsbGJhY2shXG4gIHNjaGVkdWxlc1tpZF0gPSBzZWxmO1xuICBzZWxmLnRpbWVyID0gdGltZXIoc2NoZWR1bGUsIDAsIHNlbGYudGltZSk7XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGUoZWxhcHNlZCkge1xuICAgIHNlbGYuc3RhdGUgPSBTQ0hFRFVMRUQ7XG4gICAgc2VsZi50aW1lci5yZXN0YXJ0KHN0YXJ0LCBzZWxmLmRlbGF5LCBzZWxmLnRpbWUpO1xuXG4gICAgLy8gSWYgdGhlIGVsYXBzZWQgZGVsYXkgaXMgbGVzcyB0aGFuIG91ciBmaXJzdCBzbGVlcCwgc3RhcnQgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHNlbGYuZGVsYXkgPD0gZWxhcHNlZCkgc3RhcnQoZWxhcHNlZCAtIHNlbGYuZGVsYXkpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RhcnQoZWxhcHNlZCkge1xuICAgIHZhciBpLCBqLCBuLCBvO1xuXG4gICAgLy8gSWYgdGhlIHN0YXRlIGlzIG5vdCBTQ0hFRFVMRUQsIHRoZW4gd2UgcHJldmlvdXNseSBlcnJvcmVkIG9uIHN0YXJ0LlxuICAgIGlmIChzZWxmLnN0YXRlICE9PSBTQ0hFRFVMRUQpIHJldHVybiBzdG9wKCk7XG5cbiAgICBmb3IgKGkgaW4gc2NoZWR1bGVzKSB7XG4gICAgICBvID0gc2NoZWR1bGVzW2ldO1xuICAgICAgaWYgKG8ubmFtZSAhPT0gc2VsZi5uYW1lKSBjb250aW51ZTtcblxuICAgICAgLy8gV2hpbGUgdGhpcyBlbGVtZW50IGFscmVhZHkgaGFzIGEgc3RhcnRpbmcgdHJhbnNpdGlvbiBkdXJpbmcgdGhpcyBmcmFtZSxcbiAgICAgIC8vIGRlZmVyIHN0YXJ0aW5nIGFuIGludGVycnVwdGluZyB0cmFuc2l0aW9uIHVudGlsIHRoYXQgdHJhbnNpdGlvbiBoYXMgYVxuICAgICAgLy8gY2hhbmNlIHRvIHRpY2sgKGFuZCBwb3NzaWJseSBlbmQpOyBzZWUgZDMvZDMtdHJhbnNpdGlvbiM1NCFcbiAgICAgIGlmIChvLnN0YXRlID09PSBTVEFSVEVEKSByZXR1cm4gdGltZW91dChzdGFydCk7XG5cbiAgICAgIC8vIEludGVycnVwdCB0aGUgYWN0aXZlIHRyYW5zaXRpb24sIGlmIGFueS5cbiAgICAgIGlmIChvLnN0YXRlID09PSBSVU5OSU5HKSB7XG4gICAgICAgIG8uc3RhdGUgPSBFTkRFRDtcbiAgICAgICAgby50aW1lci5zdG9wKCk7XG4gICAgICAgIG8ub24uY2FsbChcImludGVycnVwdFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBvLmluZGV4LCBvLmdyb3VwKTtcbiAgICAgICAgZGVsZXRlIHNjaGVkdWxlc1tpXTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2FuY2VsIGFueSBwcmUtZW1wdGVkIHRyYW5zaXRpb25zLlxuICAgICAgZWxzZSBpZiAoK2kgPCBpZCkge1xuICAgICAgICBvLnN0YXRlID0gRU5ERUQ7XG4gICAgICAgIG8udGltZXIuc3RvcCgpO1xuICAgICAgICBvLm9uLmNhbGwoXCJjYW5jZWxcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgby5pbmRleCwgby5ncm91cCk7XG4gICAgICAgIGRlbGV0ZSBzY2hlZHVsZXNbaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRGVmZXIgdGhlIGZpcnN0IHRpY2sgdG8gZW5kIG9mIHRoZSBjdXJyZW50IGZyYW1lOyBzZWUgZDMvZDMjMTU3Ni5cbiAgICAvLyBOb3RlIHRoZSB0cmFuc2l0aW9uIG1heSBiZSBjYW5jZWxlZCBhZnRlciBzdGFydCBhbmQgYmVmb3JlIHRoZSBmaXJzdCB0aWNrIVxuICAgIC8vIE5vdGUgdGhpcyBtdXN0IGJlIHNjaGVkdWxlZCBiZWZvcmUgdGhlIHN0YXJ0IGV2ZW50OyBzZWUgZDMvZDMtdHJhbnNpdGlvbiMxNiFcbiAgICAvLyBBc3N1bWluZyB0aGlzIGlzIHN1Y2Nlc3NmdWwsIHN1YnNlcXVlbnQgY2FsbGJhY2tzIGdvIHN0cmFpZ2h0IHRvIHRpY2suXG4gICAgdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzZWxmLnN0YXRlID09PSBTVEFSVEVEKSB7XG4gICAgICAgIHNlbGYuc3RhdGUgPSBSVU5OSU5HO1xuICAgICAgICBzZWxmLnRpbWVyLnJlc3RhcnQodGljaywgc2VsZi5kZWxheSwgc2VsZi50aW1lKTtcbiAgICAgICAgdGljayhlbGFwc2VkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIERpc3BhdGNoIHRoZSBzdGFydCBldmVudC5cbiAgICAvLyBOb3RlIHRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB0aGUgdHdlZW4gYXJlIGluaXRpYWxpemVkLlxuICAgIHNlbGYuc3RhdGUgPSBTVEFSVElORztcbiAgICBzZWxmLm9uLmNhbGwoXCJzdGFydFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBzZWxmLmluZGV4LCBzZWxmLmdyb3VwKTtcbiAgICBpZiAoc2VsZi5zdGF0ZSAhPT0gU1RBUlRJTkcpIHJldHVybjsgLy8gaW50ZXJydXB0ZWRcbiAgICBzZWxmLnN0YXRlID0gU1RBUlRFRDtcblxuICAgIC8vIEluaXRpYWxpemUgdGhlIHR3ZWVuLCBkZWxldGluZyBudWxsIHR3ZWVuLlxuICAgIHR3ZWVuID0gbmV3IEFycmF5KG4gPSBzZWxmLnR3ZWVuLmxlbmd0aCk7XG4gICAgZm9yIChpID0gMCwgaiA9IC0xOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobyA9IHNlbGYudHdlZW5baV0udmFsdWUuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBzZWxmLmluZGV4LCBzZWxmLmdyb3VwKSkge1xuICAgICAgICB0d2VlblsrK2pdID0gbztcbiAgICAgIH1cbiAgICB9XG4gICAgdHdlZW4ubGVuZ3RoID0gaiArIDE7XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrKGVsYXBzZWQpIHtcbiAgICB2YXIgdCA9IGVsYXBzZWQgPCBzZWxmLmR1cmF0aW9uID8gc2VsZi5lYXNlLmNhbGwobnVsbCwgZWxhcHNlZCAvIHNlbGYuZHVyYXRpb24pIDogKHNlbGYudGltZXIucmVzdGFydChzdG9wKSwgc2VsZi5zdGF0ZSA9IEVORElORywgMSksXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IHR3ZWVuLmxlbmd0aDtcblxuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICB0d2VlbltpXS5jYWxsKG5vZGUsIHQpO1xuICAgIH1cblxuICAgIC8vIERpc3BhdGNoIHRoZSBlbmQgZXZlbnQuXG4gICAgaWYgKHNlbGYuc3RhdGUgPT09IEVORElORykge1xuICAgICAgc2VsZi5vbi5jYWxsKFwiZW5kXCIsIG5vZGUsIG5vZGUuX19kYXRhX18sIHNlbGYuaW5kZXgsIHNlbGYuZ3JvdXApO1xuICAgICAgc3RvcCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgc2VsZi5zdGF0ZSA9IEVOREVEO1xuICAgIHNlbGYudGltZXIuc3RvcCgpO1xuICAgIGRlbGV0ZSBzY2hlZHVsZXNbaWRdO1xuICAgIGZvciAodmFyIGkgaW4gc2NoZWR1bGVzKSByZXR1cm47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICBkZWxldGUgbm9kZS5fX3RyYW5zaXRpb247XG4gIH1cbn1cbiIsICJpbXBvcnQge1NUQVJUSU5HLCBFTkRJTkcsIEVOREVEfSBmcm9tIFwiLi90cmFuc2l0aW9uL3NjaGVkdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUsIG5hbWUpIHtcbiAgdmFyIHNjaGVkdWxlcyA9IG5vZGUuX190cmFuc2l0aW9uLFxuICAgICAgc2NoZWR1bGUsXG4gICAgICBhY3RpdmUsXG4gICAgICBlbXB0eSA9IHRydWUsXG4gICAgICBpO1xuXG4gIGlmICghc2NoZWR1bGVzKSByZXR1cm47XG5cbiAgbmFtZSA9IG5hbWUgPT0gbnVsbCA/IG51bGwgOiBuYW1lICsgXCJcIjtcblxuICBmb3IgKGkgaW4gc2NoZWR1bGVzKSB7XG4gICAgaWYgKChzY2hlZHVsZSA9IHNjaGVkdWxlc1tpXSkubmFtZSAhPT0gbmFtZSkgeyBlbXB0eSA9IGZhbHNlOyBjb250aW51ZTsgfVxuICAgIGFjdGl2ZSA9IHNjaGVkdWxlLnN0YXRlID4gU1RBUlRJTkcgJiYgc2NoZWR1bGUuc3RhdGUgPCBFTkRJTkc7XG4gICAgc2NoZWR1bGUuc3RhdGUgPSBFTkRFRDtcbiAgICBzY2hlZHVsZS50aW1lci5zdG9wKCk7XG4gICAgc2NoZWR1bGUub24uY2FsbChhY3RpdmUgPyBcImludGVycnVwdFwiIDogXCJjYW5jZWxcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgc2NoZWR1bGUuaW5kZXgsIHNjaGVkdWxlLmdyb3VwKTtcbiAgICBkZWxldGUgc2NoZWR1bGVzW2ldO1xuICB9XG5cbiAgaWYgKGVtcHR5KSBkZWxldGUgbm9kZS5fX3RyYW5zaXRpb247XG59XG4iLCAiaW1wb3J0IGludGVycnVwdCBmcm9tIFwiLi4vaW50ZXJydXB0LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICBpbnRlcnJ1cHQodGhpcywgbmFtZSk7XG4gIH0pO1xufVxuIiwgImltcG9ydCB7Z2V0LCBzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIHR3ZWVuUmVtb3ZlKGlkLCBuYW1lKSB7XG4gIHZhciB0d2VlbjAsIHR3ZWVuMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlZHVsZSA9IHNldCh0aGlzLCBpZCksXG4gICAgICAgIHR3ZWVuID0gc2NoZWR1bGUudHdlZW47XG5cbiAgICAvLyBJZiB0aGlzIG5vZGUgc2hhcmVkIHR3ZWVuIHdpdGggdGhlIHByZXZpb3VzIG5vZGUsXG4gICAgLy8ganVzdCBhc3NpZ24gdGhlIHVwZGF0ZWQgc2hhcmVkIHR3ZWVuIGFuZCB3ZVx1MjAxOXJlIGRvbmUhXG4gICAgLy8gT3RoZXJ3aXNlLCBjb3B5LW9uLXdyaXRlLlxuICAgIGlmICh0d2VlbiAhPT0gdHdlZW4wKSB7XG4gICAgICB0d2VlbjEgPSB0d2VlbjAgPSB0d2VlbjtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBuID0gdHdlZW4xLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAodHdlZW4xW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICB0d2VlbjEgPSB0d2VlbjEuc2xpY2UoKTtcbiAgICAgICAgICB0d2VlbjEuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2NoZWR1bGUudHdlZW4gPSB0d2VlbjE7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHR3ZWVuRnVuY3Rpb24oaWQsIG5hbWUsIHZhbHVlKSB7XG4gIHZhciB0d2VlbjAsIHR3ZWVuMTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NoZWR1bGUgPSBzZXQodGhpcywgaWQpLFxuICAgICAgICB0d2VlbiA9IHNjaGVkdWxlLnR3ZWVuO1xuXG4gICAgLy8gSWYgdGhpcyBub2RlIHNoYXJlZCB0d2VlbiB3aXRoIHRoZSBwcmV2aW91cyBub2RlLFxuICAgIC8vIGp1c3QgYXNzaWduIHRoZSB1cGRhdGVkIHNoYXJlZCB0d2VlbiBhbmQgd2VcdTIwMTlyZSBkb25lIVxuICAgIC8vIE90aGVyd2lzZSwgY29weS1vbi13cml0ZS5cbiAgICBpZiAodHdlZW4gIT09IHR3ZWVuMCkge1xuICAgICAgdHdlZW4xID0gKHR3ZWVuMCA9IHR3ZWVuKS5zbGljZSgpO1xuICAgICAgZm9yICh2YXIgdCA9IHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWV9LCBpID0gMCwgbiA9IHR3ZWVuMS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKHR3ZWVuMVtpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgdHdlZW4xW2ldID0gdDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGkgPT09IG4pIHR3ZWVuMS5wdXNoKHQpO1xuICAgIH1cblxuICAgIHNjaGVkdWxlLnR3ZWVuID0gdHdlZW4xO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgaWQgPSB0aGlzLl9pZDtcblxuICBuYW1lICs9IFwiXCI7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIHR3ZWVuID0gZ2V0KHRoaXMubm9kZSgpLCBpZCkudHdlZW47XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0d2Vlbi5sZW5ndGgsIHQ7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgodCA9IHR3ZWVuW2ldKS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgIHJldHVybiB0LnZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHZhbHVlID09IG51bGwgPyB0d2VlblJlbW92ZSA6IHR3ZWVuRnVuY3Rpb24pKGlkLCBuYW1lLCB2YWx1ZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHdlZW5WYWx1ZSh0cmFuc2l0aW9uLCBuYW1lLCB2YWx1ZSkge1xuICB2YXIgaWQgPSB0cmFuc2l0aW9uLl9pZDtcblxuICB0cmFuc2l0aW9uLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjaGVkdWxlID0gc2V0KHRoaXMsIGlkKTtcbiAgICAoc2NoZWR1bGUudmFsdWUgfHwgKHNjaGVkdWxlLnZhbHVlID0ge30pKVtuYW1lXSA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIGdldChub2RlLCBpZCkudmFsdWVbbmFtZV07XG4gIH07XG59XG4iLCAiaW1wb3J0IHtjb2xvcn0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQge2ludGVycG9sYXRlTnVtYmVyLCBpbnRlcnBvbGF0ZVJnYiwgaW50ZXJwb2xhdGVTdHJpbmd9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBjO1xuICByZXR1cm4gKHR5cGVvZiBiID09PSBcIm51bWJlclwiID8gaW50ZXJwb2xhdGVOdW1iZXJcbiAgICAgIDogYiBpbnN0YW5jZW9mIGNvbG9yID8gaW50ZXJwb2xhdGVSZ2JcbiAgICAgIDogKGMgPSBjb2xvcihiKSkgPyAoYiA9IGMsIGludGVycG9sYXRlUmdiKVxuICAgICAgOiBpbnRlcnBvbGF0ZVN0cmluZykoYSwgYik7XG59XG4iLCAiaW1wb3J0IHtpbnRlcnBvbGF0ZVRyYW5zZm9ybVN2ZyBhcyBpbnRlcnBvbGF0ZVRyYW5zZm9ybX0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQge25hbWVzcGFjZX0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHt0d2VlblZhbHVlfSBmcm9tIFwiLi90d2Vlbi5qc1wiO1xuaW1wb3J0IGludGVycG9sYXRlIGZyb20gXCIuL2ludGVycG9sYXRlLmpzXCI7XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmVOUyhmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnQobmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlMSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIixcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudE5TKGZ1bGxuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUxKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAgPSB0aGlzLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbihuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMTAsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCwgdmFsdWUxID0gdmFsdWUodGhpcyksIHN0cmluZzE7XG4gICAgaWYgKHZhbHVlMSA9PSBudWxsKSByZXR1cm4gdm9pZCB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBzdHJpbmcwID0gdGhpcy5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCI7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgJiYgc3RyaW5nMSA9PT0gc3RyaW5nMTAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiAoc3RyaW5nMTAgPSBzdHJpbmcxLCBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb25OUyhmdWxsbmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEwLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAsIHZhbHVlMSA9IHZhbHVlKHRoaXMpLCBzdHJpbmcxO1xuICAgIGlmICh2YWx1ZTEgPT0gbnVsbCkgcmV0dXJuIHZvaWQgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIHN0cmluZzAgPSB0aGlzLmdldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCI7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgJiYgc3RyaW5nMSA9PT0gc3RyaW5nMTAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiAoc3RyaW5nMTAgPSBzdHJpbmcxLCBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSkpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSksIGkgPSBmdWxsbmFtZSA9PT0gXCJ0cmFuc2Zvcm1cIiA/IGludGVycG9sYXRlVHJhbnNmb3JtIDogaW50ZXJwb2xhdGU7XG4gIHJldHVybiB0aGlzLmF0dHJUd2VlbihuYW1lLCB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbikoZnVsbG5hbWUsIGksIHR3ZWVuVmFsdWUodGhpcywgXCJhdHRyLlwiICsgbmFtZSwgdmFsdWUpKVxuICAgICAgOiB2YWx1ZSA9PSBudWxsID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0clJlbW92ZU5TIDogYXR0clJlbW92ZSkoZnVsbG5hbWUpXG4gICAgICA6IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KShmdWxsbmFtZSwgaSwgdmFsdWUpKTtcbn1cbiIsICJpbXBvcnQge25hbWVzcGFjZX0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuXG5mdW5jdGlvbiBhdHRySW50ZXJwb2xhdGUobmFtZSwgaSkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIGkuY2FsbCh0aGlzLCB0KSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJJbnRlcnBvbGF0ZU5TKGZ1bGxuYW1lLCBpKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwsIGkuY2FsbCh0aGlzLCB0KSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJUd2Vlbk5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICB2YXIgdDAsIGkwO1xuICBmdW5jdGlvbiB0d2VlbigpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGkgIT09IGkwKSB0MCA9IChpMCA9IGkpICYmIGF0dHJJbnRlcnBvbGF0ZU5TKGZ1bGxuYW1lLCBpKTtcbiAgICByZXR1cm4gdDA7XG4gIH1cbiAgdHdlZW4uX3ZhbHVlID0gdmFsdWU7XG4gIHJldHVybiB0d2Vlbjtcbn1cblxuZnVuY3Rpb24gYXR0clR3ZWVuKG5hbWUsIHZhbHVlKSB7XG4gIHZhciB0MCwgaTA7XG4gIGZ1bmN0aW9uIHR3ZWVuKCkge1xuICAgIHZhciBpID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoaSAhPT0gaTApIHQwID0gKGkwID0gaSkgJiYgYXR0ckludGVycG9sYXRlKG5hbWUsIGkpO1xuICAgIHJldHVybiB0MDtcbiAgfVxuICB0d2Vlbi5fdmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHR3ZWVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIga2V5ID0gXCJhdHRyLlwiICsgbmFtZTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gKGtleSA9IHRoaXMudHdlZW4oa2V5KSkgJiYga2V5Ll92YWx1ZTtcbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgbnVsbCk7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICB2YXIgZnVsbG5hbWUgPSBuYW1lc3BhY2UobmFtZSk7XG4gIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgKGZ1bGxuYW1lLmxvY2FsID8gYXR0clR3ZWVuTlMgOiBhdHRyVHdlZW4pKGZ1bGxuYW1lLCB2YWx1ZSkpO1xufVxuIiwgImltcG9ydCB7Z2V0LCBpbml0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiBkZWxheUZ1bmN0aW9uKGlkLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgaW5pdCh0aGlzLCBpZCkuZGVsYXkgPSArdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGVsYXlDb25zdGFudChpZCwgdmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID0gK3ZhbHVlLCBmdW5jdGlvbigpIHtcbiAgICBpbml0KHRoaXMsIGlkKS5kZWxheSA9IHZhbHVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgaWQgPSB0aGlzLl9pZDtcblxuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBkZWxheUZ1bmN0aW9uXG4gICAgICAgICAgOiBkZWxheUNvbnN0YW50KShpZCwgdmFsdWUpKVxuICAgICAgOiBnZXQodGhpcy5ub2RlKCksIGlkKS5kZWxheTtcbn1cbiIsICJpbXBvcnQge2dldCwgc2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiBkdXJhdGlvbkZ1bmN0aW9uKGlkLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgc2V0KHRoaXMsIGlkKS5kdXJhdGlvbiA9ICt2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkdXJhdGlvbkNvbnN0YW50KGlkLCB2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPSArdmFsdWUsIGZ1bmN0aW9uKCkge1xuICAgIHNldCh0aGlzLCBpZCkuZHVyYXRpb24gPSB2YWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIGlkID0gdGhpcy5faWQ7XG5cbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gZHVyYXRpb25GdW5jdGlvblxuICAgICAgICAgIDogZHVyYXRpb25Db25zdGFudCkoaWQsIHZhbHVlKSlcbiAgICAgIDogZ2V0KHRoaXMubm9kZSgpLCBpZCkuZHVyYXRpb247XG59XG4iLCAiaW1wb3J0IHtnZXQsIHNldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gZWFzZUNvbnN0YW50KGlkLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHNldCh0aGlzLCBpZCkuZWFzZSA9IHZhbHVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgaWQgPSB0aGlzLl9pZDtcblxuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2goZWFzZUNvbnN0YW50KGlkLCB2YWx1ZSkpXG4gICAgICA6IGdldCh0aGlzLm5vZGUoKSwgaWQpLmVhc2U7XG59XG4iLCAiaW1wb3J0IHtzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIGVhc2VWYXJ5aW5nKGlkLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh0eXBlb2YgdiAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gICAgc2V0KHRoaXMsIGlkKS5lYXNlID0gdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHJldHVybiB0aGlzLmVhY2goZWFzZVZhcnlpbmcodGhpcy5faWQsIHZhbHVlKSk7XG59XG4iLCAiaW1wb3J0IHttYXRjaGVyfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIGlmICh0eXBlb2YgbWF0Y2ggIT09IFwiZnVuY3Rpb25cIikgbWF0Y2ggPSBtYXRjaGVyKG1hdGNoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gW10sIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgbWF0Y2guY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzLCB0aGlzLl9uYW1lLCB0aGlzLl9pZCk7XG59XG4iLCAiaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0cmFuc2l0aW9uKSB7XG4gIGlmICh0cmFuc2l0aW9uLl9pZCAhPT0gdGhpcy5faWQpIHRocm93IG5ldyBFcnJvcjtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gdHJhbnNpdGlvbi5fZ3JvdXBzLCBtMCA9IGdyb3VwczAubGVuZ3RoLCBtMSA9IGdyb3VwczEubGVuZ3RoLCBtID0gTWF0aC5taW4obTAsIG0xKSwgbWVyZ2VzID0gbmV3IEFycmF5KG0wKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cDAgPSBncm91cHMwW2pdLCBncm91cDEgPSBncm91cHMxW2pdLCBuID0gZ3JvdXAwLmxlbmd0aCwgbWVyZ2UgPSBtZXJnZXNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwMFtpXSB8fCBncm91cDFbaV0pIHtcbiAgICAgICAgbWVyZ2VbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBqIDwgbTA7ICsraikge1xuICAgIG1lcmdlc1tqXSA9IGdyb3VwczBbal07XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24obWVyZ2VzLCB0aGlzLl9wYXJlbnRzLCB0aGlzLl9uYW1lLCB0aGlzLl9pZCk7XG59XG4iLCAiaW1wb3J0IHtnZXQsIHNldCwgaW5pdH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gc3RhcnQobmFtZSkge1xuICByZXR1cm4gKG5hbWUgKyBcIlwiKS50cmltKCkuc3BsaXQoL158XFxzKy8pLmV2ZXJ5KGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgcmV0dXJuICF0IHx8IHQgPT09IFwic3RhcnRcIjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG9uRnVuY3Rpb24oaWQsIG5hbWUsIGxpc3RlbmVyKSB7XG4gIHZhciBvbjAsIG9uMSwgc2l0ID0gc3RhcnQobmFtZSkgPyBpbml0IDogc2V0O1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjaGVkdWxlID0gc2l0KHRoaXMsIGlkKSxcbiAgICAgICAgb24gPSBzY2hlZHVsZS5vbjtcblxuICAgIC8vIElmIHRoaXMgbm9kZSBzaGFyZWQgYSBkaXNwYXRjaCB3aXRoIHRoZSBwcmV2aW91cyBub2RlLFxuICAgIC8vIGp1c3QgYXNzaWduIHRoZSB1cGRhdGVkIHNoYXJlZCBkaXNwYXRjaCBhbmQgd2VcdTIwMTlyZSBkb25lIVxuICAgIC8vIE90aGVyd2lzZSwgY29weS1vbi13cml0ZS5cbiAgICBpZiAob24gIT09IG9uMCkgKG9uMSA9IChvbjAgPSBvbikuY29weSgpKS5vbihuYW1lLCBsaXN0ZW5lcik7XG5cbiAgICBzY2hlZHVsZS5vbiA9IG9uMTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGlkID0gdGhpcy5faWQ7XG5cbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPCAyXG4gICAgICA/IGdldCh0aGlzLm5vZGUoKSwgaWQpLm9uLm9uKG5hbWUpXG4gICAgICA6IHRoaXMuZWFjaChvbkZ1bmN0aW9uKGlkLCBuYW1lLCBsaXN0ZW5lcikpO1xufVxuIiwgImZ1bmN0aW9uIHJlbW92ZUZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICAgIGZvciAodmFyIGkgaW4gdGhpcy5fX3RyYW5zaXRpb24pIGlmICgraSAhPT0gaWQpIHJldHVybjtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5vbihcImVuZC5yZW1vdmVcIiwgcmVtb3ZlRnVuY3Rpb24odGhpcy5faWQpKTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdG9yfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2NoZWR1bGUsIHtnZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICB2YXIgbmFtZSA9IHRoaXMuX25hbWUsXG4gICAgICBpZCA9IHRoaXMuX2lkO1xuXG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgICBzY2hlZHVsZShzdWJncm91cFtpXSwgbmFtZSwgaWQsIGksIHN1Ymdyb3VwLCBnZXQobm9kZSwgaWQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24oc3ViZ3JvdXBzLCB0aGlzLl9wYXJlbnRzLCBuYW1lLCBpZCk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3RvckFsbH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNjaGVkdWxlLCB7Z2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLl9uYW1lLFxuICAgICAgaWQgPSB0aGlzLl9pZDtcblxuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvckFsbChzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IFtdLCBwYXJlbnRzID0gW10sIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGZvciAodmFyIGNoaWxkcmVuID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApLCBjaGlsZCwgaW5oZXJpdCA9IGdldChub2RlLCBpZCksIGsgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBrIDwgbDsgKytrKSB7XG4gICAgICAgICAgaWYgKGNoaWxkID0gY2hpbGRyZW5ba10pIHtcbiAgICAgICAgICAgIHNjaGVkdWxlKGNoaWxkLCBuYW1lLCBpZCwgaywgY2hpbGRyZW4sIGluaGVyaXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdWJncm91cHMucHVzaChjaGlsZHJlbik7XG4gICAgICAgIHBhcmVudHMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24oc3ViZ3JvdXBzLCBwYXJlbnRzLCBuYW1lLCBpZCk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3Rpb259IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcblxudmFyIFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3I7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9ncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImltcG9ydCB7aW50ZXJwb2xhdGVUcmFuc2Zvcm1Dc3MgYXMgaW50ZXJwb2xhdGVUcmFuc2Zvcm19IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IHtzdHlsZX0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5pbXBvcnQge3R3ZWVuVmFsdWV9IGZyb20gXCIuL3R3ZWVuLmpzXCI7XG5pbXBvcnQgaW50ZXJwb2xhdGUgZnJvbSBcIi4vaW50ZXJwb2xhdGUuanNcIjtcblxuZnVuY3Rpb24gc3R5bGVOdWxsKG5hbWUsIGludGVycG9sYXRlKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEwLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAgPSBzdHlsZSh0aGlzLCBuYW1lKSxcbiAgICAgICAgc3RyaW5nMSA9ICh0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpLCBzdHlsZSh0aGlzLCBuYW1lKSk7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgJiYgc3RyaW5nMSA9PT0gc3RyaW5nMTAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHN0cmluZzEwID0gc3RyaW5nMSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlQ29uc3RhbnQobmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlMSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIixcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwID0gc3R5bGUodGhpcywgbmFtZSk7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlRnVuY3Rpb24obmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEwLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAgPSBzdHlsZSh0aGlzLCBuYW1lKSxcbiAgICAgICAgdmFsdWUxID0gdmFsdWUodGhpcyksXG4gICAgICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiO1xuICAgIGlmICh2YWx1ZTEgPT0gbnVsbCkgc3RyaW5nMSA9IHZhbHVlMSA9ICh0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpLCBzdHlsZSh0aGlzLCBuYW1lKSk7XG4gICAgcmV0dXJuIHN0cmluZzAgPT09IHN0cmluZzEgPyBudWxsXG4gICAgICAgIDogc3RyaW5nMCA9PT0gc3RyaW5nMDAgJiYgc3RyaW5nMSA9PT0gc3RyaW5nMTAgPyBpbnRlcnBvbGF0ZTBcbiAgICAgICAgOiAoc3RyaW5nMTAgPSBzdHJpbmcxLCBpbnRlcnBvbGF0ZTAgPSBpbnRlcnBvbGF0ZShzdHJpbmcwMCA9IHN0cmluZzAsIHZhbHVlMSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZU1heWJlUmVtb3ZlKGlkLCBuYW1lKSB7XG4gIHZhciBvbjAsIG9uMSwgbGlzdGVuZXIwLCBrZXkgPSBcInN0eWxlLlwiICsgbmFtZSwgZXZlbnQgPSBcImVuZC5cIiArIGtleSwgcmVtb3ZlO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjaGVkdWxlID0gc2V0KHRoaXMsIGlkKSxcbiAgICAgICAgb24gPSBzY2hlZHVsZS5vbixcbiAgICAgICAgbGlzdGVuZXIgPSBzY2hlZHVsZS52YWx1ZVtrZXldID09IG51bGwgPyByZW1vdmUgfHwgKHJlbW92ZSA9IHN0eWxlUmVtb3ZlKG5hbWUpKSA6IHVuZGVmaW5lZDtcblxuICAgIC8vIElmIHRoaXMgbm9kZSBzaGFyZWQgYSBkaXNwYXRjaCB3aXRoIHRoZSBwcmV2aW91cyBub2RlLFxuICAgIC8vIGp1c3QgYXNzaWduIHRoZSB1cGRhdGVkIHNoYXJlZCBkaXNwYXRjaCBhbmQgd2VcdTIwMTlyZSBkb25lIVxuICAgIC8vIE90aGVyd2lzZSwgY29weS1vbi13cml0ZS5cbiAgICBpZiAob24gIT09IG9uMCB8fCBsaXN0ZW5lcjAgIT09IGxpc3RlbmVyKSAob24xID0gKG9uMCA9IG9uKS5jb3B5KCkpLm9uKGV2ZW50LCBsaXN0ZW5lcjAgPSBsaXN0ZW5lcik7XG5cbiAgICBzY2hlZHVsZS5vbiA9IG9uMTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBpID0gKG5hbWUgKz0gXCJcIikgPT09IFwidHJhbnNmb3JtXCIgPyBpbnRlcnBvbGF0ZVRyYW5zZm9ybSA6IGludGVycG9sYXRlO1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IHRoaXNcbiAgICAgIC5zdHlsZVR3ZWVuKG5hbWUsIHN0eWxlTnVsbChuYW1lLCBpKSlcbiAgICAgIC5vbihcImVuZC5zdHlsZS5cIiArIG5hbWUsIHN0eWxlUmVtb3ZlKG5hbWUpKVxuICAgIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyB0aGlzXG4gICAgICAuc3R5bGVUd2VlbihuYW1lLCBzdHlsZUZ1bmN0aW9uKG5hbWUsIGksIHR3ZWVuVmFsdWUodGhpcywgXCJzdHlsZS5cIiArIG5hbWUsIHZhbHVlKSkpXG4gICAgICAuZWFjaChzdHlsZU1heWJlUmVtb3ZlKHRoaXMuX2lkLCBuYW1lKSlcbiAgICA6IHRoaXNcbiAgICAgIC5zdHlsZVR3ZWVuKG5hbWUsIHN0eWxlQ29uc3RhbnQobmFtZSwgaSwgdmFsdWUpLCBwcmlvcml0eSlcbiAgICAgIC5vbihcImVuZC5zdHlsZS5cIiArIG5hbWUsIG51bGwpO1xufVxuIiwgImZ1bmN0aW9uIHN0eWxlSW50ZXJwb2xhdGUobmFtZSwgaSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIGkuY2FsbCh0aGlzLCB0KSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZVR3ZWVuKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICB2YXIgdCwgaTA7XG4gIGZ1bmN0aW9uIHR3ZWVuKCkge1xuICAgIHZhciBpID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoaSAhPT0gaTApIHQgPSAoaTAgPSBpKSAmJiBzdHlsZUludGVycG9sYXRlKG5hbWUsIGksIHByaW9yaXR5KTtcbiAgICByZXR1cm4gdDtcbiAgfVxuICB0d2Vlbi5fdmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHR3ZWVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIGtleSA9IFwic3R5bGUuXCIgKyAobmFtZSArPSBcIlwiKTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gKGtleSA9IHRoaXMudHdlZW4oa2V5KSkgJiYga2V5Ll92YWx1ZTtcbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgbnVsbCk7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICByZXR1cm4gdGhpcy50d2VlbihrZXksIHN0eWxlVHdlZW4obmFtZSwgdmFsdWUsIHByaW9yaXR5ID09IG51bGwgPyBcIlwiIDogcHJpb3JpdHkpKTtcbn1cbiIsICJpbXBvcnQge3R3ZWVuVmFsdWV9IGZyb20gXCIuL3R3ZWVuLmpzXCI7XG5cbmZ1bmN0aW9uIHRleHRDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZTEgPSB2YWx1ZSh0aGlzKTtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWUxID09IG51bGwgPyBcIlwiIDogdmFsdWUxO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy50d2VlbihcInRleHRcIiwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gdGV4dEZ1bmN0aW9uKHR3ZWVuVmFsdWUodGhpcywgXCJ0ZXh0XCIsIHZhbHVlKSlcbiAgICAgIDogdGV4dENvbnN0YW50KHZhbHVlID09IG51bGwgPyBcIlwiIDogdmFsdWUgKyBcIlwiKSk7XG59XG4iLCAiZnVuY3Rpb24gdGV4dEludGVycG9sYXRlKGkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gaS5jYWxsKHRoaXMsIHQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0VHdlZW4odmFsdWUpIHtcbiAgdmFyIHQwLCBpMDtcbiAgZnVuY3Rpb24gdHdlZW4oKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChpICE9PSBpMCkgdDAgPSAoaTAgPSBpKSAmJiB0ZXh0SW50ZXJwb2xhdGUoaSk7XG4gICAgcmV0dXJuIHQwO1xuICB9XG4gIHR3ZWVuLl92YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gdHdlZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBrZXkgPSBcInRleHRcIjtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAxKSByZXR1cm4gKGtleSA9IHRoaXMudHdlZW4oa2V5KSkgJiYga2V5Ll92YWx1ZTtcbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgbnVsbCk7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICByZXR1cm4gdGhpcy50d2VlbihrZXksIHRleHRUd2Vlbih2YWx1ZSkpO1xufVxuIiwgImltcG9ydCB7VHJhbnNpdGlvbiwgbmV3SWR9IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2NoZWR1bGUsIHtnZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZSA9IHRoaXMuX25hbWUsXG4gICAgICBpZDAgPSB0aGlzLl9pZCxcbiAgICAgIGlkMSA9IG5ld0lkKCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgdmFyIGluaGVyaXQgPSBnZXQobm9kZSwgaWQwKTtcbiAgICAgICAgc2NoZWR1bGUobm9kZSwgbmFtZSwgaWQxLCBpLCBncm91cCwge1xuICAgICAgICAgIHRpbWU6IGluaGVyaXQudGltZSArIGluaGVyaXQuZGVsYXkgKyBpbmhlcml0LmR1cmF0aW9uLFxuICAgICAgICAgIGRlbGF5OiAwLFxuICAgICAgICAgIGR1cmF0aW9uOiBpbmhlcml0LmR1cmF0aW9uLFxuICAgICAgICAgIGVhc2U6IGluaGVyaXQuZWFzZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24oZ3JvdXBzLCB0aGlzLl9wYXJlbnRzLCBuYW1lLCBpZDEpO1xufVxuIiwgImltcG9ydCB7c2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIG9uMCwgb24xLCB0aGF0ID0gdGhpcywgaWQgPSB0aGF0Ll9pZCwgc2l6ZSA9IHRoYXQuc2l6ZSgpO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIGNhbmNlbCA9IHt2YWx1ZTogcmVqZWN0fSxcbiAgICAgICAgZW5kID0ge3ZhbHVlOiBmdW5jdGlvbigpIHsgaWYgKC0tc2l6ZSA9PT0gMCkgcmVzb2x2ZSgpOyB9fTtcblxuICAgIHRoYXQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzY2hlZHVsZSA9IHNldCh0aGlzLCBpZCksXG4gICAgICAgICAgb24gPSBzY2hlZHVsZS5vbjtcblxuICAgICAgLy8gSWYgdGhpcyBub2RlIHNoYXJlZCBhIGRpc3BhdGNoIHdpdGggdGhlIHByZXZpb3VzIG5vZGUsXG4gICAgICAvLyBqdXN0IGFzc2lnbiB0aGUgdXBkYXRlZCBzaGFyZWQgZGlzcGF0Y2ggYW5kIHdlXHUyMDE5cmUgZG9uZSFcbiAgICAgIC8vIE90aGVyd2lzZSwgY29weS1vbi13cml0ZS5cbiAgICAgIGlmIChvbiAhPT0gb24wKSB7XG4gICAgICAgIG9uMSA9IChvbjAgPSBvbikuY29weSgpO1xuICAgICAgICBvbjEuXy5jYW5jZWwucHVzaChjYW5jZWwpO1xuICAgICAgICBvbjEuXy5pbnRlcnJ1cHQucHVzaChjYW5jZWwpO1xuICAgICAgICBvbjEuXy5lbmQucHVzaChlbmQpO1xuICAgICAgfVxuXG4gICAgICBzY2hlZHVsZS5vbiA9IG9uMTtcbiAgICB9KTtcblxuICAgIC8vIFRoZSBzZWxlY3Rpb24gd2FzIGVtcHR5LCByZXNvbHZlIGVuZCBpbW1lZGlhdGVseVxuICAgIGlmIChzaXplID09PSAwKSByZXNvbHZlKCk7XG4gIH0pO1xufVxuIiwgImltcG9ydCB7c2VsZWN0aW9ufSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9hdHRyIGZyb20gXCIuL2F0dHIuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2F0dHJUd2VlbiBmcm9tIFwiLi9hdHRyVHdlZW4uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2RlbGF5IGZyb20gXCIuL2RlbGF5LmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9kdXJhdGlvbiBmcm9tIFwiLi9kdXJhdGlvbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZWFzZSBmcm9tIFwiLi9lYXNlLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9lYXNlVmFyeWluZyBmcm9tIFwiLi9lYXNlVmFyeWluZy5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZmlsdGVyIGZyb20gXCIuL2ZpbHRlci5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fbWVyZ2UgZnJvbSBcIi4vbWVyZ2UuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX29uIGZyb20gXCIuL29uLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9zZWxlY3QgZnJvbSBcIi4vc2VsZWN0LmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9zZWxlY3RBbGwgZnJvbSBcIi4vc2VsZWN0QWxsLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9zZWxlY3Rpb24gZnJvbSBcIi4vc2VsZWN0aW9uLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9zdHlsZSBmcm9tIFwiLi9zdHlsZS5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fc3R5bGVUd2VlbiBmcm9tIFwiLi9zdHlsZVR3ZWVuLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl90ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3RleHRUd2VlbiBmcm9tIFwiLi90ZXh0VHdlZW4uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3RyYW5zaXRpb24gZnJvbSBcIi4vdHJhbnNpdGlvbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fdHdlZW4gZnJvbSBcIi4vdHdlZW4uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2VuZCBmcm9tIFwiLi9lbmQuanNcIjtcblxudmFyIGlkID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIFRyYW5zaXRpb24oZ3JvdXBzLCBwYXJlbnRzLCBuYW1lLCBpZCkge1xuICB0aGlzLl9ncm91cHMgPSBncm91cHM7XG4gIHRoaXMuX3BhcmVudHMgPSBwYXJlbnRzO1xuICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgdGhpcy5faWQgPSBpZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNpdGlvbihuYW1lKSB7XG4gIHJldHVybiBzZWxlY3Rpb24oKS50cmFuc2l0aW9uKG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3SWQoKSB7XG4gIHJldHVybiArK2lkO1xufVxuXG52YXIgc2VsZWN0aW9uX3Byb3RvdHlwZSA9IHNlbGVjdGlvbi5wcm90b3R5cGU7XG5cblRyYW5zaXRpb24ucHJvdG90eXBlID0gdHJhbnNpdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBUcmFuc2l0aW9uLFxuICBzZWxlY3Q6IHRyYW5zaXRpb25fc2VsZWN0LFxuICBzZWxlY3RBbGw6IHRyYW5zaXRpb25fc2VsZWN0QWxsLFxuICBzZWxlY3RDaGlsZDogc2VsZWN0aW9uX3Byb3RvdHlwZS5zZWxlY3RDaGlsZCxcbiAgc2VsZWN0Q2hpbGRyZW46IHNlbGVjdGlvbl9wcm90b3R5cGUuc2VsZWN0Q2hpbGRyZW4sXG4gIGZpbHRlcjogdHJhbnNpdGlvbl9maWx0ZXIsXG4gIG1lcmdlOiB0cmFuc2l0aW9uX21lcmdlLFxuICBzZWxlY3Rpb246IHRyYW5zaXRpb25fc2VsZWN0aW9uLFxuICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uX3RyYW5zaXRpb24sXG4gIGNhbGw6IHNlbGVjdGlvbl9wcm90b3R5cGUuY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9wcm90b3R5cGUubm9kZXMsXG4gIG5vZGU6IHNlbGVjdGlvbl9wcm90b3R5cGUubm9kZSxcbiAgc2l6ZTogc2VsZWN0aW9uX3Byb3RvdHlwZS5zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX3Byb3RvdHlwZS5lbXB0eSxcbiAgZWFjaDogc2VsZWN0aW9uX3Byb3RvdHlwZS5lYWNoLFxuICBvbjogdHJhbnNpdGlvbl9vbixcbiAgYXR0cjogdHJhbnNpdGlvbl9hdHRyLFxuICBhdHRyVHdlZW46IHRyYW5zaXRpb25fYXR0clR3ZWVuLFxuICBzdHlsZTogdHJhbnNpdGlvbl9zdHlsZSxcbiAgc3R5bGVUd2VlbjogdHJhbnNpdGlvbl9zdHlsZVR3ZWVuLFxuICB0ZXh0OiB0cmFuc2l0aW9uX3RleHQsXG4gIHRleHRUd2VlbjogdHJhbnNpdGlvbl90ZXh0VHdlZW4sXG4gIHJlbW92ZTogdHJhbnNpdGlvbl9yZW1vdmUsXG4gIHR3ZWVuOiB0cmFuc2l0aW9uX3R3ZWVuLFxuICBkZWxheTogdHJhbnNpdGlvbl9kZWxheSxcbiAgZHVyYXRpb246IHRyYW5zaXRpb25fZHVyYXRpb24sXG4gIGVhc2U6IHRyYW5zaXRpb25fZWFzZSxcbiAgZWFzZVZhcnlpbmc6IHRyYW5zaXRpb25fZWFzZVZhcnlpbmcsXG4gIGVuZDogdHJhbnNpdGlvbl9lbmQsXG4gIFtTeW1ib2wuaXRlcmF0b3JdOiBzZWxlY3Rpb25fcHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl1cbn07XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGN1YmljSW4odCkge1xuICByZXR1cm4gdCAqIHQgKiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3ViaWNPdXQodCkge1xuICByZXR1cm4gLS10ICogdCAqIHQgKyAxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3ViaWNJbk91dCh0KSB7XG4gIHJldHVybiAoKHQgKj0gMikgPD0gMSA/IHQgKiB0ICogdCA6ICh0IC09IDIpICogdCAqIHQgKyAyKSAvIDI7XG59XG4iLCAiaW1wb3J0IHtUcmFuc2l0aW9uLCBuZXdJZH0gZnJvbSBcIi4uL3RyYW5zaXRpb24vaW5kZXguanNcIjtcbmltcG9ydCBzY2hlZHVsZSBmcm9tIFwiLi4vdHJhbnNpdGlvbi9zY2hlZHVsZS5qc1wiO1xuaW1wb3J0IHtlYXNlQ3ViaWNJbk91dH0gZnJvbSBcImQzLWVhc2VcIjtcbmltcG9ydCB7bm93fSBmcm9tIFwiZDMtdGltZXJcIjtcblxudmFyIGRlZmF1bHRUaW1pbmcgPSB7XG4gIHRpbWU6IG51bGwsIC8vIFNldCBvbiB1c2UuXG4gIGRlbGF5OiAwLFxuICBkdXJhdGlvbjogMjUwLFxuICBlYXNlOiBlYXNlQ3ViaWNJbk91dFxufTtcblxuZnVuY3Rpb24gaW5oZXJpdChub2RlLCBpZCkge1xuICB2YXIgdGltaW5nO1xuICB3aGlsZSAoISh0aW1pbmcgPSBub2RlLl9fdHJhbnNpdGlvbikgfHwgISh0aW1pbmcgPSB0aW1pbmdbaWRdKSkge1xuICAgIGlmICghKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHRyYW5zaXRpb24gJHtpZH0gbm90IGZvdW5kYCk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aW1pbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGlkLFxuICAgICAgdGltaW5nO1xuXG4gIGlmIChuYW1lIGluc3RhbmNlb2YgVHJhbnNpdGlvbikge1xuICAgIGlkID0gbmFtZS5faWQsIG5hbWUgPSBuYW1lLl9uYW1lO1xuICB9IGVsc2Uge1xuICAgIGlkID0gbmV3SWQoKSwgKHRpbWluZyA9IGRlZmF1bHRUaW1pbmcpLnRpbWUgPSBub3coKSwgbmFtZSA9IG5hbWUgPT0gbnVsbCA/IG51bGwgOiBuYW1lICsgXCJcIjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNjaGVkdWxlKG5vZGUsIG5hbWUsIGlkLCBpLCBncm91cCwgdGltaW5nIHx8IGluaGVyaXQobm9kZSwgaWQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFRyYW5zaXRpb24oZ3JvdXBzLCB0aGlzLl9wYXJlbnRzLCBuYW1lLCBpZCk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3Rpb259IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCBzZWxlY3Rpb25faW50ZXJydXB0IGZyb20gXCIuL2ludGVycnVwdC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl90cmFuc2l0aW9uIGZyb20gXCIuL3RyYW5zaXRpb24uanNcIjtcblxuc2VsZWN0aW9uLnByb3RvdHlwZS5pbnRlcnJ1cHQgPSBzZWxlY3Rpb25faW50ZXJydXB0O1xuc2VsZWN0aW9uLnByb3RvdHlwZS50cmFuc2l0aW9uID0gc2VsZWN0aW9uX3RyYW5zaXRpb247XG4iLCAiaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5pbXBvcnQge2RyYWdEaXNhYmxlLCBkcmFnRW5hYmxlfSBmcm9tIFwiZDMtZHJhZ1wiO1xuaW1wb3J0IHtpbnRlcnBvbGF0ZX0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQge3BvaW50ZXIsIHNlbGVjdH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtpbnRlcnJ1cHR9IGZyb20gXCJkMy10cmFuc2l0aW9uXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBCcnVzaEV2ZW50IGZyb20gXCIuL2V2ZW50LmpzXCI7XG5pbXBvcnQgbm9ldmVudCwge25vcHJvcGFnYXRpb259IGZyb20gXCIuL25vZXZlbnQuanNcIjtcblxudmFyIE1PREVfRFJBRyA9IHtuYW1lOiBcImRyYWdcIn0sXG4gICAgTU9ERV9TUEFDRSA9IHtuYW1lOiBcInNwYWNlXCJ9LFxuICAgIE1PREVfSEFORExFID0ge25hbWU6IFwiaGFuZGxlXCJ9LFxuICAgIE1PREVfQ0VOVEVSID0ge25hbWU6IFwiY2VudGVyXCJ9O1xuXG5jb25zdCB7YWJzLCBtYXgsIG1pbn0gPSBNYXRoO1xuXG5mdW5jdGlvbiBudW1iZXIxKGUpIHtcbiAgcmV0dXJuIFsrZVswXSwgK2VbMV1dO1xufVxuXG5mdW5jdGlvbiBudW1iZXIyKGUpIHtcbiAgcmV0dXJuIFtudW1iZXIxKGVbMF0pLCBudW1iZXIxKGVbMV0pXTtcbn1cblxudmFyIFggPSB7XG4gIG5hbWU6IFwieFwiLFxuICBoYW5kbGVzOiBbXCJ3XCIsIFwiZVwiXS5tYXAodHlwZSksXG4gIGlucHV0OiBmdW5jdGlvbih4LCBlKSB7IHJldHVybiB4ID09IG51bGwgPyBudWxsIDogW1sreFswXSwgZVswXVsxXV0sIFsreFsxXSwgZVsxXVsxXV1dOyB9LFxuICBvdXRwdXQ6IGZ1bmN0aW9uKHh5KSB7IHJldHVybiB4eSAmJiBbeHlbMF1bMF0sIHh5WzFdWzBdXTsgfVxufTtcblxudmFyIFkgPSB7XG4gIG5hbWU6IFwieVwiLFxuICBoYW5kbGVzOiBbXCJuXCIsIFwic1wiXS5tYXAodHlwZSksXG4gIGlucHV0OiBmdW5jdGlvbih5LCBlKSB7IHJldHVybiB5ID09IG51bGwgPyBudWxsIDogW1tlWzBdWzBdLCAreVswXV0sIFtlWzFdWzBdLCAreVsxXV1dOyB9LFxuICBvdXRwdXQ6IGZ1bmN0aW9uKHh5KSB7IHJldHVybiB4eSAmJiBbeHlbMF1bMV0sIHh5WzFdWzFdXTsgfVxufTtcblxudmFyIFhZID0ge1xuICBuYW1lOiBcInh5XCIsXG4gIGhhbmRsZXM6IFtcIm5cIiwgXCJ3XCIsIFwiZVwiLCBcInNcIiwgXCJud1wiLCBcIm5lXCIsIFwic3dcIiwgXCJzZVwiXS5tYXAodHlwZSksXG4gIGlucHV0OiBmdW5jdGlvbih4eSkgeyByZXR1cm4geHkgPT0gbnVsbCA/IG51bGwgOiBudW1iZXIyKHh5KTsgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbih4eSkgeyByZXR1cm4geHk7IH1cbn07XG5cbnZhciBjdXJzb3JzID0ge1xuICBvdmVybGF5OiBcImNyb3NzaGFpclwiLFxuICBzZWxlY3Rpb246IFwibW92ZVwiLFxuICBuOiBcIm5zLXJlc2l6ZVwiLFxuICBlOiBcImV3LXJlc2l6ZVwiLFxuICBzOiBcIm5zLXJlc2l6ZVwiLFxuICB3OiBcImV3LXJlc2l6ZVwiLFxuICBudzogXCJud3NlLXJlc2l6ZVwiLFxuICBuZTogXCJuZXN3LXJlc2l6ZVwiLFxuICBzZTogXCJud3NlLXJlc2l6ZVwiLFxuICBzdzogXCJuZXN3LXJlc2l6ZVwiXG59O1xuXG52YXIgZmxpcFggPSB7XG4gIGU6IFwid1wiLFxuICB3OiBcImVcIixcbiAgbnc6IFwibmVcIixcbiAgbmU6IFwibndcIixcbiAgc2U6IFwic3dcIixcbiAgc3c6IFwic2VcIlxufTtcblxudmFyIGZsaXBZID0ge1xuICBuOiBcInNcIixcbiAgczogXCJuXCIsXG4gIG53OiBcInN3XCIsXG4gIG5lOiBcInNlXCIsXG4gIHNlOiBcIm5lXCIsXG4gIHN3OiBcIm53XCJcbn07XG5cbnZhciBzaWduc1ggPSB7XG4gIG92ZXJsYXk6ICsxLFxuICBzZWxlY3Rpb246ICsxLFxuICBuOiBudWxsLFxuICBlOiArMSxcbiAgczogbnVsbCxcbiAgdzogLTEsXG4gIG53OiAtMSxcbiAgbmU6ICsxLFxuICBzZTogKzEsXG4gIHN3OiAtMVxufTtcblxudmFyIHNpZ25zWSA9IHtcbiAgb3ZlcmxheTogKzEsXG4gIHNlbGVjdGlvbjogKzEsXG4gIG46IC0xLFxuICBlOiBudWxsLFxuICBzOiArMSxcbiAgdzogbnVsbCxcbiAgbnc6IC0xLFxuICBuZTogLTEsXG4gIHNlOiArMSxcbiAgc3c6ICsxXG59O1xuXG5mdW5jdGlvbiB0eXBlKHQpIHtcbiAgcmV0dXJuIHt0eXBlOiB0fTtcbn1cblxuLy8gSWdub3JlIHJpZ2h0LWNsaWNrLCBzaW5jZSB0aGF0IHNob3VsZCBvcGVuIHRoZSBjb250ZXh0IG1lbnUuXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyKGV2ZW50KSB7XG4gIHJldHVybiAhZXZlbnQuY3RybEtleSAmJiAhZXZlbnQuYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0RXh0ZW50KCkge1xuICB2YXIgc3ZnID0gdGhpcy5vd25lclNWR0VsZW1lbnQgfHwgdGhpcztcbiAgaWYgKHN2Zy5oYXNBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpKSB7XG4gICAgc3ZnID0gc3ZnLnZpZXdCb3guYmFzZVZhbDtcbiAgICByZXR1cm4gW1tzdmcueCwgc3ZnLnldLCBbc3ZnLnggKyBzdmcud2lkdGgsIHN2Zy55ICsgc3ZnLmhlaWdodF1dO1xuICB9XG4gIHJldHVybiBbWzAsIDBdLCBbc3ZnLndpZHRoLmJhc2VWYWwudmFsdWUsIHN2Zy5oZWlnaHQuYmFzZVZhbC52YWx1ZV1dO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VG91Y2hhYmxlKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IChcIm9udG91Y2hzdGFydFwiIGluIHRoaXMpO1xufVxuXG4vLyBMaWtlIGQzLmxvY2FsLCBidXQgd2l0aCB0aGUgbmFtZSBcdTIwMUNfX2JydXNoXHUyMDFEIHJhdGhlciB0aGFuIGF1dG8tZ2VuZXJhdGVkLlxuZnVuY3Rpb24gbG9jYWwobm9kZSkge1xuICB3aGlsZSAoIW5vZGUuX19icnVzaCkgaWYgKCEobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkpIHJldHVybjtcbiAgcmV0dXJuIG5vZGUuX19icnVzaDtcbn1cblxuZnVuY3Rpb24gZW1wdHkoZXh0ZW50KSB7XG4gIHJldHVybiBleHRlbnRbMF1bMF0gPT09IGV4dGVudFsxXVswXVxuICAgICAgfHwgZXh0ZW50WzBdWzFdID09PSBleHRlbnRbMV1bMV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBicnVzaFNlbGVjdGlvbihub2RlKSB7XG4gIHZhciBzdGF0ZSA9IG5vZGUuX19icnVzaDtcbiAgcmV0dXJuIHN0YXRlID8gc3RhdGUuZGltLm91dHB1dChzdGF0ZS5zZWxlY3Rpb24pIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJydXNoWCgpIHtcbiAgcmV0dXJuIGJydXNoKFgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJ1c2hZKCkge1xuICByZXR1cm4gYnJ1c2goWSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gYnJ1c2goWFkpO1xufVxuXG5mdW5jdGlvbiBicnVzaChkaW0pIHtcbiAgdmFyIGV4dGVudCA9IGRlZmF1bHRFeHRlbnQsXG4gICAgICBmaWx0ZXIgPSBkZWZhdWx0RmlsdGVyLFxuICAgICAgdG91Y2hhYmxlID0gZGVmYXVsdFRvdWNoYWJsZSxcbiAgICAgIGtleXMgPSB0cnVlLFxuICAgICAgbGlzdGVuZXJzID0gZGlzcGF0Y2goXCJzdGFydFwiLCBcImJydXNoXCIsIFwiZW5kXCIpLFxuICAgICAgaGFuZGxlU2l6ZSA9IDYsXG4gICAgICB0b3VjaGVuZGluZztcblxuICBmdW5jdGlvbiBicnVzaChncm91cCkge1xuICAgIHZhciBvdmVybGF5ID0gZ3JvdXBcbiAgICAgICAgLnByb3BlcnR5KFwiX19icnVzaFwiLCBpbml0aWFsaXplKVxuICAgICAgLnNlbGVjdEFsbChcIi5vdmVybGF5XCIpXG4gICAgICAuZGF0YShbdHlwZShcIm92ZXJsYXlcIildKTtcblxuICAgIG92ZXJsYXkuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJvdmVybGF5XCIpXG4gICAgICAgIC5hdHRyKFwicG9pbnRlci1ldmVudHNcIiwgXCJhbGxcIilcbiAgICAgICAgLmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29ycy5vdmVybGF5KVxuICAgICAgLm1lcmdlKG92ZXJsYXkpXG4gICAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBleHRlbnQgPSBsb2NhbCh0aGlzKS5leHRlbnQ7XG4gICAgICAgICAgc2VsZWN0KHRoaXMpXG4gICAgICAgICAgICAgIC5hdHRyKFwieFwiLCBleHRlbnRbMF1bMF0pXG4gICAgICAgICAgICAgIC5hdHRyKFwieVwiLCBleHRlbnRbMF1bMV0pXG4gICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZXh0ZW50WzFdWzBdIC0gZXh0ZW50WzBdWzBdKVxuICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBleHRlbnRbMV1bMV0gLSBleHRlbnRbMF1bMV0pO1xuICAgICAgICB9KTtcblxuICAgIGdyb3VwLnNlbGVjdEFsbChcIi5zZWxlY3Rpb25cIilcbiAgICAgIC5kYXRhKFt0eXBlKFwic2VsZWN0aW9uXCIpXSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInNlbGVjdGlvblwiKVxuICAgICAgICAuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzLnNlbGVjdGlvbilcbiAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiIzc3N1wiKVxuICAgICAgICAuYXR0cihcImZpbGwtb3BhY2l0eVwiLCAwLjMpXG4gICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiI2ZmZlwiKVxuICAgICAgICAuYXR0cihcInNoYXBlLXJlbmRlcmluZ1wiLCBcImNyaXNwRWRnZXNcIik7XG5cbiAgICB2YXIgaGFuZGxlID0gZ3JvdXAuc2VsZWN0QWxsKFwiLmhhbmRsZVwiKVxuICAgICAgLmRhdGEoZGltLmhhbmRsZXMsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZTsgfSk7XG5cbiAgICBoYW5kbGUuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgaGFuZGxlLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIFwiaGFuZGxlIGhhbmRsZS0tXCIgKyBkLnR5cGU7IH0pXG4gICAgICAgIC5hdHRyKFwiY3Vyc29yXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGN1cnNvcnNbZC50eXBlXTsgfSk7XG5cbiAgICBncm91cFxuICAgICAgICAuZWFjaChyZWRyYXcpXG4gICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgLmF0dHIoXCJwb2ludGVyLWV2ZW50c1wiLCBcImFsbFwiKVxuICAgICAgICAub24oXCJtb3VzZWRvd24uYnJ1c2hcIiwgc3RhcnRlZClcbiAgICAgIC5maWx0ZXIodG91Y2hhYmxlKVxuICAgICAgICAub24oXCJ0b3VjaHN0YXJ0LmJydXNoXCIsIHN0YXJ0ZWQpXG4gICAgICAgIC5vbihcInRvdWNobW92ZS5icnVzaFwiLCB0b3VjaG1vdmVkKVxuICAgICAgICAub24oXCJ0b3VjaGVuZC5icnVzaCB0b3VjaGNhbmNlbC5icnVzaFwiLCB0b3VjaGVuZGVkKVxuICAgICAgICAuc3R5bGUoXCJ0b3VjaC1hY3Rpb25cIiwgXCJub25lXCIpXG4gICAgICAgIC5zdHlsZShcIi13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvclwiLCBcInJnYmEoMCwwLDAsMClcIik7XG4gIH1cblxuICBicnVzaC5tb3ZlID0gZnVuY3Rpb24oZ3JvdXAsIHNlbGVjdGlvbiwgZXZlbnQpIHtcbiAgICBpZiAoZ3JvdXAudHdlZW4pIHtcbiAgICAgIGdyb3VwXG4gICAgICAgICAgLm9uKFwic3RhcnQuYnJ1c2hcIiwgZnVuY3Rpb24oZXZlbnQpIHsgZW1pdHRlcih0aGlzLCBhcmd1bWVudHMpLmJlZm9yZXN0YXJ0KCkuc3RhcnQoZXZlbnQpOyB9KVxuICAgICAgICAgIC5vbihcImludGVycnVwdC5icnVzaCBlbmQuYnJ1c2hcIiwgZnVuY3Rpb24oZXZlbnQpIHsgZW1pdHRlcih0aGlzLCBhcmd1bWVudHMpLmVuZChldmVudCk7IH0pXG4gICAgICAgICAgLnR3ZWVuKFwiYnJ1c2hcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0aGF0Ll9fYnJ1c2gsXG4gICAgICAgICAgICAgICAgZW1pdCA9IGVtaXR0ZXIodGhhdCwgYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24wID0gc3RhdGUuc2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjEgPSBkaW0uaW5wdXQodHlwZW9mIHNlbGVjdGlvbiA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBzZWxlY3Rpb24sIHN0YXRlLmV4dGVudCksXG4gICAgICAgICAgICAgICAgaSA9IGludGVycG9sYXRlKHNlbGVjdGlvbjAsIHNlbGVjdGlvbjEpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB0d2Vlbih0KSB7XG4gICAgICAgICAgICAgIHN0YXRlLnNlbGVjdGlvbiA9IHQgPT09IDEgJiYgc2VsZWN0aW9uMSA9PT0gbnVsbCA/IG51bGwgOiBpKHQpO1xuICAgICAgICAgICAgICByZWRyYXcuY2FsbCh0aGF0KTtcbiAgICAgICAgICAgICAgZW1pdC5icnVzaCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0aW9uMCAhPT0gbnVsbCAmJiBzZWxlY3Rpb24xICE9PSBudWxsID8gdHdlZW4gOiB0d2VlbigxKTtcbiAgICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JvdXBcbiAgICAgICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgIHN0YXRlID0gdGhhdC5fX2JydXNoLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjEgPSBkaW0uaW5wdXQodHlwZW9mIHNlbGVjdGlvbiA9PT0gXCJmdW5jdGlvblwiID8gc2VsZWN0aW9uLmFwcGx5KHRoYXQsIGFyZ3MpIDogc2VsZWN0aW9uLCBzdGF0ZS5leHRlbnQpLFxuICAgICAgICAgICAgICAgIGVtaXQgPSBlbWl0dGVyKHRoYXQsIGFyZ3MpLmJlZm9yZXN0YXJ0KCk7XG5cbiAgICAgICAgICAgIGludGVycnVwdCh0aGF0KTtcbiAgICAgICAgICAgIHN0YXRlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjEgPT09IG51bGwgPyBudWxsIDogc2VsZWN0aW9uMTtcbiAgICAgICAgICAgIHJlZHJhdy5jYWxsKHRoYXQpO1xuICAgICAgICAgICAgZW1pdC5zdGFydChldmVudCkuYnJ1c2goZXZlbnQpLmVuZChldmVudCk7XG4gICAgICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGJydXNoLmNsZWFyID0gZnVuY3Rpb24oZ3JvdXAsIGV2ZW50KSB7XG4gICAgYnJ1c2gubW92ZShncm91cCwgbnVsbCwgZXZlbnQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJlZHJhdygpIHtcbiAgICB2YXIgZ3JvdXAgPSBzZWxlY3QodGhpcyksXG4gICAgICAgIHNlbGVjdGlvbiA9IGxvY2FsKHRoaXMpLnNlbGVjdGlvbjtcblxuICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgIGdyb3VwLnNlbGVjdEFsbChcIi5zZWxlY3Rpb25cIilcbiAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIHNlbGVjdGlvblswXVswXSlcbiAgICAgICAgICAuYXR0cihcInlcIiwgc2VsZWN0aW9uWzBdWzFdKVxuICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgc2VsZWN0aW9uWzFdWzBdIC0gc2VsZWN0aW9uWzBdWzBdKVxuICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIHNlbGVjdGlvblsxXVsxXSAtIHNlbGVjdGlvblswXVsxXSk7XG5cbiAgICAgIGdyb3VwLnNlbGVjdEFsbChcIi5oYW5kbGVcIilcbiAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIG51bGwpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZVtkLnR5cGUubGVuZ3RoIC0gMV0gPT09IFwiZVwiID8gc2VsZWN0aW9uWzFdWzBdIC0gaGFuZGxlU2l6ZSAvIDIgOiBzZWxlY3Rpb25bMF1bMF0gLSBoYW5kbGVTaXplIC8gMjsgfSlcbiAgICAgICAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlWzBdID09PSBcInNcIiA/IHNlbGVjdGlvblsxXVsxXSAtIGhhbmRsZVNpemUgLyAyIDogc2VsZWN0aW9uWzBdWzFdIC0gaGFuZGxlU2l6ZSAvIDI7IH0pXG4gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGUgPT09IFwiblwiIHx8IGQudHlwZSA9PT0gXCJzXCIgPyBzZWxlY3Rpb25bMV1bMF0gLSBzZWxlY3Rpb25bMF1bMF0gKyBoYW5kbGVTaXplIDogaGFuZGxlU2l6ZTsgfSlcbiAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGUgPT09IFwiZVwiIHx8IGQudHlwZSA9PT0gXCJ3XCIgPyBzZWxlY3Rpb25bMV1bMV0gLSBzZWxlY3Rpb25bMF1bMV0gKyBoYW5kbGVTaXplIDogaGFuZGxlU2l6ZTsgfSk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICBncm91cC5zZWxlY3RBbGwoXCIuc2VsZWN0aW9uLC5oYW5kbGVcIilcbiAgICAgICAgICAuc3R5bGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCBudWxsKVxuICAgICAgICAgIC5hdHRyKFwieVwiLCBudWxsKVxuICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgbnVsbClcbiAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0dGVyKHRoYXQsIGFyZ3MsIGNsZWFuKSB7XG4gICAgdmFyIGVtaXQgPSB0aGF0Ll9fYnJ1c2guZW1pdHRlcjtcbiAgICByZXR1cm4gZW1pdCAmJiAoIWNsZWFuIHx8ICFlbWl0LmNsZWFuKSA/IGVtaXQgOiBuZXcgRW1pdHRlcih0aGF0LCBhcmdzLCBjbGVhbik7XG4gIH1cblxuICBmdW5jdGlvbiBFbWl0dGVyKHRoYXQsIGFyZ3MsIGNsZWFuKSB7XG4gICAgdGhpcy50aGF0ID0gdGhhdDtcbiAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIHRoaXMuc3RhdGUgPSB0aGF0Ll9fYnJ1c2g7XG4gICAgdGhpcy5hY3RpdmUgPSAwO1xuICAgIHRoaXMuY2xlYW4gPSBjbGVhbjtcbiAgfVxuXG4gIEVtaXR0ZXIucHJvdG90eXBlID0ge1xuICAgIGJlZm9yZXN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgrK3RoaXMuYWN0aXZlID09PSAxKSB0aGlzLnN0YXRlLmVtaXR0ZXIgPSB0aGlzLCB0aGlzLnN0YXJ0aW5nID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCBtb2RlKSB7XG4gICAgICBpZiAodGhpcy5zdGFydGluZykgdGhpcy5zdGFydGluZyA9IGZhbHNlLCB0aGlzLmVtaXQoXCJzdGFydFwiLCBldmVudCwgbW9kZSk7XG4gICAgICBlbHNlIHRoaXMuZW1pdChcImJydXNoXCIsIGV2ZW50KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYnJ1c2g6IGZ1bmN0aW9uKGV2ZW50LCBtb2RlKSB7XG4gICAgICB0aGlzLmVtaXQoXCJicnVzaFwiLCBldmVudCwgbW9kZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oZXZlbnQsIG1vZGUpIHtcbiAgICAgIGlmICgtLXRoaXMuYWN0aXZlID09PSAwKSBkZWxldGUgdGhpcy5zdGF0ZS5lbWl0dGVyLCB0aGlzLmVtaXQoXCJlbmRcIiwgZXZlbnQsIG1vZGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbih0eXBlLCBldmVudCwgbW9kZSkge1xuICAgICAgdmFyIGQgPSBzZWxlY3QodGhpcy50aGF0KS5kYXR1bSgpO1xuICAgICAgbGlzdGVuZXJzLmNhbGwoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHRoaXMudGhhdCxcbiAgICAgICAgbmV3IEJydXNoRXZlbnQodHlwZSwge1xuICAgICAgICAgIHNvdXJjZUV2ZW50OiBldmVudCxcbiAgICAgICAgICB0YXJnZXQ6IGJydXNoLFxuICAgICAgICAgIHNlbGVjdGlvbjogZGltLm91dHB1dCh0aGlzLnN0YXRlLnNlbGVjdGlvbiksXG4gICAgICAgICAgbW9kZSxcbiAgICAgICAgICBkaXNwYXRjaDogbGlzdGVuZXJzXG4gICAgICAgIH0pLFxuICAgICAgICBkXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBzdGFydGVkKGV2ZW50KSB7XG4gICAgaWYgKHRvdWNoZW5kaW5nICYmICFldmVudC50b3VjaGVzKSByZXR1cm47XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICB0eXBlID0gZXZlbnQudGFyZ2V0Ll9fZGF0YV9fLnR5cGUsXG4gICAgICAgIG1vZGUgPSAoa2V5cyAmJiBldmVudC5tZXRhS2V5ID8gdHlwZSA9IFwib3ZlcmxheVwiIDogdHlwZSkgPT09IFwic2VsZWN0aW9uXCIgPyBNT0RFX0RSQUcgOiAoa2V5cyAmJiBldmVudC5hbHRLZXkgPyBNT0RFX0NFTlRFUiA6IE1PREVfSEFORExFKSxcbiAgICAgICAgc2lnblggPSBkaW0gPT09IFkgPyBudWxsIDogc2lnbnNYW3R5cGVdLFxuICAgICAgICBzaWduWSA9IGRpbSA9PT0gWCA/IG51bGwgOiBzaWduc1lbdHlwZV0sXG4gICAgICAgIHN0YXRlID0gbG9jYWwodGhhdCksXG4gICAgICAgIGV4dGVudCA9IHN0YXRlLmV4dGVudCxcbiAgICAgICAgc2VsZWN0aW9uID0gc3RhdGUuc2VsZWN0aW9uLFxuICAgICAgICBXID0gZXh0ZW50WzBdWzBdLCB3MCwgdzEsXG4gICAgICAgIE4gPSBleHRlbnRbMF1bMV0sIG4wLCBuMSxcbiAgICAgICAgRSA9IGV4dGVudFsxXVswXSwgZTAsIGUxLFxuICAgICAgICBTID0gZXh0ZW50WzFdWzFdLCBzMCwgczEsXG4gICAgICAgIGR4ID0gMCxcbiAgICAgICAgZHkgPSAwLFxuICAgICAgICBtb3ZpbmcsXG4gICAgICAgIHNoaWZ0aW5nID0gc2lnblggJiYgc2lnblkgJiYga2V5cyAmJiBldmVudC5zaGlmdEtleSxcbiAgICAgICAgbG9ja1gsXG4gICAgICAgIGxvY2tZLFxuICAgICAgICBwb2ludHMgPSBBcnJheS5mcm9tKGV2ZW50LnRvdWNoZXMgfHwgW2V2ZW50XSwgdCA9PiB7XG4gICAgICAgICAgY29uc3QgaSA9IHQuaWRlbnRpZmllcjtcbiAgICAgICAgICB0ID0gcG9pbnRlcih0LCB0aGF0KTtcbiAgICAgICAgICB0LnBvaW50MCA9IHQuc2xpY2UoKTtcbiAgICAgICAgICB0LmlkZW50aWZpZXIgPSBpO1xuICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICB9KTtcblxuICAgIGludGVycnVwdCh0aGF0KTtcbiAgICB2YXIgZW1pdCA9IGVtaXR0ZXIodGhhdCwgYXJndW1lbnRzLCB0cnVlKS5iZWZvcmVzdGFydCgpO1xuXG4gICAgaWYgKHR5cGUgPT09IFwib3ZlcmxheVwiKSB7XG4gICAgICBpZiAoc2VsZWN0aW9uKSBtb3ZpbmcgPSB0cnVlO1xuICAgICAgY29uc3QgcHRzID0gW3BvaW50c1swXSwgcG9pbnRzWzFdIHx8IHBvaW50c1swXV07XG4gICAgICBzdGF0ZS5zZWxlY3Rpb24gPSBzZWxlY3Rpb24gPSBbW1xuICAgICAgICAgIHcwID0gZGltID09PSBZID8gVyA6IG1pbihwdHNbMF1bMF0sIHB0c1sxXVswXSksXG4gICAgICAgICAgbjAgPSBkaW0gPT09IFggPyBOIDogbWluKHB0c1swXVsxXSwgcHRzWzFdWzFdKVxuICAgICAgICBdLCBbXG4gICAgICAgICAgZTAgPSBkaW0gPT09IFkgPyBFIDogbWF4KHB0c1swXVswXSwgcHRzWzFdWzBdKSxcbiAgICAgICAgICBzMCA9IGRpbSA9PT0gWCA/IFMgOiBtYXgocHRzWzBdWzFdLCBwdHNbMV1bMV0pXG4gICAgICAgIF1dO1xuICAgICAgaWYgKHBvaW50cy5sZW5ndGggPiAxKSBtb3ZlKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdzAgPSBzZWxlY3Rpb25bMF1bMF07XG4gICAgICBuMCA9IHNlbGVjdGlvblswXVsxXTtcbiAgICAgIGUwID0gc2VsZWN0aW9uWzFdWzBdO1xuICAgICAgczAgPSBzZWxlY3Rpb25bMV1bMV07XG4gICAgfVxuXG4gICAgdzEgPSB3MDtcbiAgICBuMSA9IG4wO1xuICAgIGUxID0gZTA7XG4gICAgczEgPSBzMDtcblxuICAgIHZhciBncm91cCA9IHNlbGVjdCh0aGF0KVxuICAgICAgICAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKTtcblxuICAgIHZhciBvdmVybGF5ID0gZ3JvdXAuc2VsZWN0QWxsKFwiLm92ZXJsYXlcIilcbiAgICAgICAgLmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29yc1t0eXBlXSk7XG5cbiAgICBpZiAoZXZlbnQudG91Y2hlcykge1xuICAgICAgZW1pdC5tb3ZlZCA9IG1vdmVkO1xuICAgICAgZW1pdC5lbmRlZCA9IGVuZGVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IHNlbGVjdChldmVudC52aWV3KVxuICAgICAgICAgIC5vbihcIm1vdXNlbW92ZS5icnVzaFwiLCBtb3ZlZCwgdHJ1ZSlcbiAgICAgICAgICAub24oXCJtb3VzZXVwLmJydXNoXCIsIGVuZGVkLCB0cnVlKTtcbiAgICAgIGlmIChrZXlzKSB2aWV3XG4gICAgICAgICAgLm9uKFwia2V5ZG93bi5icnVzaFwiLCBrZXlkb3duZWQsIHRydWUpXG4gICAgICAgICAgLm9uKFwia2V5dXAuYnJ1c2hcIiwga2V5dXBwZWQsIHRydWUpXG5cbiAgICAgIGRyYWdEaXNhYmxlKGV2ZW50LnZpZXcpO1xuICAgIH1cblxuICAgIHJlZHJhdy5jYWxsKHRoYXQpO1xuICAgIGVtaXQuc3RhcnQoZXZlbnQsIG1vZGUubmFtZSk7XG5cbiAgICBmdW5jdGlvbiBtb3ZlZChldmVudCkge1xuICAgICAgZm9yIChjb25zdCBwIG9mIGV2ZW50LmNoYW5nZWRUb3VjaGVzIHx8IFtldmVudF0pIHtcbiAgICAgICAgZm9yIChjb25zdCBkIG9mIHBvaW50cylcbiAgICAgICAgICBpZiAoZC5pZGVudGlmaWVyID09PSBwLmlkZW50aWZpZXIpIGQuY3VyID0gcG9pbnRlcihwLCB0aGF0KTtcbiAgICAgIH1cbiAgICAgIGlmIChzaGlmdGluZyAmJiAhbG9ja1ggJiYgIWxvY2tZICYmIHBvaW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3QgcG9pbnQgPSBwb2ludHNbMF07XG4gICAgICAgIGlmIChhYnMocG9pbnQuY3VyWzBdIC0gcG9pbnRbMF0pID4gYWJzKHBvaW50LmN1clsxXSAtIHBvaW50WzFdKSlcbiAgICAgICAgICBsb2NrWSA9IHRydWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsb2NrWCA9IHRydWU7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cylcbiAgICAgICAgaWYgKHBvaW50LmN1cikgcG9pbnRbMF0gPSBwb2ludC5jdXJbMF0sIHBvaW50WzFdID0gcG9pbnQuY3VyWzFdO1xuICAgICAgbW92aW5nID0gdHJ1ZTtcbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgICAgbW92ZShldmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW92ZShldmVudCkge1xuICAgICAgY29uc3QgcG9pbnQgPSBwb2ludHNbMF0sIHBvaW50MCA9IHBvaW50LnBvaW50MDtcbiAgICAgIHZhciB0O1xuXG4gICAgICBkeCA9IHBvaW50WzBdIC0gcG9pbnQwWzBdO1xuICAgICAgZHkgPSBwb2ludFsxXSAtIHBvaW50MFsxXTtcblxuICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgIGNhc2UgTU9ERV9TUEFDRTpcbiAgICAgICAgY2FzZSBNT0RFX0RSQUc6IHtcbiAgICAgICAgICBpZiAoc2lnblgpIGR4ID0gbWF4KFcgLSB3MCwgbWluKEUgLSBlMCwgZHgpKSwgdzEgPSB3MCArIGR4LCBlMSA9IGUwICsgZHg7XG4gICAgICAgICAgaWYgKHNpZ25ZKSBkeSA9IG1heChOIC0gbjAsIG1pbihTIC0gczAsIGR5KSksIG4xID0gbjAgKyBkeSwgczEgPSBzMCArIGR5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgTU9ERV9IQU5ETEU6IHtcbiAgICAgICAgICBpZiAocG9pbnRzWzFdKSB7XG4gICAgICAgICAgICBpZiAoc2lnblgpIHcxID0gbWF4KFcsIG1pbihFLCBwb2ludHNbMF1bMF0pKSwgZTEgPSBtYXgoVywgbWluKEUsIHBvaW50c1sxXVswXSkpLCBzaWduWCA9IDE7XG4gICAgICAgICAgICBpZiAoc2lnblkpIG4xID0gbWF4KE4sIG1pbihTLCBwb2ludHNbMF1bMV0pKSwgczEgPSBtYXgoTiwgbWluKFMsIHBvaW50c1sxXVsxXSkpLCBzaWduWSA9IDE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzaWduWCA8IDApIGR4ID0gbWF4KFcgLSB3MCwgbWluKEUgLSB3MCwgZHgpKSwgdzEgPSB3MCArIGR4LCBlMSA9IGUwO1xuICAgICAgICAgICAgZWxzZSBpZiAoc2lnblggPiAwKSBkeCA9IG1heChXIC0gZTAsIG1pbihFIC0gZTAsIGR4KSksIHcxID0gdzAsIGUxID0gZTAgKyBkeDtcbiAgICAgICAgICAgIGlmIChzaWduWSA8IDApIGR5ID0gbWF4KE4gLSBuMCwgbWluKFMgLSBuMCwgZHkpKSwgbjEgPSBuMCArIGR5LCBzMSA9IHMwO1xuICAgICAgICAgICAgZWxzZSBpZiAoc2lnblkgPiAwKSBkeSA9IG1heChOIC0gczAsIG1pbihTIC0gczAsIGR5KSksIG4xID0gbjAsIHMxID0gczAgKyBkeTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBNT0RFX0NFTlRFUjoge1xuICAgICAgICAgIGlmIChzaWduWCkgdzEgPSBtYXgoVywgbWluKEUsIHcwIC0gZHggKiBzaWduWCkpLCBlMSA9IG1heChXLCBtaW4oRSwgZTAgKyBkeCAqIHNpZ25YKSk7XG4gICAgICAgICAgaWYgKHNpZ25ZKSBuMSA9IG1heChOLCBtaW4oUywgbjAgLSBkeSAqIHNpZ25ZKSksIHMxID0gbWF4KE4sIG1pbihTLCBzMCArIGR5ICogc2lnblkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZTEgPCB3MSkge1xuICAgICAgICBzaWduWCAqPSAtMTtcbiAgICAgICAgdCA9IHcwLCB3MCA9IGUwLCBlMCA9IHQ7XG4gICAgICAgIHQgPSB3MSwgdzEgPSBlMSwgZTEgPSB0O1xuICAgICAgICBpZiAodHlwZSBpbiBmbGlwWCkgb3ZlcmxheS5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnNbdHlwZSA9IGZsaXBYW3R5cGVdXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzMSA8IG4xKSB7XG4gICAgICAgIHNpZ25ZICo9IC0xO1xuICAgICAgICB0ID0gbjAsIG4wID0gczAsIHMwID0gdDtcbiAgICAgICAgdCA9IG4xLCBuMSA9IHMxLCBzMSA9IHQ7XG4gICAgICAgIGlmICh0eXBlIGluIGZsaXBZKSBvdmVybGF5LmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29yc1t0eXBlID0gZmxpcFlbdHlwZV1dKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLnNlbGVjdGlvbikgc2VsZWN0aW9uID0gc3RhdGUuc2VsZWN0aW9uOyAvLyBNYXkgYmUgc2V0IGJ5IGJydXNoLm1vdmUhXG4gICAgICBpZiAobG9ja1gpIHcxID0gc2VsZWN0aW9uWzBdWzBdLCBlMSA9IHNlbGVjdGlvblsxXVswXTtcbiAgICAgIGlmIChsb2NrWSkgbjEgPSBzZWxlY3Rpb25bMF1bMV0sIHMxID0gc2VsZWN0aW9uWzFdWzFdO1xuXG4gICAgICBpZiAoc2VsZWN0aW9uWzBdWzBdICE9PSB3MVxuICAgICAgICAgIHx8IHNlbGVjdGlvblswXVsxXSAhPT0gbjFcbiAgICAgICAgICB8fCBzZWxlY3Rpb25bMV1bMF0gIT09IGUxXG4gICAgICAgICAgfHwgc2VsZWN0aW9uWzFdWzFdICE9PSBzMSkge1xuICAgICAgICBzdGF0ZS5zZWxlY3Rpb24gPSBbW3cxLCBuMV0sIFtlMSwgczFdXTtcbiAgICAgICAgcmVkcmF3LmNhbGwodGhhdCk7XG4gICAgICAgIGVtaXQuYnJ1c2goZXZlbnQsIG1vZGUubmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kZWQoZXZlbnQpIHtcbiAgICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgICAgaWYgKGV2ZW50LnRvdWNoZXMpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRvdWNoZXMubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIGlmICh0b3VjaGVuZGluZykgY2xlYXJUaW1lb3V0KHRvdWNoZW5kaW5nKTtcbiAgICAgICAgdG91Y2hlbmRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0b3VjaGVuZGluZyA9IG51bGw7IH0sIDUwMCk7IC8vIEdob3N0IGNsaWNrcyBhcmUgZGVsYXllZCFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyYWdFbmFibGUoZXZlbnQudmlldywgbW92aW5nKTtcbiAgICAgICAgdmlldy5vbihcImtleWRvd24uYnJ1c2gga2V5dXAuYnJ1c2ggbW91c2Vtb3ZlLmJydXNoIG1vdXNldXAuYnJ1c2hcIiwgbnVsbCk7XG4gICAgICB9XG4gICAgICBncm91cC5hdHRyKFwicG9pbnRlci1ldmVudHNcIiwgXCJhbGxcIik7XG4gICAgICBvdmVybGF5LmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29ycy5vdmVybGF5KTtcbiAgICAgIGlmIChzdGF0ZS5zZWxlY3Rpb24pIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbjsgLy8gTWF5IGJlIHNldCBieSBicnVzaC5tb3ZlIChvbiBzdGFydCkhXG4gICAgICBpZiAoZW1wdHkoc2VsZWN0aW9uKSkgc3RhdGUuc2VsZWN0aW9uID0gbnVsbCwgcmVkcmF3LmNhbGwodGhhdCk7XG4gICAgICBlbWl0LmVuZChldmVudCwgbW9kZS5uYW1lKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrZXlkb3duZWQoZXZlbnQpIHtcbiAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICBjYXNlIDE2OiB7IC8vIFNISUZUXG4gICAgICAgICAgc2hpZnRpbmcgPSBzaWduWCAmJiBzaWduWTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDE4OiB7IC8vIEFMVFxuICAgICAgICAgIGlmIChtb2RlID09PSBNT0RFX0hBTkRMRSkge1xuICAgICAgICAgICAgaWYgKHNpZ25YKSBlMCA9IGUxIC0gZHggKiBzaWduWCwgdzAgPSB3MSArIGR4ICogc2lnblg7XG4gICAgICAgICAgICBpZiAoc2lnblkpIHMwID0gczEgLSBkeSAqIHNpZ25ZLCBuMCA9IG4xICsgZHkgKiBzaWduWTtcbiAgICAgICAgICAgIG1vZGUgPSBNT0RFX0NFTlRFUjtcbiAgICAgICAgICAgIG1vdmUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDMyOiB7IC8vIFNQQUNFOyB0YWtlcyBwcmlvcml0eSBvdmVyIEFMVFxuICAgICAgICAgIGlmIChtb2RlID09PSBNT0RFX0hBTkRMRSB8fCBtb2RlID09PSBNT0RFX0NFTlRFUikge1xuICAgICAgICAgICAgaWYgKHNpZ25YIDwgMCkgZTAgPSBlMSAtIGR4OyBlbHNlIGlmIChzaWduWCA+IDApIHcwID0gdzEgLSBkeDtcbiAgICAgICAgICAgIGlmIChzaWduWSA8IDApIHMwID0gczEgLSBkeTsgZWxzZSBpZiAoc2lnblkgPiAwKSBuMCA9IG4xIC0gZHk7XG4gICAgICAgICAgICBtb2RlID0gTU9ERV9TUEFDRTtcbiAgICAgICAgICAgIG92ZXJsYXkuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBtb3ZlKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgICAgfVxuICAgICAgbm9ldmVudChldmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5dXBwZWQoZXZlbnQpIHtcbiAgICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgICBjYXNlIDE2OiB7IC8vIFNISUZUXG4gICAgICAgICAgaWYgKHNoaWZ0aW5nKSB7XG4gICAgICAgICAgICBsb2NrWCA9IGxvY2tZID0gc2hpZnRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG1vdmUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDE4OiB7IC8vIEFMVFxuICAgICAgICAgIGlmIChtb2RlID09PSBNT0RFX0NFTlRFUikge1xuICAgICAgICAgICAgaWYgKHNpZ25YIDwgMCkgZTAgPSBlMTsgZWxzZSBpZiAoc2lnblggPiAwKSB3MCA9IHcxO1xuICAgICAgICAgICAgaWYgKHNpZ25ZIDwgMCkgczAgPSBzMTsgZWxzZSBpZiAoc2lnblkgPiAwKSBuMCA9IG4xO1xuICAgICAgICAgICAgbW9kZSA9IE1PREVfSEFORExFO1xuICAgICAgICAgICAgbW92ZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMzI6IHsgLy8gU1BBQ0VcbiAgICAgICAgICBpZiAobW9kZSA9PT0gTU9ERV9TUEFDRSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgICBpZiAoc2lnblgpIGUwID0gZTEgLSBkeCAqIHNpZ25YLCB3MCA9IHcxICsgZHggKiBzaWduWDtcbiAgICAgICAgICAgICAgaWYgKHNpZ25ZKSBzMCA9IHMxIC0gZHkgKiBzaWduWSwgbjAgPSBuMSArIGR5ICogc2lnblk7XG4gICAgICAgICAgICAgIG1vZGUgPSBNT0RFX0NFTlRFUjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChzaWduWCA8IDApIGUwID0gZTE7IGVsc2UgaWYgKHNpZ25YID4gMCkgdzAgPSB3MTtcbiAgICAgICAgICAgICAgaWYgKHNpZ25ZIDwgMCkgczAgPSBzMTsgZWxzZSBpZiAoc2lnblkgPiAwKSBuMCA9IG4xO1xuICAgICAgICAgICAgICBtb2RlID0gTU9ERV9IQU5ETEU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdmVybGF5LmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29yc1t0eXBlXSk7XG4gICAgICAgICAgICBtb3ZlKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDogcmV0dXJuO1xuICAgICAgfVxuICAgICAgbm9ldmVudChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2htb3ZlZChldmVudCkge1xuICAgIGVtaXR0ZXIodGhpcywgYXJndW1lbnRzKS5tb3ZlZChldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaGVuZGVkKGV2ZW50KSB7XG4gICAgZW1pdHRlcih0aGlzLCBhcmd1bWVudHMpLmVuZGVkKGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fX2JydXNoIHx8IHtzZWxlY3Rpb246IG51bGx9O1xuICAgIHN0YXRlLmV4dGVudCA9IG51bWJlcjIoZXh0ZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIHN0YXRlLmRpbSA9IGRpbTtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICBicnVzaC5leHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXh0ZW50ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudChudW1iZXIyKF8pKSwgYnJ1c2gpIDogZXh0ZW50O1xuICB9O1xuXG4gIGJydXNoLmZpbHRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmaWx0ZXIgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIGJydXNoKSA6IGZpbHRlcjtcbiAgfTtcblxuICBicnVzaC50b3VjaGFibGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hhYmxlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCBicnVzaCkgOiB0b3VjaGFibGU7XG4gIH07XG5cbiAgYnJ1c2guaGFuZGxlU2l6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChoYW5kbGVTaXplID0gK18sIGJydXNoKSA6IGhhbmRsZVNpemU7XG4gIH07XG5cbiAgYnJ1c2gua2V5TW9kaWZpZXJzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGtleXMgPSAhIV8sIGJydXNoKSA6IGtleXM7XG4gIH07XG5cbiAgYnJ1c2gub24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUgPSBsaXN0ZW5lcnMub24uYXBwbHkobGlzdGVuZXJzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbGlzdGVuZXJzID8gYnJ1c2ggOiB2YWx1ZTtcbiAgfTtcblxuICByZXR1cm4gYnJ1c2g7XG59XG4iLCAiY29uc3QgcGkgPSBNYXRoLlBJLFxuICAgIHRhdSA9IDIgKiBwaSxcbiAgICBlcHNpbG9uID0gMWUtNixcbiAgICB0YXVFcHNpbG9uID0gdGF1IC0gZXBzaWxvbjtcblxuZnVuY3Rpb24gYXBwZW5kKHN0cmluZ3MpIHtcbiAgdGhpcy5fICs9IHN0cmluZ3NbMF07XG4gIGZvciAobGV0IGkgPSAxLCBuID0gc3RyaW5ncy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICB0aGlzLl8gKz0gYXJndW1lbnRzW2ldICsgc3RyaW5nc1tpXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhcHBlbmRSb3VuZChkaWdpdHMpIHtcbiAgbGV0IGQgPSBNYXRoLmZsb29yKGRpZ2l0cyk7XG4gIGlmICghKGQgPj0gMCkpIHRocm93IG5ldyBFcnJvcihgaW52YWxpZCBkaWdpdHM6ICR7ZGlnaXRzfWApO1xuICBpZiAoZCA+IDE1KSByZXR1cm4gYXBwZW5kO1xuICBjb25zdCBrID0gMTAgKiogZDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZ3MpIHtcbiAgICB0aGlzLl8gKz0gc3RyaW5nc1swXTtcbiAgICBmb3IgKGxldCBpID0gMSwgbiA9IHN0cmluZ3MubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICB0aGlzLl8gKz0gTWF0aC5yb3VuZChhcmd1bWVudHNbaV0gKiBrKSAvIGsgKyBzdHJpbmdzW2ldO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFBhdGgge1xuICBjb25zdHJ1Y3RvcihkaWdpdHMpIHtcbiAgICB0aGlzLl94MCA9IHRoaXMuX3kwID0gLy8gc3RhcnQgb2YgY3VycmVudCBzdWJwYXRoXG4gICAgdGhpcy5feDEgPSB0aGlzLl95MSA9IG51bGw7IC8vIGVuZCBvZiBjdXJyZW50IHN1YnBhdGhcbiAgICB0aGlzLl8gPSBcIlwiO1xuICAgIHRoaXMuX2FwcGVuZCA9IGRpZ2l0cyA9PSBudWxsID8gYXBwZW5kIDogYXBwZW5kUm91bmQoZGlnaXRzKTtcbiAgfVxuICBtb3ZlVG8oeCwgeSkge1xuICAgIHRoaXMuX2FwcGVuZGBNJHt0aGlzLl94MCA9IHRoaXMuX3gxID0gK3h9LCR7dGhpcy5feTAgPSB0aGlzLl95MSA9ICt5fWA7XG4gIH1cbiAgY2xvc2VQYXRoKCkge1xuICAgIGlmICh0aGlzLl94MSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5feDEgPSB0aGlzLl94MCwgdGhpcy5feTEgPSB0aGlzLl95MDtcbiAgICAgIHRoaXMuX2FwcGVuZGBaYDtcbiAgICB9XG4gIH1cbiAgbGluZVRvKHgsIHkpIHtcbiAgICB0aGlzLl9hcHBlbmRgTCR7dGhpcy5feDEgPSAreH0sJHt0aGlzLl95MSA9ICt5fWA7XG4gIH1cbiAgcXVhZHJhdGljQ3VydmVUbyh4MSwgeTEsIHgsIHkpIHtcbiAgICB0aGlzLl9hcHBlbmRgUSR7K3gxfSwkeyt5MX0sJHt0aGlzLl94MSA9ICt4fSwke3RoaXMuX3kxID0gK3l9YDtcbiAgfVxuICBiZXppZXJDdXJ2ZVRvKHgxLCB5MSwgeDIsIHkyLCB4LCB5KSB7XG4gICAgdGhpcy5fYXBwZW5kYEMkeyt4MX0sJHsreTF9LCR7K3gyfSwkeyt5Mn0sJHt0aGlzLl94MSA9ICt4fSwke3RoaXMuX3kxID0gK3l9YDtcbiAgfVxuICBhcmNUbyh4MSwgeTEsIHgyLCB5Miwgcikge1xuICAgIHgxID0gK3gxLCB5MSA9ICt5MSwgeDIgPSAreDIsIHkyID0gK3kyLCByID0gK3I7XG5cbiAgICAvLyBJcyB0aGUgcmFkaXVzIG5lZ2F0aXZlPyBFcnJvci5cbiAgICBpZiAociA8IDApIHRocm93IG5ldyBFcnJvcihgbmVnYXRpdmUgcmFkaXVzOiAke3J9YCk7XG5cbiAgICBsZXQgeDAgPSB0aGlzLl94MSxcbiAgICAgICAgeTAgPSB0aGlzLl95MSxcbiAgICAgICAgeDIxID0geDIgLSB4MSxcbiAgICAgICAgeTIxID0geTIgLSB5MSxcbiAgICAgICAgeDAxID0geDAgLSB4MSxcbiAgICAgICAgeTAxID0geTAgLSB5MSxcbiAgICAgICAgbDAxXzIgPSB4MDEgKiB4MDEgKyB5MDEgKiB5MDE7XG5cbiAgICAvLyBJcyB0aGlzIHBhdGggZW1wdHk/IE1vdmUgdG8gKHgxLHkxKS5cbiAgICBpZiAodGhpcy5feDEgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2FwcGVuZGBNJHt0aGlzLl94MSA9IHgxfSwke3RoaXMuX3kxID0geTF9YDtcbiAgICB9XG5cbiAgICAvLyBPciwgaXMgKHgxLHkxKSBjb2luY2lkZW50IHdpdGggKHgwLHkwKT8gRG8gbm90aGluZy5cbiAgICBlbHNlIGlmICghKGwwMV8yID4gZXBzaWxvbikpO1xuXG4gICAgLy8gT3IsIGFyZSAoeDAseTApLCAoeDEseTEpIGFuZCAoeDIseTIpIGNvbGxpbmVhcj9cbiAgICAvLyBFcXVpdmFsZW50bHksIGlzICh4MSx5MSkgY29pbmNpZGVudCB3aXRoICh4Mix5Mik/XG4gICAgLy8gT3IsIGlzIHRoZSByYWRpdXMgemVybz8gTGluZSB0byAoeDEseTEpLlxuICAgIGVsc2UgaWYgKCEoTWF0aC5hYnMoeTAxICogeDIxIC0geTIxICogeDAxKSA+IGVwc2lsb24pIHx8ICFyKSB7XG4gICAgICB0aGlzLl9hcHBlbmRgTCR7dGhpcy5feDEgPSB4MX0sJHt0aGlzLl95MSA9IHkxfWA7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBkcmF3IGFuIGFyYyFcbiAgICBlbHNlIHtcbiAgICAgIGxldCB4MjAgPSB4MiAtIHgwLFxuICAgICAgICAgIHkyMCA9IHkyIC0geTAsXG4gICAgICAgICAgbDIxXzIgPSB4MjEgKiB4MjEgKyB5MjEgKiB5MjEsXG4gICAgICAgICAgbDIwXzIgPSB4MjAgKiB4MjAgKyB5MjAgKiB5MjAsXG4gICAgICAgICAgbDIxID0gTWF0aC5zcXJ0KGwyMV8yKSxcbiAgICAgICAgICBsMDEgPSBNYXRoLnNxcnQobDAxXzIpLFxuICAgICAgICAgIGwgPSByICogTWF0aC50YW4oKHBpIC0gTWF0aC5hY29zKChsMjFfMiArIGwwMV8yIC0gbDIwXzIpIC8gKDIgKiBsMjEgKiBsMDEpKSkgLyAyKSxcbiAgICAgICAgICB0MDEgPSBsIC8gbDAxLFxuICAgICAgICAgIHQyMSA9IGwgLyBsMjE7XG5cbiAgICAgIC8vIElmIHRoZSBzdGFydCB0YW5nZW50IGlzIG5vdCBjb2luY2lkZW50IHdpdGggKHgwLHkwKSwgbGluZSB0by5cbiAgICAgIGlmIChNYXRoLmFicyh0MDEgLSAxKSA+IGVwc2lsb24pIHtcbiAgICAgICAgdGhpcy5fYXBwZW5kYEwke3gxICsgdDAxICogeDAxfSwke3kxICsgdDAxICogeTAxfWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2FwcGVuZGBBJHtyfSwke3J9LDAsMCwkeysoeTAxICogeDIwID4geDAxICogeTIwKX0sJHt0aGlzLl94MSA9IHgxICsgdDIxICogeDIxfSwke3RoaXMuX3kxID0geTEgKyB0MjEgKiB5MjF9YDtcbiAgICB9XG4gIH1cbiAgYXJjKHgsIHksIHIsIGEwLCBhMSwgY2N3KSB7XG4gICAgeCA9ICt4LCB5ID0gK3ksIHIgPSArciwgY2N3ID0gISFjY3c7XG5cbiAgICAvLyBJcyB0aGUgcmFkaXVzIG5lZ2F0aXZlPyBFcnJvci5cbiAgICBpZiAociA8IDApIHRocm93IG5ldyBFcnJvcihgbmVnYXRpdmUgcmFkaXVzOiAke3J9YCk7XG5cbiAgICBsZXQgZHggPSByICogTWF0aC5jb3MoYTApLFxuICAgICAgICBkeSA9IHIgKiBNYXRoLnNpbihhMCksXG4gICAgICAgIHgwID0geCArIGR4LFxuICAgICAgICB5MCA9IHkgKyBkeSxcbiAgICAgICAgY3cgPSAxIF4gY2N3LFxuICAgICAgICBkYSA9IGNjdyA/IGEwIC0gYTEgOiBhMSAtIGEwO1xuXG4gICAgLy8gSXMgdGhpcyBwYXRoIGVtcHR5PyBNb3ZlIHRvICh4MCx5MCkuXG4gICAgaWYgKHRoaXMuX3gxID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9hcHBlbmRgTSR7eDB9LCR7eTB9YDtcbiAgICB9XG5cbiAgICAvLyBPciwgaXMgKHgwLHkwKSBub3QgY29pbmNpZGVudCB3aXRoIHRoZSBwcmV2aW91cyBwb2ludD8gTGluZSB0byAoeDAseTApLlxuICAgIGVsc2UgaWYgKE1hdGguYWJzKHRoaXMuX3gxIC0geDApID4gZXBzaWxvbiB8fCBNYXRoLmFicyh0aGlzLl95MSAtIHkwKSA+IGVwc2lsb24pIHtcbiAgICAgIHRoaXMuX2FwcGVuZGBMJHt4MH0sJHt5MH1gO1xuICAgIH1cblxuICAgIC8vIElzIHRoaXMgYXJjIGVtcHR5PyBXZVx1MjAxOXJlIGRvbmUuXG4gICAgaWYgKCFyKSByZXR1cm47XG5cbiAgICAvLyBEb2VzIHRoZSBhbmdsZSBnbyB0aGUgd3Jvbmcgd2F5PyBGbGlwIHRoZSBkaXJlY3Rpb24uXG4gICAgaWYgKGRhIDwgMCkgZGEgPSBkYSAlIHRhdSArIHRhdTtcblxuICAgIC8vIElzIHRoaXMgYSBjb21wbGV0ZSBjaXJjbGU/IERyYXcgdHdvIGFyY3MgdG8gY29tcGxldGUgdGhlIGNpcmNsZS5cbiAgICBpZiAoZGEgPiB0YXVFcHNpbG9uKSB7XG4gICAgICB0aGlzLl9hcHBlbmRgQSR7cn0sJHtyfSwwLDEsJHtjd30sJHt4IC0gZHh9LCR7eSAtIGR5fUEke3J9LCR7cn0sMCwxLCR7Y3d9LCR7dGhpcy5feDEgPSB4MH0sJHt0aGlzLl95MSA9IHkwfWA7XG4gICAgfVxuXG4gICAgLy8gSXMgdGhpcyBhcmMgbm9uLWVtcHR5PyBEcmF3IGFuIGFyYyFcbiAgICBlbHNlIGlmIChkYSA+IGVwc2lsb24pIHtcbiAgICAgIHRoaXMuX2FwcGVuZGBBJHtyfSwke3J9LDAsJHsrKGRhID49IHBpKX0sJHtjd30sJHt0aGlzLl94MSA9IHggKyByICogTWF0aC5jb3MoYTEpfSwke3RoaXMuX3kxID0geSArIHIgKiBNYXRoLnNpbihhMSl9YDtcbiAgICB9XG4gIH1cbiAgcmVjdCh4LCB5LCB3LCBoKSB7XG4gICAgdGhpcy5fYXBwZW5kYE0ke3RoaXMuX3gwID0gdGhpcy5feDEgPSAreH0sJHt0aGlzLl95MCA9IHRoaXMuX3kxID0gK3l9aCR7dyA9ICt3fXYkeytofWgkey13fVpgO1xuICB9XG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl87XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGgoKSB7XG4gIHJldHVybiBuZXcgUGF0aDtcbn1cblxuLy8gQWxsb3cgaW5zdGFuY2VvZiBkMy5wYXRoXG5wYXRoLnByb3RvdHlwZSA9IFBhdGgucHJvdG90eXBlO1xuXG5leHBvcnQgZnVuY3Rpb24gcGF0aFJvdW5kKGRpZ2l0cyA9IDMpIHtcbiAgcmV0dXJuIG5ldyBQYXRoKCtkaWdpdHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGQpIHtcbiAgY29uc3QgeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCksXG4gICAgICB5ID0gK3RoaXMuX3kuY2FsbChudWxsLCBkKTtcbiAgcmV0dXJuIGFkZCh0aGlzLmNvdmVyKHgsIHkpLCB4LCB5LCBkKTtcbn1cblxuZnVuY3Rpb24gYWRkKHRyZWUsIHgsIHksIGQpIHtcbiAgaWYgKGlzTmFOKHgpIHx8IGlzTmFOKHkpKSByZXR1cm4gdHJlZTsgLy8gaWdub3JlIGludmFsaWQgcG9pbnRzXG5cbiAgdmFyIHBhcmVudCxcbiAgICAgIG5vZGUgPSB0cmVlLl9yb290LFxuICAgICAgbGVhZiA9IHtkYXRhOiBkfSxcbiAgICAgIHgwID0gdHJlZS5feDAsXG4gICAgICB5MCA9IHRyZWUuX3kwLFxuICAgICAgeDEgPSB0cmVlLl94MSxcbiAgICAgIHkxID0gdHJlZS5feTEsXG4gICAgICB4bSxcbiAgICAgIHltLFxuICAgICAgeHAsXG4gICAgICB5cCxcbiAgICAgIHJpZ2h0LFxuICAgICAgYm90dG9tLFxuICAgICAgaSxcbiAgICAgIGo7XG5cbiAgLy8gSWYgdGhlIHRyZWUgaXMgZW1wdHksIGluaXRpYWxpemUgdGhlIHJvb3QgYXMgYSBsZWFmLlxuICBpZiAoIW5vZGUpIHJldHVybiB0cmVlLl9yb290ID0gbGVhZiwgdHJlZTtcblxuICAvLyBGaW5kIHRoZSBleGlzdGluZyBsZWFmIGZvciB0aGUgbmV3IHBvaW50LCBvciBhZGQgaXQuXG4gIHdoaWxlIChub2RlLmxlbmd0aCkge1xuICAgIGlmIChyaWdodCA9IHggPj0gKHhtID0gKHgwICsgeDEpIC8gMikpIHgwID0geG07IGVsc2UgeDEgPSB4bTtcbiAgICBpZiAoYm90dG9tID0geSA+PSAoeW0gPSAoeTAgKyB5MSkgLyAyKSkgeTAgPSB5bTsgZWxzZSB5MSA9IHltO1xuICAgIGlmIChwYXJlbnQgPSBub2RlLCAhKG5vZGUgPSBub2RlW2kgPSBib3R0b20gPDwgMSB8IHJpZ2h0XSkpIHJldHVybiBwYXJlbnRbaV0gPSBsZWFmLCB0cmVlO1xuICB9XG5cbiAgLy8gSXMgdGhlIG5ldyBwb2ludCBpcyBleGFjdGx5IGNvaW5jaWRlbnQgd2l0aCB0aGUgZXhpc3RpbmcgcG9pbnQ/XG4gIHhwID0gK3RyZWUuX3guY2FsbChudWxsLCBub2RlLmRhdGEpO1xuICB5cCA9ICt0cmVlLl95LmNhbGwobnVsbCwgbm9kZS5kYXRhKTtcbiAgaWYgKHggPT09IHhwICYmIHkgPT09IHlwKSByZXR1cm4gbGVhZi5uZXh0ID0gbm9kZSwgcGFyZW50ID8gcGFyZW50W2ldID0gbGVhZiA6IHRyZWUuX3Jvb3QgPSBsZWFmLCB0cmVlO1xuXG4gIC8vIE90aGVyd2lzZSwgc3BsaXQgdGhlIGxlYWYgbm9kZSB1bnRpbCB0aGUgb2xkIGFuZCBuZXcgcG9pbnQgYXJlIHNlcGFyYXRlZC5cbiAgZG8ge1xuICAgIHBhcmVudCA9IHBhcmVudCA/IHBhcmVudFtpXSA9IG5ldyBBcnJheSg0KSA6IHRyZWUuX3Jvb3QgPSBuZXcgQXJyYXkoNCk7XG4gICAgaWYgKHJpZ2h0ID0geCA+PSAoeG0gPSAoeDAgKyB4MSkgLyAyKSkgeDAgPSB4bTsgZWxzZSB4MSA9IHhtO1xuICAgIGlmIChib3R0b20gPSB5ID49ICh5bSA9ICh5MCArIHkxKSAvIDIpKSB5MCA9IHltOyBlbHNlIHkxID0geW07XG4gIH0gd2hpbGUgKChpID0gYm90dG9tIDw8IDEgfCByaWdodCkgPT09IChqID0gKHlwID49IHltKSA8PCAxIHwgKHhwID49IHhtKSkpO1xuICByZXR1cm4gcGFyZW50W2pdID0gbm9kZSwgcGFyZW50W2ldID0gbGVhZiwgdHJlZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFsbChkYXRhKSB7XG4gIHZhciBkLCBpLCBuID0gZGF0YS5sZW5ndGgsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHh6ID0gbmV3IEFycmF5KG4pLFxuICAgICAgeXogPSBuZXcgQXJyYXkobiksXG4gICAgICB4MCA9IEluZmluaXR5LFxuICAgICAgeTAgPSBJbmZpbml0eSxcbiAgICAgIHgxID0gLUluZmluaXR5LFxuICAgICAgeTEgPSAtSW5maW5pdHk7XG5cbiAgLy8gQ29tcHV0ZSB0aGUgcG9pbnRzIGFuZCB0aGVpciBleHRlbnQuXG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoaXNOYU4oeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCA9IGRhdGFbaV0pKSB8fCBpc05hTih5ID0gK3RoaXMuX3kuY2FsbChudWxsLCBkKSkpIGNvbnRpbnVlO1xuICAgIHh6W2ldID0geDtcbiAgICB5eltpXSA9IHk7XG4gICAgaWYgKHggPCB4MCkgeDAgPSB4O1xuICAgIGlmICh4ID4geDEpIHgxID0geDtcbiAgICBpZiAoeSA8IHkwKSB5MCA9IHk7XG4gICAgaWYgKHkgPiB5MSkgeTEgPSB5O1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgd2VyZSBubyAodmFsaWQpIHBvaW50cywgYWJvcnQuXG4gIGlmICh4MCA+IHgxIHx8IHkwID4geTEpIHJldHVybiB0aGlzO1xuXG4gIC8vIEV4cGFuZCB0aGUgdHJlZSB0byBjb3ZlciB0aGUgbmV3IHBvaW50cy5cbiAgdGhpcy5jb3Zlcih4MCwgeTApLmNvdmVyKHgxLCB5MSk7XG5cbiAgLy8gQWRkIHRoZSBuZXcgcG9pbnRzLlxuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgYWRkKHRoaXMsIHh6W2ldLCB5eltpXSwgZGF0YVtpXSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCB5KSB7XG4gIGlmIChpc05hTih4ID0gK3gpIHx8IGlzTmFOKHkgPSAreSkpIHJldHVybiB0aGlzOyAvLyBpZ25vcmUgaW52YWxpZCBwb2ludHNcblxuICB2YXIgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSA9IHRoaXMuX3gxLFxuICAgICAgeTEgPSB0aGlzLl95MTtcblxuICAvLyBJZiB0aGUgcXVhZHRyZWUgaGFzIG5vIGV4dGVudCwgaW5pdGlhbGl6ZSB0aGVtLlxuICAvLyBJbnRlZ2VyIGV4dGVudCBhcmUgbmVjZXNzYXJ5IHNvIHRoYXQgaWYgd2UgbGF0ZXIgZG91YmxlIHRoZSBleHRlbnQsXG4gIC8vIHRoZSBleGlzdGluZyBxdWFkcmFudCBib3VuZGFyaWVzIGRvblx1MjAxOXQgY2hhbmdlIGR1ZSB0byBmbG9hdGluZyBwb2ludCBlcnJvciFcbiAgaWYgKGlzTmFOKHgwKSkge1xuICAgIHgxID0gKHgwID0gTWF0aC5mbG9vcih4KSkgKyAxO1xuICAgIHkxID0gKHkwID0gTWF0aC5mbG9vcih5KSkgKyAxO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBkb3VibGUgcmVwZWF0ZWRseSB0byBjb3Zlci5cbiAgZWxzZSB7XG4gICAgdmFyIHogPSB4MSAtIHgwIHx8IDEsXG4gICAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGk7XG5cbiAgICB3aGlsZSAoeDAgPiB4IHx8IHggPj0geDEgfHwgeTAgPiB5IHx8IHkgPj0geTEpIHtcbiAgICAgIGkgPSAoeSA8IHkwKSA8PCAxIHwgKHggPCB4MCk7XG4gICAgICBwYXJlbnQgPSBuZXcgQXJyYXkoNCksIHBhcmVudFtpXSA9IG5vZGUsIG5vZGUgPSBwYXJlbnQsIHogKj0gMjtcbiAgICAgIHN3aXRjaCAoaSkge1xuICAgICAgICBjYXNlIDA6IHgxID0geDAgKyB6LCB5MSA9IHkwICsgejsgYnJlYWs7XG4gICAgICAgIGNhc2UgMTogeDAgPSB4MSAtIHosIHkxID0geTAgKyB6OyBicmVhaztcbiAgICAgICAgY2FzZSAyOiB4MSA9IHgwICsgeiwgeTAgPSB5MSAtIHo7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IHgwID0geDEgLSB6LCB5MCA9IHkxIC0gejsgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Jvb3QgJiYgdGhpcy5fcm9vdC5sZW5ndGgpIHRoaXMuX3Jvb3QgPSBub2RlO1xuICB9XG5cbiAgdGhpcy5feDAgPSB4MDtcbiAgdGhpcy5feTAgPSB5MDtcbiAgdGhpcy5feDEgPSB4MTtcbiAgdGhpcy5feTEgPSB5MTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0gW107XG4gIHRoaXMudmlzaXQoZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5sZW5ndGgpIGRvIGRhdGEucHVzaChub2RlLmRhdGEpOyB3aGlsZSAobm9kZSA9IG5vZGUubmV4dClcbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5jb3ZlcigrX1swXVswXSwgK19bMF1bMV0pLmNvdmVyKCtfWzFdWzBdLCArX1sxXVsxXSlcbiAgICAgIDogaXNOYU4odGhpcy5feDApID8gdW5kZWZpbmVkIDogW1t0aGlzLl94MCwgdGhpcy5feTBdLCBbdGhpcy5feDEsIHRoaXMuX3kxXV07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdGhpcy5ub2RlID0gbm9kZTtcbiAgdGhpcy54MCA9IHgwO1xuICB0aGlzLnkwID0geTA7XG4gIHRoaXMueDEgPSB4MTtcbiAgdGhpcy55MSA9IHkxO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgeSwgcmFkaXVzKSB7XG4gIHZhciBkYXRhLFxuICAgICAgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSxcbiAgICAgIHkxLFxuICAgICAgeDIsXG4gICAgICB5MixcbiAgICAgIHgzID0gdGhpcy5feDEsXG4gICAgICB5MyA9IHRoaXMuX3kxLFxuICAgICAgcXVhZHMgPSBbXSxcbiAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgcSxcbiAgICAgIGk7XG5cbiAgaWYgKG5vZGUpIHF1YWRzLnB1c2gobmV3IFF1YWQobm9kZSwgeDAsIHkwLCB4MywgeTMpKTtcbiAgaWYgKHJhZGl1cyA9PSBudWxsKSByYWRpdXMgPSBJbmZpbml0eTtcbiAgZWxzZSB7XG4gICAgeDAgPSB4IC0gcmFkaXVzLCB5MCA9IHkgLSByYWRpdXM7XG4gICAgeDMgPSB4ICsgcmFkaXVzLCB5MyA9IHkgKyByYWRpdXM7XG4gICAgcmFkaXVzICo9IHJhZGl1cztcbiAgfVxuXG4gIHdoaWxlIChxID0gcXVhZHMucG9wKCkpIHtcblxuICAgIC8vIFN0b3Agc2VhcmNoaW5nIGlmIHRoaXMgcXVhZHJhbnQgY2FuXHUyMDE5dCBjb250YWluIGEgY2xvc2VyIG5vZGUuXG4gICAgaWYgKCEobm9kZSA9IHEubm9kZSlcbiAgICAgICAgfHwgKHgxID0gcS54MCkgPiB4M1xuICAgICAgICB8fCAoeTEgPSBxLnkwKSA+IHkzXG4gICAgICAgIHx8ICh4MiA9IHEueDEpIDwgeDBcbiAgICAgICAgfHwgKHkyID0gcS55MSkgPCB5MCkgY29udGludWU7XG5cbiAgICAvLyBCaXNlY3QgdGhlIGN1cnJlbnQgcXVhZHJhbnQuXG4gICAgaWYgKG5vZGUubGVuZ3RoKSB7XG4gICAgICB2YXIgeG0gPSAoeDEgKyB4MikgLyAyLFxuICAgICAgICAgIHltID0gKHkxICsgeTIpIC8gMjtcblxuICAgICAgcXVhZHMucHVzaChcbiAgICAgICAgbmV3IFF1YWQobm9kZVszXSwgeG0sIHltLCB4MiwgeTIpLFxuICAgICAgICBuZXcgUXVhZChub2RlWzJdLCB4MSwgeW0sIHhtLCB5MiksXG4gICAgICAgIG5ldyBRdWFkKG5vZGVbMV0sIHhtLCB5MSwgeDIsIHltKSxcbiAgICAgICAgbmV3IFF1YWQobm9kZVswXSwgeDEsIHkxLCB4bSwgeW0pXG4gICAgICApO1xuXG4gICAgICAvLyBWaXNpdCB0aGUgY2xvc2VzdCBxdWFkcmFudCBmaXJzdC5cbiAgICAgIGlmIChpID0gKHkgPj0geW0pIDw8IDEgfCAoeCA+PSB4bSkpIHtcbiAgICAgICAgcSA9IHF1YWRzW3F1YWRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBxdWFkc1txdWFkcy5sZW5ndGggLSAxXSA9IHF1YWRzW3F1YWRzLmxlbmd0aCAtIDEgLSBpXTtcbiAgICAgICAgcXVhZHNbcXVhZHMubGVuZ3RoIC0gMSAtIGldID0gcTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCB0aGlzIHBvaW50LiAoVmlzaXRpbmcgY29pbmNpZGVudCBwb2ludHMgaXNuXHUyMDE5dCBuZWNlc3NhcnkhKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGR4ID0geCAtICt0aGlzLl94LmNhbGwobnVsbCwgbm9kZS5kYXRhKSxcbiAgICAgICAgICBkeSA9IHkgLSArdGhpcy5feS5jYWxsKG51bGwsIG5vZGUuZGF0YSksXG4gICAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgIGlmIChkMiA8IHJhZGl1cykge1xuICAgICAgICB2YXIgZCA9IE1hdGguc3FydChyYWRpdXMgPSBkMik7XG4gICAgICAgIHgwID0geCAtIGQsIHkwID0geSAtIGQ7XG4gICAgICAgIHgzID0geCArIGQsIHkzID0geSArIGQ7XG4gICAgICAgIGRhdGEgPSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZCkge1xuICBpZiAoaXNOYU4oeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCkpIHx8IGlzTmFOKHkgPSArdGhpcy5feS5jYWxsKG51bGwsIGQpKSkgcmV0dXJuIHRoaXM7IC8vIGlnbm9yZSBpbnZhbGlkIHBvaW50c1xuXG4gIHZhciBwYXJlbnQsXG4gICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgIHJldGFpbmVyLFxuICAgICAgcHJldmlvdXMsXG4gICAgICBuZXh0LFxuICAgICAgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSA9IHRoaXMuX3gxLFxuICAgICAgeTEgPSB0aGlzLl95MSxcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgeG0sXG4gICAgICB5bSxcbiAgICAgIHJpZ2h0LFxuICAgICAgYm90dG9tLFxuICAgICAgaSxcbiAgICAgIGo7XG5cbiAgLy8gSWYgdGhlIHRyZWUgaXMgZW1wdHksIGluaXRpYWxpemUgdGhlIHJvb3QgYXMgYSBsZWFmLlxuICBpZiAoIW5vZGUpIHJldHVybiB0aGlzO1xuXG4gIC8vIEZpbmQgdGhlIGxlYWYgbm9kZSBmb3IgdGhlIHBvaW50LlxuICAvLyBXaGlsZSBkZXNjZW5kaW5nLCBhbHNvIHJldGFpbiB0aGUgZGVlcGVzdCBwYXJlbnQgd2l0aCBhIG5vbi1yZW1vdmVkIHNpYmxpbmcuXG4gIGlmIChub2RlLmxlbmd0aCkgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAocmlnaHQgPSB4ID49ICh4bSA9ICh4MCArIHgxKSAvIDIpKSB4MCA9IHhtOyBlbHNlIHgxID0geG07XG4gICAgaWYgKGJvdHRvbSA9IHkgPj0gKHltID0gKHkwICsgeTEpIC8gMikpIHkwID0geW07IGVsc2UgeTEgPSB5bTtcbiAgICBpZiAoIShwYXJlbnQgPSBub2RlLCBub2RlID0gbm9kZVtpID0gYm90dG9tIDw8IDEgfCByaWdodF0pKSByZXR1cm4gdGhpcztcbiAgICBpZiAoIW5vZGUubGVuZ3RoKSBicmVhaztcbiAgICBpZiAocGFyZW50WyhpICsgMSkgJiAzXSB8fCBwYXJlbnRbKGkgKyAyKSAmIDNdIHx8IHBhcmVudFsoaSArIDMpICYgM10pIHJldGFpbmVyID0gcGFyZW50LCBqID0gaTtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHBvaW50IHRvIHJlbW92ZS5cbiAgd2hpbGUgKG5vZGUuZGF0YSAhPT0gZCkgaWYgKCEocHJldmlvdXMgPSBub2RlLCBub2RlID0gbm9kZS5uZXh0KSkgcmV0dXJuIHRoaXM7XG4gIGlmIChuZXh0ID0gbm9kZS5uZXh0KSBkZWxldGUgbm9kZS5uZXh0O1xuXG4gIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb2luY2lkZW50IHBvaW50cywgcmVtb3ZlIGp1c3QgdGhlIHBvaW50LlxuICBpZiAocHJldmlvdXMpIHJldHVybiAobmV4dCA/IHByZXZpb3VzLm5leHQgPSBuZXh0IDogZGVsZXRlIHByZXZpb3VzLm5leHQpLCB0aGlzO1xuXG4gIC8vIElmIHRoaXMgaXMgdGhlIHJvb3QgcG9pbnQsIHJlbW92ZSBpdC5cbiAgaWYgKCFwYXJlbnQpIHJldHVybiB0aGlzLl9yb290ID0gbmV4dCwgdGhpcztcblxuICAvLyBSZW1vdmUgdGhpcyBsZWFmLlxuICBuZXh0ID8gcGFyZW50W2ldID0gbmV4dCA6IGRlbGV0ZSBwYXJlbnRbaV07XG5cbiAgLy8gSWYgdGhlIHBhcmVudCBub3cgY29udGFpbnMgZXhhY3RseSBvbmUgbGVhZiwgY29sbGFwc2Ugc3VwZXJmbHVvdXMgcGFyZW50cy5cbiAgaWYgKChub2RlID0gcGFyZW50WzBdIHx8IHBhcmVudFsxXSB8fCBwYXJlbnRbMl0gfHwgcGFyZW50WzNdKVxuICAgICAgJiYgbm9kZSA9PT0gKHBhcmVudFszXSB8fCBwYXJlbnRbMl0gfHwgcGFyZW50WzFdIHx8IHBhcmVudFswXSlcbiAgICAgICYmICFub2RlLmxlbmd0aCkge1xuICAgIGlmIChyZXRhaW5lcikgcmV0YWluZXJbal0gPSBub2RlO1xuICAgIGVsc2UgdGhpcy5fcm9vdCA9IG5vZGU7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbChkYXRhKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gZGF0YS5sZW5ndGg7IGkgPCBuOyArK2kpIHRoaXMucmVtb3ZlKGRhdGFbaV0pO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBzaXplID0gMDtcbiAgdGhpcy52aXNpdChmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKCFub2RlLmxlbmd0aCkgZG8gKytzaXplOyB3aGlsZSAobm9kZSA9IG5vZGUubmV4dClcbiAgfSk7XG4gIHJldHVybiBzaXplO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHF1YWRzID0gW10sIHEsIG5vZGUgPSB0aGlzLl9yb290LCBjaGlsZCwgeDAsIHkwLCB4MSwgeTE7XG4gIGlmIChub2RlKSBxdWFkcy5wdXNoKG5ldyBRdWFkKG5vZGUsIHRoaXMuX3gwLCB0aGlzLl95MCwgdGhpcy5feDEsIHRoaXMuX3kxKSk7XG4gIHdoaWxlIChxID0gcXVhZHMucG9wKCkpIHtcbiAgICBpZiAoIWNhbGxiYWNrKG5vZGUgPSBxLm5vZGUsIHgwID0gcS54MCwgeTAgPSBxLnkwLCB4MSA9IHEueDEsIHkxID0gcS55MSkgJiYgbm9kZS5sZW5ndGgpIHtcbiAgICAgIHZhciB4bSA9ICh4MCArIHgxKSAvIDIsIHltID0gKHkwICsgeTEpIC8gMjtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbM10pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5bSwgeDEsIHkxKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzJdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeW0sIHhtLCB5MSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVsxXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeG0sIHkwLCB4MSwgeW0pKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMF0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHgwLCB5MCwgeG0sIHltKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHF1YWRzID0gW10sIG5leHQgPSBbXSwgcTtcbiAgaWYgKHRoaXMuX3Jvb3QpIHF1YWRzLnB1c2gobmV3IFF1YWQodGhpcy5fcm9vdCwgdGhpcy5feDAsIHRoaXMuX3kwLCB0aGlzLl94MSwgdGhpcy5feTEpKTtcbiAgd2hpbGUgKHEgPSBxdWFkcy5wb3AoKSkge1xuICAgIHZhciBub2RlID0gcS5ub2RlO1xuICAgIGlmIChub2RlLmxlbmd0aCkge1xuICAgICAgdmFyIGNoaWxkLCB4MCA9IHEueDAsIHkwID0gcS55MCwgeDEgPSBxLngxLCB5MSA9IHEueTEsIHhtID0gKHgwICsgeDEpIC8gMiwgeW0gPSAoeTAgKyB5MSkgLyAyO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVswXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeDAsIHkwLCB4bSwgeW0pKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMV0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5MCwgeDEsIHltKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzJdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeW0sIHhtLCB5MSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVszXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeG0sIHltLCB4MSwgeTEpKTtcbiAgICB9XG4gICAgbmV4dC5wdXNoKHEpO1xuICB9XG4gIHdoaWxlIChxID0gbmV4dC5wb3AoKSkge1xuICAgIGNhbGxiYWNrKHEubm9kZSwgcS54MCwgcS55MCwgcS54MSwgcS55MSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRYKGQpIHtcbiAgcmV0dXJuIGRbMF07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGhpcy5feCA9IF8sIHRoaXMpIDogdGhpcy5feDtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gZGVmYXVsdFkoZCkge1xuICByZXR1cm4gZFsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXykge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0aGlzLl95ID0gXywgdGhpcykgOiB0aGlzLl95O1xufVxuIiwgImltcG9ydCB0cmVlX2FkZCwge2FkZEFsbCBhcyB0cmVlX2FkZEFsbH0gZnJvbSBcIi4vYWRkLmpzXCI7XG5pbXBvcnQgdHJlZV9jb3ZlciBmcm9tIFwiLi9jb3Zlci5qc1wiO1xuaW1wb3J0IHRyZWVfZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgdHJlZV9leHRlbnQgZnJvbSBcIi4vZXh0ZW50LmpzXCI7XG5pbXBvcnQgdHJlZV9maW5kIGZyb20gXCIuL2ZpbmQuanNcIjtcbmltcG9ydCB0cmVlX3JlbW92ZSwge3JlbW92ZUFsbCBhcyB0cmVlX3JlbW92ZUFsbH0gZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgdHJlZV9yb290IGZyb20gXCIuL3Jvb3QuanNcIjtcbmltcG9ydCB0cmVlX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHRyZWVfdmlzaXQgZnJvbSBcIi4vdmlzaXQuanNcIjtcbmltcG9ydCB0cmVlX3Zpc2l0QWZ0ZXIgZnJvbSBcIi4vdmlzaXRBZnRlci5qc1wiO1xuaW1wb3J0IHRyZWVfeCwge2RlZmF1bHRYfSBmcm9tIFwiLi94LmpzXCI7XG5pbXBvcnQgdHJlZV95LCB7ZGVmYXVsdFl9IGZyb20gXCIuL3kuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcXVhZHRyZWUobm9kZXMsIHgsIHkpIHtcbiAgdmFyIHRyZWUgPSBuZXcgUXVhZHRyZWUoeCA9PSBudWxsID8gZGVmYXVsdFggOiB4LCB5ID09IG51bGwgPyBkZWZhdWx0WSA6IHksIE5hTiwgTmFOLCBOYU4sIE5hTik7XG4gIHJldHVybiBub2RlcyA9PSBudWxsID8gdHJlZSA6IHRyZWUuYWRkQWxsKG5vZGVzKTtcbn1cblxuZnVuY3Rpb24gUXVhZHRyZWUoeCwgeSwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdGhpcy5feCA9IHg7XG4gIHRoaXMuX3kgPSB5O1xuICB0aGlzLl94MCA9IHgwO1xuICB0aGlzLl95MCA9IHkwO1xuICB0aGlzLl94MSA9IHgxO1xuICB0aGlzLl95MSA9IHkxO1xuICB0aGlzLl9yb290ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBsZWFmX2NvcHkobGVhZikge1xuICB2YXIgY29weSA9IHtkYXRhOiBsZWFmLmRhdGF9LCBuZXh0ID0gY29weTtcbiAgd2hpbGUgKGxlYWYgPSBsZWFmLm5leHQpIG5leHQgPSBuZXh0Lm5leHQgPSB7ZGF0YTogbGVhZi5kYXRhfTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbnZhciB0cmVlUHJvdG8gPSBxdWFkdHJlZS5wcm90b3R5cGUgPSBRdWFkdHJlZS5wcm90b3R5cGU7XG5cbnRyZWVQcm90by5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb3B5ID0gbmV3IFF1YWR0cmVlKHRoaXMuX3gsIHRoaXMuX3ksIHRoaXMuX3gwLCB0aGlzLl95MCwgdGhpcy5feDEsIHRoaXMuX3kxKSxcbiAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgbm9kZXMsXG4gICAgICBjaGlsZDtcblxuICBpZiAoIW5vZGUpIHJldHVybiBjb3B5O1xuXG4gIGlmICghbm9kZS5sZW5ndGgpIHJldHVybiBjb3B5Ll9yb290ID0gbGVhZl9jb3B5KG5vZGUpLCBjb3B5O1xuXG4gIG5vZGVzID0gW3tzb3VyY2U6IG5vZGUsIHRhcmdldDogY29weS5fcm9vdCA9IG5ldyBBcnJheSg0KX1dO1xuICB3aGlsZSAobm9kZSA9IG5vZGVzLnBvcCgpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGUuc291cmNlW2ldKSB7XG4gICAgICAgIGlmIChjaGlsZC5sZW5ndGgpIG5vZGVzLnB1c2goe3NvdXJjZTogY2hpbGQsIHRhcmdldDogbm9kZS50YXJnZXRbaV0gPSBuZXcgQXJyYXkoNCl9KTtcbiAgICAgICAgZWxzZSBub2RlLnRhcmdldFtpXSA9IGxlYWZfY29weShjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvcHk7XG59O1xuXG50cmVlUHJvdG8uYWRkID0gdHJlZV9hZGQ7XG50cmVlUHJvdG8uYWRkQWxsID0gdHJlZV9hZGRBbGw7XG50cmVlUHJvdG8uY292ZXIgPSB0cmVlX2NvdmVyO1xudHJlZVByb3RvLmRhdGEgPSB0cmVlX2RhdGE7XG50cmVlUHJvdG8uZXh0ZW50ID0gdHJlZV9leHRlbnQ7XG50cmVlUHJvdG8uZmluZCA9IHRyZWVfZmluZDtcbnRyZWVQcm90by5yZW1vdmUgPSB0cmVlX3JlbW92ZTtcbnRyZWVQcm90by5yZW1vdmVBbGwgPSB0cmVlX3JlbW92ZUFsbDtcbnRyZWVQcm90by5yb290ID0gdHJlZV9yb290O1xudHJlZVByb3RvLnNpemUgPSB0cmVlX3NpemU7XG50cmVlUHJvdG8udmlzaXQgPSB0cmVlX3Zpc2l0O1xudHJlZVByb3RvLnZpc2l0QWZ0ZXIgPSB0cmVlX3Zpc2l0QWZ0ZXI7XG50cmVlUHJvdG8ueCA9IHRyZWVfeDtcbnRyZWVQcm90by55ID0gdHJlZV95O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHJhbmRvbSkge1xuICByZXR1cm4gKHJhbmRvbSgpIC0gMC41KSAqIDFlLTY7XG59XG4iLCAiaW1wb3J0IHtxdWFkdHJlZX0gZnJvbSBcImQzLXF1YWR0cmVlXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBqaWdnbGUgZnJvbSBcIi4vamlnZ2xlLmpzXCI7XG5cbmZ1bmN0aW9uIHgoZCkge1xuICByZXR1cm4gZC54ICsgZC52eDtcbn1cblxuZnVuY3Rpb24geShkKSB7XG4gIHJldHVybiBkLnkgKyBkLnZ5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyYWRpdXMpIHtcbiAgdmFyIG5vZGVzLFxuICAgICAgcmFkaWksXG4gICAgICByYW5kb20sXG4gICAgICBzdHJlbmd0aCA9IDEsXG4gICAgICBpdGVyYXRpb25zID0gMTtcblxuICBpZiAodHlwZW9mIHJhZGl1cyAhPT0gXCJmdW5jdGlvblwiKSByYWRpdXMgPSBjb25zdGFudChyYWRpdXMgPT0gbnVsbCA/IDEgOiArcmFkaXVzKTtcblxuICBmdW5jdGlvbiBmb3JjZSgpIHtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgdHJlZSxcbiAgICAgICAgbm9kZSxcbiAgICAgICAgeGksXG4gICAgICAgIHlpLFxuICAgICAgICByaSxcbiAgICAgICAgcmkyO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBpdGVyYXRpb25zOyArK2spIHtcbiAgICAgIHRyZWUgPSBxdWFkdHJlZShub2RlcywgeCwgeSkudmlzaXRBZnRlcihwcmVwYXJlKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICByaSA9IHJhZGlpW25vZGUuaW5kZXhdLCByaTIgPSByaSAqIHJpO1xuICAgICAgICB4aSA9IG5vZGUueCArIG5vZGUudng7XG4gICAgICAgIHlpID0gbm9kZS55ICsgbm9kZS52eTtcbiAgICAgICAgdHJlZS52aXNpdChhcHBseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHkocXVhZCwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgICAgIHZhciBkYXRhID0gcXVhZC5kYXRhLCByaiA9IHF1YWQuciwgciA9IHJpICsgcmo7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5pbmRleCA+IG5vZGUuaW5kZXgpIHtcbiAgICAgICAgICB2YXIgeCA9IHhpIC0gZGF0YS54IC0gZGF0YS52eCxcbiAgICAgICAgICAgICAgeSA9IHlpIC0gZGF0YS55IC0gZGF0YS52eSxcbiAgICAgICAgICAgICAgbCA9IHggKiB4ICsgeSAqIHk7XG4gICAgICAgICAgaWYgKGwgPCByICogcikge1xuICAgICAgICAgICAgaWYgKHggPT09IDApIHggPSBqaWdnbGUocmFuZG9tKSwgbCArPSB4ICogeDtcbiAgICAgICAgICAgIGlmICh5ID09PSAwKSB5ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geSAqIHk7XG4gICAgICAgICAgICBsID0gKHIgLSAobCA9IE1hdGguc3FydChsKSkpIC8gbCAqIHN0cmVuZ3RoO1xuICAgICAgICAgICAgbm9kZS52eCArPSAoeCAqPSBsKSAqIChyID0gKHJqICo9IHJqKSAvIChyaTIgKyByaikpO1xuICAgICAgICAgICAgbm9kZS52eSArPSAoeSAqPSBsKSAqIHI7XG4gICAgICAgICAgICBkYXRhLnZ4IC09IHggKiAociA9IDEgLSByKTtcbiAgICAgICAgICAgIGRhdGEudnkgLT0geSAqIHI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB4MCA+IHhpICsgciB8fCB4MSA8IHhpIC0gciB8fCB5MCA+IHlpICsgciB8fCB5MSA8IHlpIC0gcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcmVwYXJlKHF1YWQpIHtcbiAgICBpZiAocXVhZC5kYXRhKSByZXR1cm4gcXVhZC5yID0gcmFkaWlbcXVhZC5kYXRhLmluZGV4XTtcbiAgICBmb3IgKHZhciBpID0gcXVhZC5yID0gMDsgaSA8IDQ7ICsraSkge1xuICAgICAgaWYgKHF1YWRbaV0gJiYgcXVhZFtpXS5yID4gcXVhZC5yKSB7XG4gICAgICAgIHF1YWQuciA9IHF1YWRbaV0ucjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcbiAgICByYWRpaSA9IG5ldyBBcnJheShuKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSBub2RlID0gbm9kZXNbaV0sIHJhZGlpW25vZGUuaW5kZXhdID0gK3JhZGl1cyhub2RlLCBpLCBub2Rlcyk7XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2UuaXRlcmF0aW9ucyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpdGVyYXRpb25zID0gK18sIGZvcmNlKSA6IGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSArXywgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UucmFkaXVzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhZGl1cyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHJhZGl1cztcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgamlnZ2xlIGZyb20gXCIuL2ppZ2dsZS5qc1wiO1xuXG5mdW5jdGlvbiBpbmRleChkKSB7XG4gIHJldHVybiBkLmluZGV4O1xufVxuXG5mdW5jdGlvbiBmaW5kKG5vZGVCeUlkLCBub2RlSWQpIHtcbiAgdmFyIG5vZGUgPSBub2RlQnlJZC5nZXQobm9kZUlkKTtcbiAgaWYgKCFub2RlKSB0aHJvdyBuZXcgRXJyb3IoXCJub2RlIG5vdCBmb3VuZDogXCIgKyBub2RlSWQpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obGlua3MpIHtcbiAgdmFyIGlkID0gaW5kZXgsXG4gICAgICBzdHJlbmd0aCA9IGRlZmF1bHRTdHJlbmd0aCxcbiAgICAgIHN0cmVuZ3RocyxcbiAgICAgIGRpc3RhbmNlID0gY29uc3RhbnQoMzApLFxuICAgICAgZGlzdGFuY2VzLFxuICAgICAgbm9kZXMsXG4gICAgICBjb3VudCxcbiAgICAgIGJpYXMsXG4gICAgICByYW5kb20sXG4gICAgICBpdGVyYXRpb25zID0gMTtcblxuICBpZiAobGlua3MgPT0gbnVsbCkgbGlua3MgPSBbXTtcblxuICBmdW5jdGlvbiBkZWZhdWx0U3RyZW5ndGgobGluaykge1xuICAgIHJldHVybiAxIC8gTWF0aC5taW4oY291bnRbbGluay5zb3VyY2UuaW5kZXhdLCBjb3VudFtsaW5rLnRhcmdldC5pbmRleF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9yY2UoYWxwaGEpIHtcbiAgICBmb3IgKHZhciBrID0gMCwgbiA9IGxpbmtzLmxlbmd0aDsgayA8IGl0ZXJhdGlvbnM7ICsraykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmssIHNvdXJjZSwgdGFyZ2V0LCB4LCB5LCBsLCBiOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGxpbmsgPSBsaW5rc1tpXSwgc291cmNlID0gbGluay5zb3VyY2UsIHRhcmdldCA9IGxpbmsudGFyZ2V0O1xuICAgICAgICB4ID0gdGFyZ2V0LnggKyB0YXJnZXQudnggLSBzb3VyY2UueCAtIHNvdXJjZS52eCB8fCBqaWdnbGUocmFuZG9tKTtcbiAgICAgICAgeSA9IHRhcmdldC55ICsgdGFyZ2V0LnZ5IC0gc291cmNlLnkgLSBzb3VyY2UudnkgfHwgamlnZ2xlKHJhbmRvbSk7XG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgICAgIGwgPSAobCAtIGRpc3RhbmNlc1tpXSkgLyBsICogYWxwaGEgKiBzdHJlbmd0aHNbaV07XG4gICAgICAgIHggKj0gbCwgeSAqPSBsO1xuICAgICAgICB0YXJnZXQudnggLT0geCAqIChiID0gYmlhc1tpXSk7XG4gICAgICAgIHRhcmdldC52eSAtPSB5ICogYjtcbiAgICAgICAgc291cmNlLnZ4ICs9IHggKiAoYiA9IDEgLSBiKTtcbiAgICAgICAgc291cmNlLnZ5ICs9IHkgKiBiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCFub2RlcykgcmV0dXJuO1xuXG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgIG0gPSBsaW5rcy5sZW5ndGgsXG4gICAgICAgIG5vZGVCeUlkID0gbmV3IE1hcChub2Rlcy5tYXAoKGQsIGkpID0+IFtpZChkLCBpLCBub2RlcyksIGRdKSksXG4gICAgICAgIGxpbms7XG5cbiAgICBmb3IgKGkgPSAwLCBjb3VudCA9IG5ldyBBcnJheShuKTsgaSA8IG07ICsraSkge1xuICAgICAgbGluayA9IGxpbmtzW2ldLCBsaW5rLmluZGV4ID0gaTtcbiAgICAgIGlmICh0eXBlb2YgbGluay5zb3VyY2UgIT09IFwib2JqZWN0XCIpIGxpbmsuc291cmNlID0gZmluZChub2RlQnlJZCwgbGluay5zb3VyY2UpO1xuICAgICAgaWYgKHR5cGVvZiBsaW5rLnRhcmdldCAhPT0gXCJvYmplY3RcIikgbGluay50YXJnZXQgPSBmaW5kKG5vZGVCeUlkLCBsaW5rLnRhcmdldCk7XG4gICAgICBjb3VudFtsaW5rLnNvdXJjZS5pbmRleF0gPSAoY291bnRbbGluay5zb3VyY2UuaW5kZXhdIHx8IDApICsgMTtcbiAgICAgIGNvdW50W2xpbmsudGFyZ2V0LmluZGV4XSA9IChjb3VudFtsaW5rLnRhcmdldC5pbmRleF0gfHwgMCkgKyAxO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGJpYXMgPSBuZXcgQXJyYXkobSk7IGkgPCBtOyArK2kpIHtcbiAgICAgIGxpbmsgPSBsaW5rc1tpXSwgYmlhc1tpXSA9IGNvdW50W2xpbmsuc291cmNlLmluZGV4XSAvIChjb3VudFtsaW5rLnNvdXJjZS5pbmRleF0gKyBjb3VudFtsaW5rLnRhcmdldC5pbmRleF0pO1xuICAgIH1cblxuICAgIHN0cmVuZ3RocyA9IG5ldyBBcnJheShtKSwgaW5pdGlhbGl6ZVN0cmVuZ3RoKCk7XG4gICAgZGlzdGFuY2VzID0gbmV3IEFycmF5KG0pLCBpbml0aWFsaXplRGlzdGFuY2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVTdHJlbmd0aCgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxpbmtzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgc3RyZW5ndGhzW2ldID0gK3N0cmVuZ3RoKGxpbmtzW2ldLCBpLCBsaW5rcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZURpc3RhbmNlKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbGlua3MubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICBkaXN0YW5jZXNbaV0gPSArZGlzdGFuY2UobGlua3NbaV0sIGksIGxpbmtzKTtcbiAgICB9XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2UubGlua3MgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGlua3MgPSBfLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IGxpbmtzO1xuICB9O1xuXG4gIGZvcmNlLmlkID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGlkID0gXywgZm9yY2UpIDogaWQ7XG4gIH07XG5cbiAgZm9yY2UuaXRlcmF0aW9ucyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpdGVyYXRpb25zID0gK18sIGZvcmNlKSA6IGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgaW5pdGlhbGl6ZVN0cmVuZ3RoKCksIGZvcmNlKSA6IHN0cmVuZ3RoO1xuICB9O1xuXG4gIGZvcmNlLmRpc3RhbmNlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRpc3RhbmNlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemVEaXN0YW5jZSgpLCBmb3JjZSkgOiBkaXN0YW5jZTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGluZWFyX2NvbmdydWVudGlhbF9nZW5lcmF0b3IjUGFyYW1ldGVyc19pbl9jb21tb25fdXNlXG5jb25zdCBhID0gMTY2NDUyNTtcbmNvbnN0IGMgPSAxMDEzOTA0MjIzO1xuY29uc3QgbSA9IDQyOTQ5NjcyOTY7IC8vIDJeMzJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGxldCBzID0gMTtcbiAgcmV0dXJuICgpID0+IChzID0gKGEgKiBzICsgYykgJSBtKSAvIG07XG59XG4iLCAiaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5pbXBvcnQge3RpbWVyfSBmcm9tIFwiZDMtdGltZXJcIjtcbmltcG9ydCBsY2cgZnJvbSBcIi4vbGNnLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB4KGQpIHtcbiAgcmV0dXJuIGQueDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHkoZCkge1xuICByZXR1cm4gZC55O1xufVxuXG52YXIgaW5pdGlhbFJhZGl1cyA9IDEwLFxuICAgIGluaXRpYWxBbmdsZSA9IE1hdGguUEkgKiAoMyAtIE1hdGguc3FydCg1KSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIHZhciBzaW11bGF0aW9uLFxuICAgICAgYWxwaGEgPSAxLFxuICAgICAgYWxwaGFNaW4gPSAwLjAwMSxcbiAgICAgIGFscGhhRGVjYXkgPSAxIC0gTWF0aC5wb3coYWxwaGFNaW4sIDEgLyAzMDApLFxuICAgICAgYWxwaGFUYXJnZXQgPSAwLFxuICAgICAgdmVsb2NpdHlEZWNheSA9IDAuNixcbiAgICAgIGZvcmNlcyA9IG5ldyBNYXAoKSxcbiAgICAgIHN0ZXBwZXIgPSB0aW1lcihzdGVwKSxcbiAgICAgIGV2ZW50ID0gZGlzcGF0Y2goXCJ0aWNrXCIsIFwiZW5kXCIpLFxuICAgICAgcmFuZG9tID0gbGNnKCk7XG5cbiAgaWYgKG5vZGVzID09IG51bGwpIG5vZGVzID0gW107XG5cbiAgZnVuY3Rpb24gc3RlcCgpIHtcbiAgICB0aWNrKCk7XG4gICAgZXZlbnQuY2FsbChcInRpY2tcIiwgc2ltdWxhdGlvbik7XG4gICAgaWYgKGFscGhhIDwgYWxwaGFNaW4pIHtcbiAgICAgIHN0ZXBwZXIuc3RvcCgpO1xuICAgICAgZXZlbnQuY2FsbChcImVuZFwiLCBzaW11bGF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrKGl0ZXJhdGlvbnMpIHtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcblxuICAgIGlmIChpdGVyYXRpb25zID09PSB1bmRlZmluZWQpIGl0ZXJhdGlvbnMgPSAxO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBpdGVyYXRpb25zOyArK2spIHtcbiAgICAgIGFscGhhICs9IChhbHBoYVRhcmdldCAtIGFscGhhKSAqIGFscGhhRGVjYXk7XG5cbiAgICAgIGZvcmNlcy5mb3JFYWNoKGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIGZvcmNlKGFscGhhKTtcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUuZnggPT0gbnVsbCkgbm9kZS54ICs9IG5vZGUudnggKj0gdmVsb2NpdHlEZWNheTtcbiAgICAgICAgZWxzZSBub2RlLnggPSBub2RlLmZ4LCBub2RlLnZ4ID0gMDtcbiAgICAgICAgaWYgKG5vZGUuZnkgPT0gbnVsbCkgbm9kZS55ICs9IG5vZGUudnkgKj0gdmVsb2NpdHlEZWNheTtcbiAgICAgICAgZWxzZSBub2RlLnkgPSBub2RlLmZ5LCBub2RlLnZ5ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2ltdWxhdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVOb2RlcygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgbm9kZSA9IG5vZGVzW2ldLCBub2RlLmluZGV4ID0gaTtcbiAgICAgIGlmIChub2RlLmZ4ICE9IG51bGwpIG5vZGUueCA9IG5vZGUuZng7XG4gICAgICBpZiAobm9kZS5meSAhPSBudWxsKSBub2RlLnkgPSBub2RlLmZ5O1xuICAgICAgaWYgKGlzTmFOKG5vZGUueCkgfHwgaXNOYU4obm9kZS55KSkge1xuICAgICAgICB2YXIgcmFkaXVzID0gaW5pdGlhbFJhZGl1cyAqIE1hdGguc3FydCgwLjUgKyBpKSwgYW5nbGUgPSBpICogaW5pdGlhbEFuZ2xlO1xuICAgICAgICBub2RlLnggPSByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIG5vZGUueSA9IHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihub2RlLnZ4KSB8fCBpc05hTihub2RlLnZ5KSkge1xuICAgICAgICBub2RlLnZ4ID0gbm9kZS52eSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUZvcmNlKGZvcmNlKSB7XG4gICAgaWYgKGZvcmNlLmluaXRpYWxpemUpIGZvcmNlLmluaXRpYWxpemUobm9kZXMsIHJhbmRvbSk7XG4gICAgcmV0dXJuIGZvcmNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZU5vZGVzKCk7XG5cbiAgcmV0dXJuIHNpbXVsYXRpb24gPSB7XG4gICAgdGljazogdGljayxcblxuICAgIHJlc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN0ZXBwZXIucmVzdGFydChzdGVwKSwgc2ltdWxhdGlvbjtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3RlcHBlci5zdG9wKCksIHNpbXVsYXRpb247XG4gICAgfSxcblxuICAgIG5vZGVzOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChub2RlcyA9IF8sIGluaXRpYWxpemVOb2RlcygpLCBmb3JjZXMuZm9yRWFjaChpbml0aWFsaXplRm9yY2UpLCBzaW11bGF0aW9uKSA6IG5vZGVzO1xuICAgIH0sXG5cbiAgICBhbHBoYTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoYWxwaGEgPSArXywgc2ltdWxhdGlvbikgOiBhbHBoYTtcbiAgICB9LFxuXG4gICAgYWxwaGFNaW46IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhTWluID0gK18sIHNpbXVsYXRpb24pIDogYWxwaGFNaW47XG4gICAgfSxcblxuICAgIGFscGhhRGVjYXk6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhRGVjYXkgPSArXywgc2ltdWxhdGlvbikgOiArYWxwaGFEZWNheTtcbiAgICB9LFxuXG4gICAgYWxwaGFUYXJnZXQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhVGFyZ2V0ID0gK18sIHNpbXVsYXRpb24pIDogYWxwaGFUYXJnZXQ7XG4gICAgfSxcblxuICAgIHZlbG9jaXR5RGVjYXk6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHZlbG9jaXR5RGVjYXkgPSAxIC0gXywgc2ltdWxhdGlvbikgOiAxIC0gdmVsb2NpdHlEZWNheTtcbiAgICB9LFxuXG4gICAgcmFuZG9tU291cmNlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5kb20gPSBfLCBmb3JjZXMuZm9yRWFjaChpbml0aWFsaXplRm9yY2UpLCBzaW11bGF0aW9uKSA6IHJhbmRvbTtcbiAgICB9LFxuXG4gICAgZm9yY2U6IGZ1bmN0aW9uKG5hbWUsIF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMSA/ICgoXyA9PSBudWxsID8gZm9yY2VzLmRlbGV0ZShuYW1lKSA6IGZvcmNlcy5zZXQobmFtZSwgaW5pdGlhbGl6ZUZvcmNlKF8pKSksIHNpbXVsYXRpb24pIDogZm9yY2VzLmdldChuYW1lKTtcbiAgICB9LFxuXG4gICAgZmluZDogZnVuY3Rpb24oeCwgeSwgcmFkaXVzKSB7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBkeCxcbiAgICAgICAgICBkeSxcbiAgICAgICAgICBkMixcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGNsb3Nlc3Q7XG5cbiAgICAgIGlmIChyYWRpdXMgPT0gbnVsbCkgcmFkaXVzID0gSW5maW5pdHk7XG4gICAgICBlbHNlIHJhZGl1cyAqPSByYWRpdXM7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBkeCA9IHggLSBub2RlLng7XG4gICAgICAgIGR5ID0geSAtIG5vZGUueTtcbiAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgaWYgKGQyIDwgcmFkaXVzKSBjbG9zZXN0ID0gbm9kZSwgcmFkaXVzID0gZDI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjbG9zZXN0O1xuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24obmFtZSwgXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gKGV2ZW50Lm9uKG5hbWUsIF8pLCBzaW11bGF0aW9uKSA6IGV2ZW50Lm9uKG5hbWUpO1xuICAgIH1cbiAgfTtcbn1cbiIsICJpbXBvcnQge3F1YWR0cmVlfSBmcm9tIFwiZDMtcXVhZHRyZWVcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IGppZ2dsZSBmcm9tIFwiLi9qaWdnbGUuanNcIjtcbmltcG9ydCB7eCwgeX0gZnJvbSBcIi4vc2ltdWxhdGlvbi5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIG5vZGVzLFxuICAgICAgbm9kZSxcbiAgICAgIHJhbmRvbSxcbiAgICAgIGFscGhhLFxuICAgICAgc3RyZW5ndGggPSBjb25zdGFudCgtMzApLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgZGlzdGFuY2VNaW4yID0gMSxcbiAgICAgIGRpc3RhbmNlTWF4MiA9IEluZmluaXR5LFxuICAgICAgdGhldGEyID0gMC44MTtcblxuICBmdW5jdGlvbiBmb3JjZShfKSB7XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsIHRyZWUgPSBxdWFkdHJlZShub2RlcywgeCwgeSkudmlzaXRBZnRlcihhY2N1bXVsYXRlKTtcbiAgICBmb3IgKGFscGhhID0gXywgaSA9IDA7IGkgPCBuOyArK2kpIG5vZGUgPSBub2Rlc1tpXSwgdHJlZS52aXNpdChhcHBseSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcbiAgICBzdHJlbmd0aHMgPSBuZXcgQXJyYXkobik7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgbm9kZSA9IG5vZGVzW2ldLCBzdHJlbmd0aHNbbm9kZS5pbmRleF0gPSArc3RyZW5ndGgobm9kZSwgaSwgbm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWNjdW11bGF0ZShxdWFkKSB7XG4gICAgdmFyIHN0cmVuZ3RoID0gMCwgcSwgYywgd2VpZ2h0ID0gMCwgeCwgeSwgaTtcblxuICAgIC8vIEZvciBpbnRlcm5hbCBub2RlcywgYWNjdW11bGF0ZSBmb3JjZXMgZnJvbSBjaGlsZCBxdWFkcmFudHMuXG4gICAgaWYgKHF1YWQubGVuZ3RoKSB7XG4gICAgICBmb3IgKHggPSB5ID0gaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgaWYgKChxID0gcXVhZFtpXSkgJiYgKGMgPSBNYXRoLmFicyhxLnZhbHVlKSkpIHtcbiAgICAgICAgICBzdHJlbmd0aCArPSBxLnZhbHVlLCB3ZWlnaHQgKz0gYywgeCArPSBjICogcS54LCB5ICs9IGMgKiBxLnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHF1YWQueCA9IHggLyB3ZWlnaHQ7XG4gICAgICBxdWFkLnkgPSB5IC8gd2VpZ2h0O1xuICAgIH1cblxuICAgIC8vIEZvciBsZWFmIG5vZGVzLCBhY2N1bXVsYXRlIGZvcmNlcyBmcm9tIGNvaW5jaWRlbnQgcXVhZHJhbnRzLlxuICAgIGVsc2Uge1xuICAgICAgcSA9IHF1YWQ7XG4gICAgICBxLnggPSBxLmRhdGEueDtcbiAgICAgIHEueSA9IHEuZGF0YS55O1xuICAgICAgZG8gc3RyZW5ndGggKz0gc3RyZW5ndGhzW3EuZGF0YS5pbmRleF07XG4gICAgICB3aGlsZSAocSA9IHEubmV4dCk7XG4gICAgfVxuXG4gICAgcXVhZC52YWx1ZSA9IHN0cmVuZ3RoO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHkocXVhZCwgeDEsIF8sIHgyKSB7XG4gICAgaWYgKCFxdWFkLnZhbHVlKSByZXR1cm4gdHJ1ZTtcblxuICAgIHZhciB4ID0gcXVhZC54IC0gbm9kZS54LFxuICAgICAgICB5ID0gcXVhZC55IC0gbm9kZS55LFxuICAgICAgICB3ID0geDIgLSB4MSxcbiAgICAgICAgbCA9IHggKiB4ICsgeSAqIHk7XG5cbiAgICAvLyBBcHBseSB0aGUgQmFybmVzLUh1dCBhcHByb3hpbWF0aW9uIGlmIHBvc3NpYmxlLlxuICAgIC8vIExpbWl0IGZvcmNlcyBmb3IgdmVyeSBjbG9zZSBub2RlczsgcmFuZG9taXplIGRpcmVjdGlvbiBpZiBjb2luY2lkZW50LlxuICAgIGlmICh3ICogdyAvIHRoZXRhMiA8IGwpIHtcbiAgICAgIGlmIChsIDwgZGlzdGFuY2VNYXgyKSB7XG4gICAgICAgIGlmICh4ID09PSAwKSB4ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geCAqIHg7XG4gICAgICAgIGlmICh5ID09PSAwKSB5ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geSAqIHk7XG4gICAgICAgIGlmIChsIDwgZGlzdGFuY2VNaW4yKSBsID0gTWF0aC5zcXJ0KGRpc3RhbmNlTWluMiAqIGwpO1xuICAgICAgICBub2RlLnZ4ICs9IHggKiBxdWFkLnZhbHVlICogYWxwaGEgLyBsO1xuICAgICAgICBub2RlLnZ5ICs9IHkgKiBxdWFkLnZhbHVlICogYWxwaGEgLyBsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBwcm9jZXNzIHBvaW50cyBkaXJlY3RseS5cbiAgICBlbHNlIGlmIChxdWFkLmxlbmd0aCB8fCBsID49IGRpc3RhbmNlTWF4MikgcmV0dXJuO1xuXG4gICAgLy8gTGltaXQgZm9yY2VzIGZvciB2ZXJ5IGNsb3NlIG5vZGVzOyByYW5kb21pemUgZGlyZWN0aW9uIGlmIGNvaW5jaWRlbnQuXG4gICAgaWYgKHF1YWQuZGF0YSAhPT0gbm9kZSB8fCBxdWFkLm5leHQpIHtcbiAgICAgIGlmICh4ID09PSAwKSB4ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geCAqIHg7XG4gICAgICBpZiAoeSA9PT0gMCkgeSA9IGppZ2dsZShyYW5kb20pLCBsICs9IHkgKiB5O1xuICAgICAgaWYgKGwgPCBkaXN0YW5jZU1pbjIpIGwgPSBNYXRoLnNxcnQoZGlzdGFuY2VNaW4yICogbCk7XG4gICAgfVxuXG4gICAgZG8gaWYgKHF1YWQuZGF0YSAhPT0gbm9kZSkge1xuICAgICAgdyA9IHN0cmVuZ3Roc1txdWFkLmRhdGEuaW5kZXhdICogYWxwaGEgLyBsO1xuICAgICAgbm9kZS52eCArPSB4ICogdztcbiAgICAgIG5vZGUudnkgKz0geSAqIHc7XG4gICAgfSB3aGlsZSAocXVhZCA9IHF1YWQubmV4dCk7XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgaW5pdGlhbGl6ZSgpLCBmb3JjZSkgOiBzdHJlbmd0aDtcbiAgfTtcblxuICBmb3JjZS5kaXN0YW5jZU1pbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkaXN0YW5jZU1pbjIgPSBfICogXywgZm9yY2UpIDogTWF0aC5zcXJ0KGRpc3RhbmNlTWluMik7XG4gIH07XG5cbiAgZm9yY2UuZGlzdGFuY2VNYXggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZGlzdGFuY2VNYXgyID0gXyAqIF8sIGZvcmNlKSA6IE1hdGguc3FydChkaXN0YW5jZU1heDIpO1xuICB9O1xuXG4gIGZvcmNlLnRoZXRhID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRoZXRhMiA9IF8gKiBfLCBmb3JjZSkgOiBNYXRoLnNxcnQodGhldGEyKTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHN0cmVuZ3RoID0gY29uc3RhbnQoMC4xKSxcbiAgICAgIG5vZGVzLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgeHo7XG5cbiAgaWYgKHR5cGVvZiB4ICE9PSBcImZ1bmN0aW9uXCIpIHggPSBjb25zdGFudCh4ID09IG51bGwgPyAwIDogK3gpO1xuXG4gIGZ1bmN0aW9uIGZvcmNlKGFscGhhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tpXSwgbm9kZS52eCArPSAoeHpbaV0gLSBub2RlLngpICogc3RyZW5ndGhzW2ldICogYWxwaGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGg7XG4gICAgc3RyZW5ndGhzID0gbmV3IEFycmF5KG4pO1xuICAgIHh6ID0gbmV3IEFycmF5KG4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN0cmVuZ3Roc1tpXSA9IGlzTmFOKHh6W2ldID0gK3gobm9kZXNbaV0sIGksIG5vZGVzKSkgPyAwIDogK3N0cmVuZ3RoKG5vZGVzW2ldLCBpLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBub2RlcyA9IF87XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UueCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogeDtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIHN0cmVuZ3RoID0gY29uc3RhbnQoMC4xKSxcbiAgICAgIG5vZGVzLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgeXo7XG5cbiAgaWYgKHR5cGVvZiB5ICE9PSBcImZ1bmN0aW9uXCIpIHkgPSBjb25zdGFudCh5ID09IG51bGwgPyAwIDogK3kpO1xuXG4gIGZ1bmN0aW9uIGZvcmNlKGFscGhhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tpXSwgbm9kZS52eSArPSAoeXpbaV0gLSBub2RlLnkpICogc3RyZW5ndGhzW2ldICogYWxwaGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGg7XG4gICAgc3RyZW5ndGhzID0gbmV3IEFycmF5KG4pO1xuICAgIHl6ID0gbmV3IEFycmF5KG4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN0cmVuZ3Roc1tpXSA9IGlzTmFOKHl6W2ldID0gK3kobm9kZXNbaV0sIGksIG5vZGVzKSkgPyAwIDogK3N0cmVuZ3RoKG5vZGVzW2ldLCBpLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBub2RlcyA9IF87XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UueSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogeTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGluaXRSYW5nZShkb21haW4sIHJhbmdlKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogYnJlYWs7XG4gICAgY2FzZSAxOiB0aGlzLnJhbmdlKGRvbWFpbik7IGJyZWFrO1xuICAgIGRlZmF1bHQ6IHRoaXMucmFuZ2UocmFuZ2UpLmRvbWFpbihkb21haW4pOyBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRJbnRlcnBvbGF0b3IoZG9tYWluLCBpbnRlcnBvbGF0b3IpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHtcbiAgICAgIGlmICh0eXBlb2YgZG9tYWluID09PSBcImZ1bmN0aW9uXCIpIHRoaXMuaW50ZXJwb2xhdG9yKGRvbWFpbik7XG4gICAgICBlbHNlIHRoaXMucmFuZ2UoZG9tYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICB0aGlzLmRvbWFpbihkb21haW4pO1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcnBvbGF0b3IgPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoaW50ZXJwb2xhdG9yKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShpbnRlcnBvbGF0b3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7SW50ZXJuTWFwfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7aW5pdFJhbmdlfSBmcm9tIFwiLi9pbml0LmpzXCI7XG5cbmV4cG9ydCBjb25zdCBpbXBsaWNpdCA9IFN5bWJvbChcImltcGxpY2l0XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRpbmFsKCkge1xuICB2YXIgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCksXG4gICAgICBkb21haW4gPSBbXSxcbiAgICAgIHJhbmdlID0gW10sXG4gICAgICB1bmtub3duID0gaW1wbGljaXQ7XG5cbiAgZnVuY3Rpb24gc2NhbGUoZCkge1xuICAgIGxldCBpID0gaW5kZXguZ2V0KGQpO1xuICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh1bmtub3duICE9PSBpbXBsaWNpdCkgcmV0dXJuIHVua25vd247XG4gICAgICBpbmRleC5zZXQoZCwgaSA9IGRvbWFpbi5wdXNoKGQpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVtpICUgcmFuZ2UubGVuZ3RoXTtcbiAgfVxuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICBkb21haW4gPSBbXSwgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiBfKSB7XG4gICAgICBpZiAoaW5kZXguaGFzKHZhbHVlKSkgY29udGludWU7XG4gICAgICBpbmRleC5zZXQodmFsdWUsIGRvbWFpbi5wdXNoKHZhbHVlKSAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UgPSBBcnJheS5mcm9tKF8pLCBzY2FsZSkgOiByYW5nZS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnVua25vd24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodW5rbm93biA9IF8sIHNjYWxlKSA6IHVua25vd247XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBvcmRpbmFsKGRvbWFpbiwgcmFuZ2UpLnVua25vd24odW5rbm93bik7XG4gIH07XG5cbiAgaW5pdFJhbmdlLmFwcGx5KHNjYWxlLCBhcmd1bWVudHMpO1xuXG4gIHJldHVybiBzY2FsZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgdmFyIG4gPSBzcGVjaWZpZXIubGVuZ3RoIC8gNiB8IDAsIGNvbG9ycyA9IG5ldyBBcnJheShuKSwgaSA9IDA7XG4gIHdoaWxlIChpIDwgbikgY29sb3JzW2ldID0gXCIjXCIgKyBzcGVjaWZpZXIuc2xpY2UoaSAqIDYsICsraSAqIDYpO1xuICByZXR1cm4gY29sb3JzO1xufVxuIiwgImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9ycy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCI0ZTc5YTdmMjhlMmNlMTU3NTk3NmI3YjI1OWExNGZlZGM5NDlhZjdhYTFmZjlkYTc5Yzc1NWZiYWIwYWJcIik7XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24gY29uc3RhbnQoKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtQYXRofSBmcm9tIFwiZDMtcGF0aFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFBhdGgoc2hhcGUpIHtcbiAgbGV0IGRpZ2l0cyA9IDM7XG5cbiAgc2hhcGUuZGlnaXRzID0gZnVuY3Rpb24oXykge1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRpZ2l0cztcbiAgICBpZiAoXyA9PSBudWxsKSB7XG4gICAgICBkaWdpdHMgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkID0gTWF0aC5mbG9vcihfKTtcbiAgICAgIGlmICghKGQgPj0gMCkpIHRocm93IG5ldyBSYW5nZUVycm9yKGBpbnZhbGlkIGRpZ2l0czogJHtffWApO1xuICAgICAgZGlnaXRzID0gZDtcbiAgICB9XG4gICAgcmV0dXJuIHNoYXBlO1xuICB9O1xuXG4gIHJldHVybiAoKSA9PiBuZXcgUGF0aChkaWdpdHMpO1xufVxuIiwgImV4cG9ydCB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIFwibGVuZ3RoXCIgaW4geFxuICAgID8geCAvLyBBcnJheSwgVHlwZWRBcnJheSwgTm9kZUxpc3QsIGFycmF5LWxpa2VcbiAgICA6IEFycmF5LmZyb20oeCk7IC8vIE1hcCwgU2V0LCBpdGVyYWJsZSwgc3RyaW5nLCBvciBhbnl0aGluZyBlbHNlXG59XG4iLCAiZnVuY3Rpb24gTGluZWFyKGNvbnRleHQpIHtcbiAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG59XG5cbkxpbmVhci5wcm90b3R5cGUgPSB7XG4gIGFyZWFTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fbGluZSA9IDA7XG4gIH0sXG4gIGFyZWFFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2xpbmUgPSBOYU47XG4gIH0sXG4gIGxpbmVTdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcG9pbnQgPSAwO1xuICB9LFxuICBsaW5lRW5kOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fbGluZSB8fCAodGhpcy5fbGluZSAhPT0gMCAmJiB0aGlzLl9wb2ludCA9PT0gMSkpIHRoaXMuX2NvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgdGhpcy5fbGluZSA9IDEgLSB0aGlzLl9saW5lO1xuICB9LFxuICBwb2ludDogZnVuY3Rpb24oeCwgeSkge1xuICAgIHggPSAreCwgeSA9ICt5O1xuICAgIHN3aXRjaCAodGhpcy5fcG9pbnQpIHtcbiAgICAgIGNhc2UgMDogdGhpcy5fcG9pbnQgPSAxOyB0aGlzLl9saW5lID8gdGhpcy5fY29udGV4dC5saW5lVG8oeCwgeSkgOiB0aGlzLl9jb250ZXh0Lm1vdmVUbyh4LCB5KTsgYnJlYWs7XG4gICAgICBjYXNlIDE6IHRoaXMuX3BvaW50ID0gMjsgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgZGVmYXVsdDogdGhpcy5fY29udGV4dC5saW5lVG8oeCwgeSk7IGJyZWFrO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29udGV4dCkge1xuICByZXR1cm4gbmV3IExpbmVhcihjb250ZXh0KTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24geChwKSB7XG4gIHJldHVybiBwWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24geShwKSB7XG4gIHJldHVybiBwWzFdO1xufVxuIiwgImltcG9ydCBhcnJheSBmcm9tIFwiLi9hcnJheS5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgY3VydmVMaW5lYXIgZnJvbSBcIi4vY3VydmUvbGluZWFyLmpzXCI7XG5pbXBvcnQge3dpdGhQYXRofSBmcm9tIFwiLi9wYXRoLmpzXCI7XG5pbXBvcnQge3ggYXMgcG9pbnRYLCB5IGFzIHBvaW50WX0gZnJvbSBcIi4vcG9pbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgeSkge1xuICB2YXIgZGVmaW5lZCA9IGNvbnN0YW50KHRydWUpLFxuICAgICAgY29udGV4dCA9IG51bGwsXG4gICAgICBjdXJ2ZSA9IGN1cnZlTGluZWFyLFxuICAgICAgb3V0cHV0ID0gbnVsbCxcbiAgICAgIHBhdGggPSB3aXRoUGF0aChsaW5lKTtcblxuICB4ID0gdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IHggOiAoeCA9PT0gdW5kZWZpbmVkKSA/IHBvaW50WCA6IGNvbnN0YW50KHgpO1xuICB5ID0gdHlwZW9mIHkgPT09IFwiZnVuY3Rpb25cIiA/IHkgOiAoeSA9PT0gdW5kZWZpbmVkKSA/IHBvaW50WSA6IGNvbnN0YW50KHkpO1xuXG4gIGZ1bmN0aW9uIGxpbmUoZGF0YSkge1xuICAgIHZhciBpLFxuICAgICAgICBuID0gKGRhdGEgPSBhcnJheShkYXRhKSkubGVuZ3RoLFxuICAgICAgICBkLFxuICAgICAgICBkZWZpbmVkMCA9IGZhbHNlLFxuICAgICAgICBidWZmZXI7XG5cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSBvdXRwdXQgPSBjdXJ2ZShidWZmZXIgPSBwYXRoKCkpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8PSBuOyArK2kpIHtcbiAgICAgIGlmICghKGkgPCBuICYmIGRlZmluZWQoZCA9IGRhdGFbaV0sIGksIGRhdGEpKSA9PT0gZGVmaW5lZDApIHtcbiAgICAgICAgaWYgKGRlZmluZWQwID0gIWRlZmluZWQwKSBvdXRwdXQubGluZVN0YXJ0KCk7XG4gICAgICAgIGVsc2Ugb3V0cHV0LmxpbmVFbmQoKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWZpbmVkMCkgb3V0cHV0LnBvaW50KCt4KGQsIGksIGRhdGEpLCAreShkLCBpLCBkYXRhKSk7XG4gICAgfVxuXG4gICAgaWYgKGJ1ZmZlcikgcmV0dXJuIG91dHB1dCA9IG51bGwsIGJ1ZmZlciArIFwiXCIgfHwgbnVsbDtcbiAgfVxuXG4gIGxpbmUueCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGxpbmUpIDogeDtcbiAgfTtcblxuICBsaW5lLnkgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBsaW5lKSA6IHk7XG4gIH07XG5cbiAgbGluZS5kZWZpbmVkID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRlZmluZWQgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIGxpbmUpIDogZGVmaW5lZDtcbiAgfTtcblxuICBsaW5lLmN1cnZlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGN1cnZlID0gXywgY29udGV4dCAhPSBudWxsICYmIChvdXRwdXQgPSBjdXJ2ZShjb250ZXh0KSksIGxpbmUpIDogY3VydmU7XG4gIH07XG5cbiAgbGluZS5jb250ZXh0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKF8gPT0gbnVsbCA/IGNvbnRleHQgPSBvdXRwdXQgPSBudWxsIDogb3V0cHV0ID0gY3VydmUoY29udGV4dCA9IF8pLCBsaW5lKSA6IGNvbnRleHQ7XG4gIH07XG5cbiAgcmV0dXJuIGxpbmU7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgeCA9PiAoKSA9PiB4O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFpvb21FdmVudCh0eXBlLCB7XG4gIHNvdXJjZUV2ZW50LFxuICB0YXJnZXQsXG4gIHRyYW5zZm9ybSxcbiAgZGlzcGF0Y2hcbn0pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgIHR5cGU6IHt2YWx1ZTogdHlwZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBzb3VyY2VFdmVudDoge3ZhbHVlOiBzb3VyY2VFdmVudCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB0YXJnZXQ6IHt2YWx1ZTogdGFyZ2V0LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHRyYW5zZm9ybToge3ZhbHVlOiB0cmFuc2Zvcm0sIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgXzoge3ZhbHVlOiBkaXNwYXRjaH1cbiAgfSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIFRyYW5zZm9ybShrLCB4LCB5KSB7XG4gIHRoaXMuayA9IGs7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBUcmFuc2Zvcm0sXG4gIHNjYWxlOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIGsgPT09IDEgPyB0aGlzIDogbmV3IFRyYW5zZm9ybSh0aGlzLmsgKiBrLCB0aGlzLngsIHRoaXMueSk7XG4gIH0sXG4gIHRyYW5zbGF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiB4ID09PSAwICYgeSA9PT0gMCA/IHRoaXMgOiBuZXcgVHJhbnNmb3JtKHRoaXMuaywgdGhpcy54ICsgdGhpcy5rICogeCwgdGhpcy55ICsgdGhpcy5rICogeSk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbihwb2ludCkge1xuICAgIHJldHVybiBbcG9pbnRbMF0gKiB0aGlzLmsgKyB0aGlzLngsIHBvaW50WzFdICogdGhpcy5rICsgdGhpcy55XTtcbiAgfSxcbiAgYXBwbHlYOiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHggKiB0aGlzLmsgKyB0aGlzLng7XG4gIH0sXG4gIGFwcGx5WTogZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiB5ICogdGhpcy5rICsgdGhpcy55O1xuICB9LFxuICBpbnZlcnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIFsobG9jYXRpb25bMF0gLSB0aGlzLngpIC8gdGhpcy5rLCAobG9jYXRpb25bMV0gLSB0aGlzLnkpIC8gdGhpcy5rXTtcbiAgfSxcbiAgaW52ZXJ0WDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAoeCAtIHRoaXMueCkgLyB0aGlzLms7XG4gIH0sXG4gIGludmVydFk6IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4gKHkgLSB0aGlzLnkpIC8gdGhpcy5rO1xuICB9LFxuICByZXNjYWxlWDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4LmNvcHkoKS5kb21haW4oeC5yYW5nZSgpLm1hcCh0aGlzLmludmVydFgsIHRoaXMpLm1hcCh4LmludmVydCwgeCkpO1xuICB9LFxuICByZXNjYWxlWTogZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiB5LmNvcHkoKS5kb21haW4oeS5yYW5nZSgpLm1hcCh0aGlzLmludmVydFksIHRoaXMpLm1hcCh5LmludmVydCwgeSkpO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdGhpcy54ICsgXCIsXCIgKyB0aGlzLnkgKyBcIikgc2NhbGUoXCIgKyB0aGlzLmsgKyBcIilcIjtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBpZGVudGl0eSA9IG5ldyBUcmFuc2Zvcm0oMSwgMCwgMCk7XG5cbnRyYW5zZm9ybS5wcm90b3R5cGUgPSBUcmFuc2Zvcm0ucHJvdG90eXBlO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm0obm9kZSkge1xuICB3aGlsZSAoIW5vZGUuX196b29tKSBpZiAoIShub2RlID0gbm9kZS5wYXJlbnROb2RlKSkgcmV0dXJuIGlkZW50aXR5O1xuICByZXR1cm4gbm9kZS5fX3pvb207XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcHJvcGFnYXRpb24oZXZlbnQpIHtcbiAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHtkcmFnRGlzYWJsZSwgZHJhZ0VuYWJsZX0gZnJvbSBcImQzLWRyYWdcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGVab29tfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7c2VsZWN0LCBwb2ludGVyfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge2ludGVycnVwdH0gZnJvbSBcImQzLXRyYW5zaXRpb25cIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IFpvb21FdmVudCBmcm9tIFwiLi9ldmVudC5qc1wiO1xuaW1wb3J0IHtUcmFuc2Zvcm0sIGlkZW50aXR5fSBmcm9tIFwiLi90cmFuc2Zvcm0uanNcIjtcbmltcG9ydCBub2V2ZW50LCB7bm9wcm9wYWdhdGlvbn0gZnJvbSBcIi4vbm9ldmVudC5qc1wiO1xuXG4vLyBJZ25vcmUgcmlnaHQtY2xpY2ssIHNpbmNlIHRoYXQgc2hvdWxkIG9wZW4gdGhlIGNvbnRleHQgbWVudS5cbi8vIGV4Y2VwdCBmb3IgcGluY2gtdG8tem9vbSwgd2hpY2ggaXMgc2VudCBhcyBhIHdoZWVsK2N0cmxLZXkgZXZlbnRcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXIoZXZlbnQpIHtcbiAgcmV0dXJuICghZXZlbnQuY3RybEtleSB8fCBldmVudC50eXBlID09PSAnd2hlZWwnKSAmJiAhZXZlbnQuYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0RXh0ZW50KCkge1xuICB2YXIgZSA9IHRoaXM7XG4gIGlmIChlIGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgIGUgPSBlLm93bmVyU1ZHRWxlbWVudCB8fCBlO1xuICAgIGlmIChlLmhhc0F0dHJpYnV0ZShcInZpZXdCb3hcIikpIHtcbiAgICAgIGUgPSBlLnZpZXdCb3guYmFzZVZhbDtcbiAgICAgIHJldHVybiBbW2UueCwgZS55XSwgW2UueCArIGUud2lkdGgsIGUueSArIGUuaGVpZ2h0XV07XG4gICAgfVxuICAgIHJldHVybiBbWzAsIDBdLCBbZS53aWR0aC5iYXNlVmFsLnZhbHVlLCBlLmhlaWdodC5iYXNlVmFsLnZhbHVlXV07XG4gIH1cbiAgcmV0dXJuIFtbMCwgMF0sIFtlLmNsaWVudFdpZHRoLCBlLmNsaWVudEhlaWdodF1dO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VHJhbnNmb3JtKCkge1xuICByZXR1cm4gdGhpcy5fX3pvb20gfHwgaWRlbnRpdHk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXaGVlbERlbHRhKGV2ZW50KSB7XG4gIHJldHVybiAtZXZlbnQuZGVsdGFZICogKGV2ZW50LmRlbHRhTW9kZSA9PT0gMSA/IDAuMDUgOiBldmVudC5kZWx0YU1vZGUgPyAxIDogMC4wMDIpICogKGV2ZW50LmN0cmxLZXkgPyAxMCA6IDEpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VG91Y2hhYmxlKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IChcIm9udG91Y2hzdGFydFwiIGluIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29uc3RyYWluKHRyYW5zZm9ybSwgZXh0ZW50LCB0cmFuc2xhdGVFeHRlbnQpIHtcbiAgdmFyIGR4MCA9IHRyYW5zZm9ybS5pbnZlcnRYKGV4dGVudFswXVswXSkgLSB0cmFuc2xhdGVFeHRlbnRbMF1bMF0sXG4gICAgICBkeDEgPSB0cmFuc2Zvcm0uaW52ZXJ0WChleHRlbnRbMV1bMF0pIC0gdHJhbnNsYXRlRXh0ZW50WzFdWzBdLFxuICAgICAgZHkwID0gdHJhbnNmb3JtLmludmVydFkoZXh0ZW50WzBdWzFdKSAtIHRyYW5zbGF0ZUV4dGVudFswXVsxXSxcbiAgICAgIGR5MSA9IHRyYW5zZm9ybS5pbnZlcnRZKGV4dGVudFsxXVsxXSkgLSB0cmFuc2xhdGVFeHRlbnRbMV1bMV07XG4gIHJldHVybiB0cmFuc2Zvcm0udHJhbnNsYXRlKFxuICAgIGR4MSA+IGR4MCA/IChkeDAgKyBkeDEpIC8gMiA6IE1hdGgubWluKDAsIGR4MCkgfHwgTWF0aC5tYXgoMCwgZHgxKSxcbiAgICBkeTEgPiBkeTAgPyAoZHkwICsgZHkxKSAvIDIgOiBNYXRoLm1pbigwLCBkeTApIHx8IE1hdGgubWF4KDAsIGR5MSlcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBmaWx0ZXIgPSBkZWZhdWx0RmlsdGVyLFxuICAgICAgZXh0ZW50ID0gZGVmYXVsdEV4dGVudCxcbiAgICAgIGNvbnN0cmFpbiA9IGRlZmF1bHRDb25zdHJhaW4sXG4gICAgICB3aGVlbERlbHRhID0gZGVmYXVsdFdoZWVsRGVsdGEsXG4gICAgICB0b3VjaGFibGUgPSBkZWZhdWx0VG91Y2hhYmxlLFxuICAgICAgc2NhbGVFeHRlbnQgPSBbMCwgSW5maW5pdHldLFxuICAgICAgdHJhbnNsYXRlRXh0ZW50ID0gW1stSW5maW5pdHksIC1JbmZpbml0eV0sIFtJbmZpbml0eSwgSW5maW5pdHldXSxcbiAgICAgIGR1cmF0aW9uID0gMjUwLFxuICAgICAgaW50ZXJwb2xhdGUgPSBpbnRlcnBvbGF0ZVpvb20sXG4gICAgICBsaXN0ZW5lcnMgPSBkaXNwYXRjaChcInN0YXJ0XCIsIFwiem9vbVwiLCBcImVuZFwiKSxcbiAgICAgIHRvdWNoc3RhcnRpbmcsXG4gICAgICB0b3VjaGZpcnN0LFxuICAgICAgdG91Y2hlbmRpbmcsXG4gICAgICB0b3VjaERlbGF5ID0gNTAwLFxuICAgICAgd2hlZWxEZWxheSA9IDE1MCxcbiAgICAgIGNsaWNrRGlzdGFuY2UyID0gMCxcbiAgICAgIHRhcERpc3RhbmNlID0gMTA7XG5cbiAgZnVuY3Rpb24gem9vbShzZWxlY3Rpb24pIHtcbiAgICBzZWxlY3Rpb25cbiAgICAgICAgLnByb3BlcnR5KFwiX196b29tXCIsIGRlZmF1bHRUcmFuc2Zvcm0pXG4gICAgICAgIC5vbihcIndoZWVsLnpvb21cIiwgd2hlZWxlZCwge3Bhc3NpdmU6IGZhbHNlfSlcbiAgICAgICAgLm9uKFwibW91c2Vkb3duLnpvb21cIiwgbW91c2Vkb3duZWQpXG4gICAgICAgIC5vbihcImRibGNsaWNrLnpvb21cIiwgZGJsY2xpY2tlZClcbiAgICAgIC5maWx0ZXIodG91Y2hhYmxlKVxuICAgICAgICAub24oXCJ0b3VjaHN0YXJ0Lnpvb21cIiwgdG91Y2hzdGFydGVkKVxuICAgICAgICAub24oXCJ0b3VjaG1vdmUuem9vbVwiLCB0b3VjaG1vdmVkKVxuICAgICAgICAub24oXCJ0b3VjaGVuZC56b29tIHRvdWNoY2FuY2VsLnpvb21cIiwgdG91Y2hlbmRlZClcbiAgICAgICAgLnN0eWxlKFwiLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yXCIsIFwicmdiYSgwLDAsMCwwKVwiKTtcbiAgfVxuXG4gIHpvb20udHJhbnNmb3JtID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gY29sbGVjdGlvbi5zZWxlY3Rpb24gPyBjb2xsZWN0aW9uLnNlbGVjdGlvbigpIDogY29sbGVjdGlvbjtcbiAgICBzZWxlY3Rpb24ucHJvcGVydHkoXCJfX3pvb21cIiwgZGVmYXVsdFRyYW5zZm9ybSk7XG4gICAgaWYgKGNvbGxlY3Rpb24gIT09IHNlbGVjdGlvbikge1xuICAgICAgc2NoZWR1bGUoY29sbGVjdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rpb24uaW50ZXJydXB0KCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VzdHVyZSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgLmV2ZW50KGV2ZW50KVxuICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgLnpvb20obnVsbCwgdHlwZW9mIHRyYW5zZm9ybSA9PT0gXCJmdW5jdGlvblwiID8gdHJhbnNmb3JtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB0cmFuc2Zvcm0pXG4gICAgICAgICAgLmVuZCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHpvb20uc2NhbGVCeSA9IGZ1bmN0aW9uKHNlbGVjdGlvbiwgaywgcCwgZXZlbnQpIHtcbiAgICB6b29tLnNjYWxlVG8oc2VsZWN0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrMCA9IHRoaXMuX196b29tLmssXG4gICAgICAgICAgazEgPSB0eXBlb2YgayA9PT0gXCJmdW5jdGlvblwiID8gay5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogaztcbiAgICAgIHJldHVybiBrMCAqIGsxO1xuICAgIH0sIHAsIGV2ZW50KTtcbiAgfTtcblxuICB6b29tLnNjYWxlVG8gPSBmdW5jdGlvbihzZWxlY3Rpb24sIGssIHAsIGV2ZW50KSB7XG4gICAgem9vbS50cmFuc2Zvcm0oc2VsZWN0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlID0gZXh0ZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksXG4gICAgICAgICAgdDAgPSB0aGlzLl9fem9vbSxcbiAgICAgICAgICBwMCA9IHAgPT0gbnVsbCA/IGNlbnRyb2lkKGUpIDogdHlwZW9mIHAgPT09IFwiZnVuY3Rpb25cIiA/IHAuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHAsXG4gICAgICAgICAgcDEgPSB0MC5pbnZlcnQocDApLFxuICAgICAgICAgIGsxID0gdHlwZW9mIGsgPT09IFwiZnVuY3Rpb25cIiA/IGsuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGs7XG4gICAgICByZXR1cm4gY29uc3RyYWluKHRyYW5zbGF0ZShzY2FsZSh0MCwgazEpLCBwMCwgcDEpLCBlLCB0cmFuc2xhdGVFeHRlbnQpO1xuICAgIH0sIHAsIGV2ZW50KTtcbiAgfTtcblxuICB6b29tLnRyYW5zbGF0ZUJ5ID0gZnVuY3Rpb24oc2VsZWN0aW9uLCB4LCB5LCBldmVudCkge1xuICAgIHpvb20udHJhbnNmb3JtKHNlbGVjdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc3RyYWluKHRoaXMuX196b29tLnRyYW5zbGF0ZShcbiAgICAgICAgdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IHguYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHgsXG4gICAgICAgIHR5cGVvZiB5ID09PSBcImZ1bmN0aW9uXCIgPyB5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB5XG4gICAgICApLCBleHRlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdHJhbnNsYXRlRXh0ZW50KTtcbiAgICB9LCBudWxsLCBldmVudCk7XG4gIH07XG5cbiAgem9vbS50cmFuc2xhdGVUbyA9IGZ1bmN0aW9uKHNlbGVjdGlvbiwgeCwgeSwgcCwgZXZlbnQpIHtcbiAgICB6b29tLnRyYW5zZm9ybShzZWxlY3Rpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUgPSBleHRlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgICB0ID0gdGhpcy5fX3pvb20sXG4gICAgICAgICAgcDAgPSBwID09IG51bGwgPyBjZW50cm9pZChlKSA6IHR5cGVvZiBwID09PSBcImZ1bmN0aW9uXCIgPyBwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBwO1xuICAgICAgcmV0dXJuIGNvbnN0cmFpbihpZGVudGl0eS50cmFuc2xhdGUocDBbMF0sIHAwWzFdKS5zY2FsZSh0LmspLnRyYW5zbGF0ZShcbiAgICAgICAgdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IC14LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiAteCxcbiAgICAgICAgdHlwZW9mIHkgPT09IFwiZnVuY3Rpb25cIiA/IC15LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiAteVxuICAgICAgKSwgZSwgdHJhbnNsYXRlRXh0ZW50KTtcbiAgICB9LCBwLCBldmVudCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2NhbGUodHJhbnNmb3JtLCBrKSB7XG4gICAgayA9IE1hdGgubWF4KHNjYWxlRXh0ZW50WzBdLCBNYXRoLm1pbihzY2FsZUV4dGVudFsxXSwgaykpO1xuICAgIHJldHVybiBrID09PSB0cmFuc2Zvcm0uayA/IHRyYW5zZm9ybSA6IG5ldyBUcmFuc2Zvcm0oaywgdHJhbnNmb3JtLngsIHRyYW5zZm9ybS55KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZSh0cmFuc2Zvcm0sIHAwLCBwMSkge1xuICAgIHZhciB4ID0gcDBbMF0gLSBwMVswXSAqIHRyYW5zZm9ybS5rLCB5ID0gcDBbMV0gLSBwMVsxXSAqIHRyYW5zZm9ybS5rO1xuICAgIHJldHVybiB4ID09PSB0cmFuc2Zvcm0ueCAmJiB5ID09PSB0cmFuc2Zvcm0ueSA/IHRyYW5zZm9ybSA6IG5ldyBUcmFuc2Zvcm0odHJhbnNmb3JtLmssIHgsIHkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2VudHJvaWQoZXh0ZW50KSB7XG4gICAgcmV0dXJuIFsoK2V4dGVudFswXVswXSArICtleHRlbnRbMV1bMF0pIC8gMiwgKCtleHRlbnRbMF1bMV0gKyArZXh0ZW50WzFdWzFdKSAvIDJdO1xuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGUodHJhbnNpdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpIHtcbiAgICB0cmFuc2l0aW9uXG4gICAgICAgIC5vbihcInN0YXJ0Lnpvb21cIiwgZnVuY3Rpb24oKSB7IGdlc3R1cmUodGhpcywgYXJndW1lbnRzKS5ldmVudChldmVudCkuc3RhcnQoKTsgfSlcbiAgICAgICAgLm9uKFwiaW50ZXJydXB0Lnpvb20gZW5kLnpvb21cIiwgZnVuY3Rpb24oKSB7IGdlc3R1cmUodGhpcywgYXJndW1lbnRzKS5ldmVudChldmVudCkuZW5kKCk7IH0pXG4gICAgICAgIC50d2VlbihcInpvb21cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICBnID0gZ2VzdHVyZSh0aGF0LCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgICAgICAgIGUgPSBleHRlbnQuYXBwbHkodGhhdCwgYXJncyksXG4gICAgICAgICAgICAgIHAgPSBwb2ludCA9PSBudWxsID8gY2VudHJvaWQoZSkgOiB0eXBlb2YgcG9pbnQgPT09IFwiZnVuY3Rpb25cIiA/IHBvaW50LmFwcGx5KHRoYXQsIGFyZ3MpIDogcG9pbnQsXG4gICAgICAgICAgICAgIHcgPSBNYXRoLm1heChlWzFdWzBdIC0gZVswXVswXSwgZVsxXVsxXSAtIGVbMF1bMV0pLFxuICAgICAgICAgICAgICBhID0gdGhhdC5fX3pvb20sXG4gICAgICAgICAgICAgIGIgPSB0eXBlb2YgdHJhbnNmb3JtID09PSBcImZ1bmN0aW9uXCIgPyB0cmFuc2Zvcm0uYXBwbHkodGhhdCwgYXJncykgOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgIGkgPSBpbnRlcnBvbGF0ZShhLmludmVydChwKS5jb25jYXQodyAvIGEuayksIGIuaW52ZXJ0KHApLmNvbmNhdCh3IC8gYi5rKSk7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIGlmICh0ID09PSAxKSB0ID0gYjsgLy8gQXZvaWQgcm91bmRpbmcgZXJyb3Igb24gZW5kLlxuICAgICAgICAgICAgZWxzZSB7IHZhciBsID0gaSh0KSwgayA9IHcgLyBsWzJdOyB0ID0gbmV3IFRyYW5zZm9ybShrLCBwWzBdIC0gbFswXSAqIGssIHBbMV0gLSBsWzFdICogayk7IH1cbiAgICAgICAgICAgIGcuem9vbShudWxsLCB0KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlc3R1cmUodGhhdCwgYXJncywgY2xlYW4pIHtcbiAgICByZXR1cm4gKCFjbGVhbiAmJiB0aGF0Ll9fem9vbWluZykgfHwgbmV3IEdlc3R1cmUodGhhdCwgYXJncyk7XG4gIH1cblxuICBmdW5jdGlvbiBHZXN0dXJlKHRoYXQsIGFyZ3MpIHtcbiAgICB0aGlzLnRoYXQgPSB0aGF0O1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgdGhpcy5hY3RpdmUgPSAwO1xuICAgIHRoaXMuc291cmNlRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuZXh0ZW50ID0gZXh0ZW50LmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgIHRoaXMudGFwcyA9IDA7XG4gIH1cblxuICBHZXN0dXJlLnByb3RvdHlwZSA9IHtcbiAgICBldmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudCkgdGhpcy5zb3VyY2VFdmVudCA9IGV2ZW50O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoKyt0aGlzLmFjdGl2ZSA9PT0gMSkge1xuICAgICAgICB0aGlzLnRoYXQuX196b29taW5nID0gdGhpcztcbiAgICAgICAgdGhpcy5lbWl0KFwic3RhcnRcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHpvb206IGZ1bmN0aW9uKGtleSwgdHJhbnNmb3JtKSB7XG4gICAgICBpZiAodGhpcy5tb3VzZSAmJiBrZXkgIT09IFwibW91c2VcIikgdGhpcy5tb3VzZVsxXSA9IHRyYW5zZm9ybS5pbnZlcnQodGhpcy5tb3VzZVswXSk7XG4gICAgICBpZiAodGhpcy50b3VjaDAgJiYga2V5ICE9PSBcInRvdWNoXCIpIHRoaXMudG91Y2gwWzFdID0gdHJhbnNmb3JtLmludmVydCh0aGlzLnRvdWNoMFswXSk7XG4gICAgICBpZiAodGhpcy50b3VjaDEgJiYga2V5ICE9PSBcInRvdWNoXCIpIHRoaXMudG91Y2gxWzFdID0gdHJhbnNmb3JtLmludmVydCh0aGlzLnRvdWNoMVswXSk7XG4gICAgICB0aGlzLnRoYXQuX196b29tID0gdHJhbnNmb3JtO1xuICAgICAgdGhpcy5lbWl0KFwiem9vbVwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnRoYXQuX196b29taW5nO1xuICAgICAgICB0aGlzLmVtaXQoXCJlbmRcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHZhciBkID0gc2VsZWN0KHRoaXMudGhhdCkuZGF0dW0oKTtcbiAgICAgIGxpc3RlbmVycy5jYWxsKFxuICAgICAgICB0eXBlLFxuICAgICAgICB0aGlzLnRoYXQsXG4gICAgICAgIG5ldyBab29tRXZlbnQodHlwZSwge1xuICAgICAgICAgIHNvdXJjZUV2ZW50OiB0aGlzLnNvdXJjZUV2ZW50LFxuICAgICAgICAgIHRhcmdldDogem9vbSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIHRyYW5zZm9ybTogdGhpcy50aGF0Ll9fem9vbSxcbiAgICAgICAgICBkaXNwYXRjaDogbGlzdGVuZXJzXG4gICAgICAgIH0pLFxuICAgICAgICBkXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiB3aGVlbGVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgIHQgPSB0aGlzLl9fem9vbSxcbiAgICAgICAgayA9IE1hdGgubWF4KHNjYWxlRXh0ZW50WzBdLCBNYXRoLm1pbihzY2FsZUV4dGVudFsxXSwgdC5rICogTWF0aC5wb3coMiwgd2hlZWxEZWx0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpLFxuICAgICAgICBwID0gcG9pbnRlcihldmVudCk7XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgaW4gdGhlIHNhbWUgbG9jYXRpb24gYXMgYmVmb3JlLCByZXVzZSBpdC5cbiAgICAvLyBJZiB0aGVyZSB3ZXJlIHJlY2VudCB3aGVlbCBldmVudHMsIHJlc2V0IHRoZSB3aGVlbCBpZGxlIHRpbWVvdXQuXG4gICAgaWYgKGcud2hlZWwpIHtcbiAgICAgIGlmIChnLm1vdXNlWzBdWzBdICE9PSBwWzBdIHx8IGcubW91c2VbMF1bMV0gIT09IHBbMV0pIHtcbiAgICAgICAgZy5tb3VzZVsxXSA9IHQuaW52ZXJ0KGcubW91c2VbMF0gPSBwKTtcbiAgICAgIH1cbiAgICAgIGNsZWFyVGltZW91dChnLndoZWVsKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIHdoZWVsIGV2ZW50IHdvblx1MjAxOXQgdHJpZ2dlciBhIHRyYW5zZm9ybSBjaGFuZ2UsIGlnbm9yZSBpdC5cbiAgICBlbHNlIGlmICh0LmsgPT09IGspIHJldHVybjtcblxuICAgIC8vIE90aGVyd2lzZSwgY2FwdHVyZSB0aGUgbW91c2UgcG9pbnQgYW5kIGxvY2F0aW9uIGF0IHRoZSBzdGFydC5cbiAgICBlbHNlIHtcbiAgICAgIGcubW91c2UgPSBbcCwgdC5pbnZlcnQocCldO1xuICAgICAgaW50ZXJydXB0KHRoaXMpO1xuICAgICAgZy5zdGFydCgpO1xuICAgIH1cblxuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGcud2hlZWwgPSBzZXRUaW1lb3V0KHdoZWVsaWRsZWQsIHdoZWVsRGVsYXkpO1xuICAgIGcuem9vbShcIm1vdXNlXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUoc2NhbGUodCwgayksIGcubW91c2VbMF0sIGcubW91c2VbMV0pLCBnLmV4dGVudCwgdHJhbnNsYXRlRXh0ZW50KSk7XG5cbiAgICBmdW5jdGlvbiB3aGVlbGlkbGVkKCkge1xuICAgICAgZy53aGVlbCA9IG51bGw7XG4gICAgICBnLmVuZCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlZG93bmVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKHRvdWNoZW5kaW5nIHx8ICFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldCxcbiAgICAgICAgZyA9IGdlc3R1cmUodGhpcywgYXJncywgdHJ1ZSkuZXZlbnQoZXZlbnQpLFxuICAgICAgICB2ID0gc2VsZWN0KGV2ZW50LnZpZXcpLm9uKFwibW91c2Vtb3ZlLnpvb21cIiwgbW91c2Vtb3ZlZCwgdHJ1ZSkub24oXCJtb3VzZXVwLnpvb21cIiwgbW91c2V1cHBlZCwgdHJ1ZSksXG4gICAgICAgIHAgPSBwb2ludGVyKGV2ZW50LCBjdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgeDAgPSBldmVudC5jbGllbnRYLFxuICAgICAgICB5MCA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICBkcmFnRGlzYWJsZShldmVudC52aWV3KTtcbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBnLm1vdXNlID0gW3AsIHRoaXMuX196b29tLmludmVydChwKV07XG4gICAgaW50ZXJydXB0KHRoaXMpO1xuICAgIGcuc3RhcnQoKTtcblxuICAgIGZ1bmN0aW9uIG1vdXNlbW92ZWQoZXZlbnQpIHtcbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgICAgaWYgKCFnLm1vdmVkKSB7XG4gICAgICAgIHZhciBkeCA9IGV2ZW50LmNsaWVudFggLSB4MCwgZHkgPSBldmVudC5jbGllbnRZIC0geTA7XG4gICAgICAgIGcubW92ZWQgPSBkeCAqIGR4ICsgZHkgKiBkeSA+IGNsaWNrRGlzdGFuY2UyO1xuICAgICAgfVxuICAgICAgZy5ldmVudChldmVudClcbiAgICAgICAuem9vbShcIm1vdXNlXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUoZy50aGF0Ll9fem9vbSwgZy5tb3VzZVswXSA9IHBvaW50ZXIoZXZlbnQsIGN1cnJlbnRUYXJnZXQpLCBnLm1vdXNlWzFdKSwgZy5leHRlbnQsIHRyYW5zbGF0ZUV4dGVudCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNldXBwZWQoZXZlbnQpIHtcbiAgICAgIHYub24oXCJtb3VzZW1vdmUuem9vbSBtb3VzZXVwLnpvb21cIiwgbnVsbCk7XG4gICAgICBkcmFnRW5hYmxlKGV2ZW50LnZpZXcsIGcubW92ZWQpO1xuICAgICAgbm9ldmVudChldmVudCk7XG4gICAgICBnLmV2ZW50KGV2ZW50KS5lbmQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkYmxjbGlja2VkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciB0MCA9IHRoaXMuX196b29tLFxuICAgICAgICBwMCA9IHBvaW50ZXIoZXZlbnQuY2hhbmdlZFRvdWNoZXMgPyBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IGV2ZW50LCB0aGlzKSxcbiAgICAgICAgcDEgPSB0MC5pbnZlcnQocDApLFxuICAgICAgICBrMSA9IHQwLmsgKiAoZXZlbnQuc2hpZnRLZXkgPyAwLjUgOiAyKSxcbiAgICAgICAgdDEgPSBjb25zdHJhaW4odHJhbnNsYXRlKHNjYWxlKHQwLCBrMSksIHAwLCBwMSksIGV4dGVudC5hcHBseSh0aGlzLCBhcmdzKSwgdHJhbnNsYXRlRXh0ZW50KTtcblxuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGlmIChkdXJhdGlvbiA+IDApIHNlbGVjdCh0aGlzKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLmNhbGwoc2NoZWR1bGUsIHQxLCBwMCwgZXZlbnQpO1xuICAgIGVsc2Ugc2VsZWN0KHRoaXMpLmNhbGwoem9vbS50cmFuc2Zvcm0sIHQxLCBwMCwgZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hzdGFydGVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciB0b3VjaGVzID0gZXZlbnQudG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLFxuICAgICAgICBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzLCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPT09IG4pLmV2ZW50KGV2ZW50KSxcbiAgICAgICAgc3RhcnRlZCwgaSwgdCwgcDtcblxuICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHQgPSB0b3VjaGVzW2ldLCBwID0gcG9pbnRlcih0LCB0aGlzKTtcbiAgICAgIHAgPSBbcCwgdGhpcy5fX3pvb20uaW52ZXJ0KHApLCB0LmlkZW50aWZpZXJdO1xuICAgICAgaWYgKCFnLnRvdWNoMCkgZy50b3VjaDAgPSBwLCBzdGFydGVkID0gdHJ1ZSwgZy50YXBzID0gMSArICEhdG91Y2hzdGFydGluZztcbiAgICAgIGVsc2UgaWYgKCFnLnRvdWNoMSAmJiBnLnRvdWNoMFsyXSAhPT0gcFsyXSkgZy50b3VjaDEgPSBwLCBnLnRhcHMgPSAwO1xuICAgIH1cblxuICAgIGlmICh0b3VjaHN0YXJ0aW5nKSB0b3VjaHN0YXJ0aW5nID0gY2xlYXJUaW1lb3V0KHRvdWNoc3RhcnRpbmcpO1xuXG4gICAgaWYgKHN0YXJ0ZWQpIHtcbiAgICAgIGlmIChnLnRhcHMgPCAyKSB0b3VjaGZpcnN0ID0gcFswXSwgdG91Y2hzdGFydGluZyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRvdWNoc3RhcnRpbmcgPSBudWxsOyB9LCB0b3VjaERlbGF5KTtcbiAgICAgIGludGVycnVwdCh0aGlzKTtcbiAgICAgIGcuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaG1vdmVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLl9fem9vbWluZykgcmV0dXJuO1xuICAgIHZhciBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCB0LCBwLCBsO1xuXG4gICAgbm9ldmVudChldmVudCk7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgdCA9IHRvdWNoZXNbaV0sIHAgPSBwb2ludGVyKHQsIHRoaXMpO1xuICAgICAgaWYgKGcudG91Y2gwICYmIGcudG91Y2gwWzJdID09PSB0LmlkZW50aWZpZXIpIGcudG91Y2gwWzBdID0gcDtcbiAgICAgIGVsc2UgaWYgKGcudG91Y2gxICYmIGcudG91Y2gxWzJdID09PSB0LmlkZW50aWZpZXIpIGcudG91Y2gxWzBdID0gcDtcbiAgICB9XG4gICAgdCA9IGcudGhhdC5fX3pvb207XG4gICAgaWYgKGcudG91Y2gxKSB7XG4gICAgICB2YXIgcDAgPSBnLnRvdWNoMFswXSwgbDAgPSBnLnRvdWNoMFsxXSxcbiAgICAgICAgICBwMSA9IGcudG91Y2gxWzBdLCBsMSA9IGcudG91Y2gxWzFdLFxuICAgICAgICAgIGRwID0gKGRwID0gcDFbMF0gLSBwMFswXSkgKiBkcCArIChkcCA9IHAxWzFdIC0gcDBbMV0pICogZHAsXG4gICAgICAgICAgZGwgPSAoZGwgPSBsMVswXSAtIGwwWzBdKSAqIGRsICsgKGRsID0gbDFbMV0gLSBsMFsxXSkgKiBkbDtcbiAgICAgIHQgPSBzY2FsZSh0LCBNYXRoLnNxcnQoZHAgLyBkbCkpO1xuICAgICAgcCA9IFsocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyXTtcbiAgICAgIGwgPSBbKGwwWzBdICsgbDFbMF0pIC8gMiwgKGwwWzFdICsgbDFbMV0pIC8gMl07XG4gICAgfVxuICAgIGVsc2UgaWYgKGcudG91Y2gwKSBwID0gZy50b3VjaDBbMF0sIGwgPSBnLnRvdWNoMFsxXTtcbiAgICBlbHNlIHJldHVybjtcblxuICAgIGcuem9vbShcInRvdWNoXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUodCwgcCwgbCksIGcuZXh0ZW50LCB0cmFuc2xhdGVFeHRlbnQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoZW5kZWQoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuX196b29taW5nKSByZXR1cm47XG4gICAgdmFyIGcgPSBnZXN0dXJlKHRoaXMsIGFyZ3MpLmV2ZW50KGV2ZW50KSxcbiAgICAgICAgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLFxuICAgICAgICBuID0gdG91Y2hlcy5sZW5ndGgsIGksIHQ7XG5cbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBpZiAodG91Y2hlbmRpbmcpIGNsZWFyVGltZW91dCh0b3VjaGVuZGluZyk7XG4gICAgdG91Y2hlbmRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0b3VjaGVuZGluZyA9IG51bGw7IH0sIHRvdWNoRGVsYXkpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHQgPSB0b3VjaGVzW2ldO1xuICAgICAgaWYgKGcudG91Y2gwICYmIGcudG91Y2gwWzJdID09PSB0LmlkZW50aWZpZXIpIGRlbGV0ZSBnLnRvdWNoMDtcbiAgICAgIGVsc2UgaWYgKGcudG91Y2gxICYmIGcudG91Y2gxWzJdID09PSB0LmlkZW50aWZpZXIpIGRlbGV0ZSBnLnRvdWNoMTtcbiAgICB9XG4gICAgaWYgKGcudG91Y2gxICYmICFnLnRvdWNoMCkgZy50b3VjaDAgPSBnLnRvdWNoMSwgZGVsZXRlIGcudG91Y2gxO1xuICAgIGlmIChnLnRvdWNoMCkgZy50b3VjaDBbMV0gPSB0aGlzLl9fem9vbS5pbnZlcnQoZy50b3VjaDBbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgZy5lbmQoKTtcbiAgICAgIC8vIElmIHRoaXMgd2FzIGEgZGJsdGFwLCByZXJvdXRlIHRvIHRoZSAob3B0aW9uYWwpIGRibGNsaWNrLnpvb20gaGFuZGxlci5cbiAgICAgIGlmIChnLnRhcHMgPT09IDIpIHtcbiAgICAgICAgdCA9IHBvaW50ZXIodCwgdGhpcyk7XG4gICAgICAgIGlmIChNYXRoLmh5cG90KHRvdWNoZmlyc3RbMF0gLSB0WzBdLCB0b3VjaGZpcnN0WzFdIC0gdFsxXSkgPCB0YXBEaXN0YW5jZSkge1xuICAgICAgICAgIHZhciBwID0gc2VsZWN0KHRoaXMpLm9uKFwiZGJsY2xpY2suem9vbVwiKTtcbiAgICAgICAgICBpZiAocCkgcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgem9vbS53aGVlbERlbHRhID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdoZWVsRGVsdGEgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgem9vbSkgOiB3aGVlbERlbHRhO1xuICB9O1xuXG4gIHpvb20uZmlsdGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZpbHRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgem9vbSkgOiBmaWx0ZXI7XG4gIH07XG5cbiAgem9vbS50b3VjaGFibGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hhYmxlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCB6b29tKSA6IHRvdWNoYWJsZTtcbiAgfTtcblxuICB6b29tLmV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleHRlbnQgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KFtbK19bMF1bMF0sICtfWzBdWzFdXSwgWytfWzFdWzBdLCArX1sxXVsxXV1dKSwgem9vbSkgOiBleHRlbnQ7XG4gIH07XG5cbiAgem9vbS5zY2FsZUV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzY2FsZUV4dGVudFswXSA9ICtfWzBdLCBzY2FsZUV4dGVudFsxXSA9ICtfWzFdLCB6b29tKSA6IFtzY2FsZUV4dGVudFswXSwgc2NhbGVFeHRlbnRbMV1dO1xuICB9O1xuXG4gIHpvb20udHJhbnNsYXRlRXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zbGF0ZUV4dGVudFswXVswXSA9ICtfWzBdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMV1bMF0gPSArX1sxXVswXSwgdHJhbnNsYXRlRXh0ZW50WzBdWzFdID0gK19bMF1bMV0sIHRyYW5zbGF0ZUV4dGVudFsxXVsxXSA9ICtfWzFdWzFdLCB6b29tKSA6IFtbdHJhbnNsYXRlRXh0ZW50WzBdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMF1bMV1dLCBbdHJhbnNsYXRlRXh0ZW50WzFdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMV1bMV1dXTtcbiAgfTtcblxuICB6b29tLmNvbnN0cmFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb25zdHJhaW4gPSBfLCB6b29tKSA6IGNvbnN0cmFpbjtcbiAgfTtcblxuICB6b29tLmR1cmF0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGR1cmF0aW9uID0gK18sIHpvb20pIDogZHVyYXRpb247XG4gIH07XG5cbiAgem9vbS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpbnRlcnBvbGF0ZSA9IF8sIHpvb20pIDogaW50ZXJwb2xhdGU7XG4gIH07XG5cbiAgem9vbS5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGxpc3RlbmVycy5vbi5hcHBseShsaXN0ZW5lcnMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBsaXN0ZW5lcnMgPyB6b29tIDogdmFsdWU7XG4gIH07XG5cbiAgem9vbS5jbGlja0Rpc3RhbmNlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsaWNrRGlzdGFuY2UyID0gKF8gPSArXykgKiBfLCB6b29tKSA6IE1hdGguc3FydChjbGlja0Rpc3RhbmNlMik7XG4gIH07XG5cbiAgem9vbS50YXBEaXN0YW5jZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0YXBEaXN0YW5jZSA9ICtfLCB6b29tKSA6IHRhcERpc3RhbmNlO1xuICB9O1xuXG4gIHJldHVybiB6b29tO1xufVxuIiwgImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xyXG5cclxuLy8gPT09PSBMb2FkIGRhdGEgPT09PVxyXG5jb25zdCBkZXBzID0gYXdhaXQgZmV0Y2goXCIuL2RlcHMuanNvblwiKS50aGVuKHIgPT4gci5qc29uKCkpO1xyXG5cclxuLy8gPT09PSBET00gcmVmcyA9PT09XHJcbmNvbnN0IHN2ZyA9IGQzLnNlbGVjdChcIiN2aXpcIik7XHJcbmNvbnN0IGdNYWluID0gc3ZnLmFwcGVuZChcImdcIik7ICAgICAgICAgICAgICAgICAgLy8gem9vbWVkIGdyb3VwXHJcbmNvbnN0IGdMaW5rcyA9IGdNYWluLmFwcGVuZChcImdcIik7XHJcbmNvbnN0IGdOb2RlcyA9IGdNYWluLmFwcGVuZChcImdcIik7XHJcbmNvbnN0IGdMYWJlbHMgPSBnTWFpbi5hcHBlbmQoXCJnXCIpO1xyXG5jb25zdCBpbmZvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNpbmZvXCIpO1xyXG5jb25zdCBlZGdlVHlwZVNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZWRnZVR5cGVcIik7XHJcbmNvbnN0IGZpbHRlcklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNmaWx0ZXJcIik7XHJcbmNvbnN0IGxhYmVsc1RvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGFiZWxzXCIpO1xyXG5cclxuLy8gPT09PSBTY2FsZXMgJiBoZWxwZXJzID09PT1cclxuY29uc3QgY29sb3IgPSBkMy5zY2FsZU9yZGluYWwoKVxyXG4gIC5kb21haW4oW1wibW9kdWxlXCIsXCJwcm9ncmFtXCIsXCJzdWJyb3V0aW5lXCIsXCJmdW5jdGlvblwiLFwiaW50ZXJmYWNlXCIsXCJnZW5lcmljXCIsXCJ0eXBlXCIsXCJ1bmtub3duXCJdKVxyXG4gIC5yYW5nZShkMy5zY2hlbWVUYWJsZWF1MTApO1xyXG5cclxuZnVuY3Rpb24gbm9kZUtleShkKSB7IHJldHVybiBkLmlkOyB9XHJcblxyXG5mdW5jdGlvbiBnZXROZWlnaGJvcnNNYXAobGlua3MpIHtcclxuICBjb25zdCBuYiA9IG5ldyBNYXAoKTtcclxuICBmb3IgKGNvbnN0IGwgb2YgbGlua3MpIHtcclxuICAgIChuYi5nZXQobC5zb3VyY2UuaWQpIHx8IG5iLnNldChsLnNvdXJjZS5pZCwgbmV3IFNldCgpKS5nZXQobC5zb3VyY2UuaWQpKS5hZGQobC50YXJnZXQuaWQpO1xyXG4gICAgKG5iLmdldChsLnRhcmdldC5pZCkgfHwgbmIuc2V0KGwudGFyZ2V0LmlkLCBuZXcgU2V0KCkpLmdldChsLnRhcmdldC5pZCkpLmFkZChsLnNvdXJjZS5pZCk7XHJcbiAgfVxyXG4gIHJldHVybiBuYjtcclxufVxyXG5cclxuZnVuY3Rpb24gZmlsdGVyTm9kZXMobm9kZXMsIHEpIHtcclxuICBpZiAoIXEpIHJldHVybiBub2RlcztcclxuICBjb25zdCB0ID0gcS50b0xvd2VyQ2FzZSgpO1xyXG4gIHJldHVybiBub2Rlcy5maWx0ZXIobiA9PlxyXG4gICAgbi5pZC5pbmNsdWRlcyh0KSB8fCAobi5uYW1lfHxcIlwiKS5pbmNsdWRlcyh0KSB8fCAobi5zY29wZXx8XCJcIikuaW5jbHVkZXModCkgfHwgKG4ua2luZHx8XCJcIikuaW5jbHVkZXModClcclxuICApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZEdyYXBoKGVkZ2VUeXBlLCBxdWVyeSkge1xyXG4gIC8vIDEpIG5vZGVzIGJ5IGlkIChjb3B5IGJlY2F1c2Ugd2VcdTIwMTlsbCBtdXRhdGUgeC95KVxyXG4gIGNvbnN0IG5vZGVzQnlJZCA9IG5ldyBNYXAoZGVwcy5ub2Rlcy5tYXAobiA9PiBbbi5pZCwgeyAuLi5uIH1dKSk7XHJcblxyXG4gIC8vIDIpIHJhdyBlZGdlcyAodHlwZS1maWx0ZXJlZClcclxuICBjb25zdCByYXdFZGdlcyA9IGRlcHMubGlua3MuZmlsdGVyKGwgPT4gbC50eXBlID09PSBlZGdlVHlwZSk7XHJcblxyXG4gIC8vIDMpIG1ha2UgdW5pcXVlIFtzb3VyY2UsdGFyZ2V0XSBwYWlycyBhbmQga2VlcCBvbmx5IHRob3NlIHdob3NlIG5vZGVzIGV4aXN0XHJcbiAgY29uc3QgcGFpcnMgPSBBcnJheS5mcm9tKG5ldyBTZXQoXHJcbiAgICByYXdFZGdlcy5tYXAobCA9PiB7XHJcbiAgICAgIGNvbnN0IHMgPSB0eXBlb2YgbC5zb3VyY2UgPT09IFwic3RyaW5nXCIgPyBsLnNvdXJjZSA6IGwuc291cmNlPy5pZDtcclxuICAgICAgY29uc3QgdCA9IHR5cGVvZiBsLnRhcmdldCA9PT0gXCJzdHJpbmdcIiA/IGwudGFyZ2V0IDogbC50YXJnZXQ/LmlkO1xyXG4gICAgICByZXR1cm4gYCR7c31cXHQke3R9YDtcclxuICAgIH0pXHJcbiAgKSkubWFwKHMgPT4ge1xyXG4gICAgY29uc3QgW3NJZCwgdElkXSA9IHMuc3BsaXQoXCJcXHRcIik7XHJcbiAgICByZXR1cm4geyBzb3VyY2U6IHNJZCwgdGFyZ2V0OiB0SWQgfTtcclxuICB9KS5maWx0ZXIocCA9PiBub2Rlc0J5SWQuaGFzKHAuc291cmNlKSAmJiBub2Rlc0J5SWQuaGFzKHAudGFyZ2V0KSk7XHJcblxyXG4gIC8vIDQpIG9wdGlvbmFsIG5vZGUgZmlsdGVyIC0+IGluZHVjZWQgc3ViZ3JhcGhcclxuICBjb25zdCBrZWVwID0gbmV3IFNldChmaWx0ZXJOb2RlcyhbLi4ubm9kZXNCeUlkLnZhbHVlcygpXSwgcXVlcnkpLm1hcChuID0+IG4uaWQpKTtcclxuICBjb25zdCBsaW5rcyA9IHBhaXJzXHJcbiAgICAuZmlsdGVyKHAgPT4ga2VlcC5oYXMocC5zb3VyY2UpIHx8IGtlZXAuaGFzKHAudGFyZ2V0KSlcclxuICAgIC5tYXAocCA9PiAoeyBzb3VyY2U6IG5vZGVzQnlJZC5nZXQocC5zb3VyY2UpLCB0YXJnZXQ6IG5vZGVzQnlJZC5nZXQocC50YXJnZXQpIH0pKTtcclxuXHJcbiAgLy8gNSkgY29sbGVjdCB0aGUgZmluYWwgbm9kZSBzZXQgdGhhdFx1MjAxOXMgYWN0dWFsbHkgdXNlZFxyXG4gIGNvbnN0IHVzZWQgPSBuZXcgU2V0KCk7XHJcbiAgZm9yIChjb25zdCBsIG9mIGxpbmtzKSB7IHVzZWQuYWRkKGwuc291cmNlLmlkKTsgdXNlZC5hZGQobC50YXJnZXQuaWQpOyB9XHJcbiAgY29uc3Qgbm9kZXMgPSBbLi4udXNlZF0ubWFwKGlkID0+IG5vZGVzQnlJZC5nZXQoaWQpKTtcclxuXHJcbiAgLy8gZGVncmVlIGZvciBzaXppbmdcclxuICBjb25zdCBkZWcgPSBuZXcgTWFwKFsuLi51c2VkXS5tYXAoaWQgPT4gW2lkLCAwXSkpO1xyXG4gIGZvciAoY29uc3QgbCBvZiBsaW5rcykgeyBkZWcuc2V0KGwuc291cmNlLmlkLCBkZWcuZ2V0KGwuc291cmNlLmlkKSsxKTsgZGVnLnNldChsLnRhcmdldC5pZCwgZGVnLmdldChsLnRhcmdldC5pZCkrMSk7IH1cclxuICBmb3IgKGNvbnN0IG4gb2Ygbm9kZXMpIG4uZGVncmVlID0gZGVnLmdldChuLmlkKSB8fCAwO1xyXG5cclxuICByZXR1cm4geyBub2RlcywgbGlua3MgfTtcclxufVxyXG5cclxuLy8gPT09PSBSZW5kZXIgLyBTaW11bGF0aW9uID09PT1cclxuY29uc3QgbGluZSA9IGQzLmxpbmUoKTsgLy8gc3RyYWlnaHQgc2VnbWVudHMgKHdlXHUyMDE5bGwgZHJhdyBsaW5lcywgbm90IGFyY3MpXHJcblxyXG5jb25zdCB6b29tID0gZDMuem9vbSgpLm9uKFwiem9vbVwiLCBldiA9PiBnTWFpbi5hdHRyKFwidHJhbnNmb3JtXCIsIGV2LnRyYW5zZm9ybSkpO1xyXG5zdmcuY2FsbCh6b29tKTtcclxuXHJcbmZ1bmN0aW9uIHJ1bihlZGdlVHlwZSA9IFwiY2FsbFwiLCBxdWVyeSA9IFwiXCIpIHtcclxuICBjb25zdCB7IG5vZGVzLCBsaW5rcyB9ID0gYnVpbGRHcmFwaChlZGdlVHlwZSwgcXVlcnkpO1xyXG5cclxuICAvLyAtLS0gc2ltdWxhdGlvbjogXHUyMDFDZGlzam9pbnRcdTIwMUQgc3R5bGUgKHBvc2l0aW9uIGZvcmNlcyBpbnN0ZWFkIG9mIGEgc2luZ2xlIGNlbnRlcikgLS0tXHJcbiAgLy8gUmVmOiBEMyBkaXNqb2ludCBleGFtcGxlIGFuZCBkb2NzIGZvciBtYW55Qm9keS9saW5rL2NvbGxpZGUvZm9yY2VYL2ZvcmNlWS4gXHJcbiAgLy8gVGhlIGZvcmNlTGluayB1c2VzIGlkIGFjY2Vzc29yIHNvIGxpbmtzIGNhbiByZWZlciB0byBub2RlcyBieSBzdHJpbmcgaWQuIDpjb250ZW50UmVmZXJlbmNlW29haWNpdGU6Ml17aW5kZXg9Mn1cclxuICBjb25zdCBzaW0gPSBkMy5mb3JjZVNpbXVsYXRpb24obm9kZXMpXHJcbiAgICAuZm9yY2UoXCJjaGFyZ2VcIiwgZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKGQgPT4gKGQua2luZCA9PT0gXCJtb2R1bGVcIiA/IC0yMDAgOiAtODApKSkgLy8gcmVwdWxzaW9uXHJcbiAgICAuZm9yY2UoXCJsaW5rXCIsIGQzLmZvcmNlTGluayhsaW5rcykuaWQobm9kZUtleSkuZGlzdGFuY2UoZCA9PiA0MCArIDIqTWF0aC5taW4oZC5zb3VyY2UuZGVncmVlLGQudGFyZ2V0LmRlZ3JlZSkpLnN0cmVuZ3RoKDAuMykpXHJcbiAgICAuZm9yY2UoXCJjb2xsaWRlXCIsIGQzLmZvcmNlQ29sbGlkZSgpLnJhZGl1cyhkID0+IDQgKyBNYXRoLnNxcnQoMiArIGQuZGVncmVlKSkuaXRlcmF0aW9ucygyKSkgIC8vIG5vIG92ZXJsYXAuIDpjb250ZW50UmVmZXJlbmNlW29haWNpdGU6M117aW5kZXg9M31cclxuICAgIC5mb3JjZShcInhcIiwgZDMuZm9yY2VYKCkuc3RyZW5ndGgoMC4wNikpIC8vIHBvc2l0aW9uIGZvcmNlcyByYXRoZXIgdGhhbiBhIHNpbmdsZSBjZW50ZXIgKGRpc2pvaW50KS4gOmNvbnRlbnRSZWZlcmVuY2Vbb2FpY2l0ZTo0XXtpbmRleD00fVxyXG4gICAgLmZvcmNlKFwieVwiLCBkMy5mb3JjZVkoKS5zdHJlbmd0aCgwLjA2KSk7XHJcblxyXG4gIC8vIC0tLSBqb2luIC0tLVxyXG4gIGNvbnN0IGxpbmtTZWwgPSBnTGlua3Muc2VsZWN0QWxsKFwibGluZVwiKS5kYXRhKGxpbmtzLCBkID0+IGQuc291cmNlLmlkICsgXCJcdTIxOTJcIiArIGQudGFyZ2V0LmlkKTtcclxuICBsaW5rU2VsLmV4aXQoKS5yZW1vdmUoKTtcclxuICBjb25zdCBsaW5rRW50ZXIgPSBsaW5rU2VsLmVudGVyKCkuYXBwZW5kKFwibGluZVwiKS5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMSk7XHJcbiAgY29uc3QgbGluayA9IGxpbmtFbnRlci5tZXJnZShsaW5rU2VsKTtcclxuXHJcbiAgY29uc3Qgbm9kZVNlbCA9IGdOb2Rlcy5zZWxlY3RBbGwoXCJjaXJjbGVcIikuZGF0YShub2Rlcywgbm9kZUtleSk7XHJcbiAgbm9kZVNlbC5leGl0KCkucmVtb3ZlKCk7XHJcbiAgY29uc3Qgbm9kZUVudGVyID0gbm9kZVNlbC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgIC5hdHRyKFwiclwiLCBkID0+IDMgKyBNYXRoLnNxcnQoMSArIGQuZGVncmVlKSlcclxuICAgIC5hdHRyKFwiZmlsbFwiLCBkID0+IGNvbG9yKGQua2luZCkpXHJcbiAgICAuYXR0cihcInN0cm9rZVwiLCBcIiMwYjBlMTJcIilcclxuICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDAuNzUpXHJcbiAgICAuY2FsbChkMy5kcmFnKCkgLy8gZHJhZyBiZWhhdmlvciBmb3Igbm9kZXMuIDpjb250ZW50UmVmZXJlbmNlW29haWNpdGU6NV17aW5kZXg9NX1cclxuICAgICAgLm9uKFwic3RhcnRcIiwgKGV2LCBkKSA9PiB7XHJcbiAgICAgICAgaWYgKCFldi5hY3RpdmUpIHNpbS5hbHBoYVRhcmdldCgwLjIpLnJlc3RhcnQoKTtcclxuICAgICAgICBkLmZ4ID0gZC54OyBkLmZ5ID0gZC55O1xyXG4gICAgICB9KVxyXG4gICAgICAub24oXCJkcmFnXCIsIChldiwgZCkgPT4geyBkLmZ4ID0gZXYueDsgZC5meSA9IGV2Lnk7IH0pXHJcbiAgICAgIC5vbihcImVuZFwiLCAgKGV2LCBkKSA9PiB7IGlmICghZXYuYWN0aXZlKSBzaW0uYWxwaGFUYXJnZXQoMCk7IGQuZnggPSBudWxsOyBkLmZ5ID0gbnVsbDsgfSlcclxuICAgIClcclxuICAgIC5vbihcIm1vdXNlZW50ZXJcIiwgKF8sIGQpID0+IHNob3dJbmZvKGQsIGxpbmtzKSlcclxuICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gY2xlYXJIaWdobGlnaHQoKSlcclxuICAgIC5vbihcIm1vdXNlbW92ZVwiLCAoZXYsIGQpID0+IG1heWJlSGlnaGxpZ2h0KGQpKTtcclxuXHJcbiAgY29uc3Qgbm9kZSA9IG5vZGVFbnRlci5tZXJnZShub2RlU2VsKTtcclxuXHJcbiAgY29uc3QgbGFiZWxTZWwgPSBnTGFiZWxzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcywgbm9kZUtleSk7XHJcbiAgbGFiZWxTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IGxhYmVsID0gbGFiZWxTZWwuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAuYXR0cihcImNsYXNzXCIsXCJsYWJlbFwiKVxyXG4gICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLFwibWlkZGxlXCIpXHJcbiAgICAuYXR0cihcImR5XCIsXCItMC43NWVtXCIpXHJcbiAgICAudGV4dChkID0+IGQubmFtZSB8fCBkLmlkKVxyXG4gICAgLm1lcmdlKGxhYmVsU2VsKTtcclxuXHJcbiAgLy8gbmVpZ2hib3IgaGlnaGxpZ2h0aW5nIG9uIGhvdmVyXHJcbiAgY29uc3QgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzTWFwKGxpbmtzKTtcclxuICBmdW5jdGlvbiBtYXliZUhpZ2hsaWdodChkKSB7XHJcbiAgICBjb25zdCBuYiA9IG5laWdoYm9ycy5nZXQoZC5pZCkgfHwgbmV3IFNldCgpO1xyXG4gICAgbm9kZS5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIG4gPT4gbi5pZCA9PT0gZC5pZCB8fCBuYi5oYXMobi5pZCkpXHJcbiAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIG4gPT4gKG4uaWQgPT09IGQuaWQgfHwgbmIuaGFzKG4uaWQpKSA/IDEgOiAwLjIpO1xyXG4gICAgbGluay5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGwgPT4gbC5zb3VyY2UuaWQgPT09IGQuaWQgfHwgbC50YXJnZXQuaWQgPT09IGQuaWQpXHJcbiAgICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIGwgPT4gKGwuc291cmNlLmlkID09PSBkLmlkIHx8IGwudGFyZ2V0LmlkID09PSBkLmlkKSA/IDAuOSA6IDAuMSk7XHJcbiAgICBsYWJlbC5hdHRyKFwib3BhY2l0eVwiLCBuID0+IChsYWJlbHNUb2dnbGUuY2hlY2tlZCA/ICgobi5pZCA9PT0gZC5pZCB8fCBuYi5oYXMobi5pZCkpID8gMSA6IDAuMDUpIDogMCkpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodCgpIHtcclxuICAgIG5vZGUuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBmYWxzZSkuYXR0cihcIm9wYWNpdHlcIiwgMSk7XHJcbiAgICBsaW5rLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgZmFsc2UpLmF0dHIoXCJvcGFjaXR5XCIsIDAuMjUpO1xyXG4gICAgbGFiZWwuYXR0cihcIm9wYWNpdHlcIiwgbGFiZWxzVG9nZ2xlLmNoZWNrZWQgPyAxIDogMCk7XHJcbiAgfVxyXG5cclxuICAvLyBzaWRlIHBhbmVsIGluZm9cclxuICBmdW5jdGlvbiBzaG93SW5mbyhkLCBsaW5rcykge1xyXG4gICAgY29uc3QgaW5jb21pbmcgPSBsaW5rcy5maWx0ZXIobCA9PiBsLnRhcmdldC5pZCA9PT0gZC5pZCkubWFwKGwgPT4gbC5zb3VyY2UuaWQpO1xyXG4gICAgY29uc3Qgb3V0Z29pbmcgPSBsaW5rcy5maWx0ZXIobCA9PiBsLnNvdXJjZS5pZCA9PT0gZC5pZCkubWFwKGwgPT4gbC50YXJnZXQuaWQpO1xyXG4gICAgY29uc3QgZGV0YWlscyA9IHtcclxuICAgICAgaWQ6IGQuaWQsIG5hbWU6IGQubmFtZSwga2luZDogZC5raW5kLCBzY29wZTogZC5zY29wZSxcclxuICAgICAgZmlsZTogZC5maWxlLCBsaW5lOiBkLmxpbmUsIHZpc2liaWxpdHk6IGQudmlzaWJpbGl0eSxcclxuICAgICAgYXR0cnM6IGQuYXR0cnMsIHJlc3VsdDogZC5yZXN1bHQsIGR1bW1pZXM6IGQuZHVtbWllcyxcclxuICAgICAgLy8gY29tcGFjdCBuZWlnaGJvcnNcclxuICAgICAgaW5fZGVncmVlOiBpbmNvbWluZy5sZW5ndGgsIG91dF9kZWdyZWU6IG91dGdvaW5nLmxlbmd0aFxyXG4gICAgfTtcclxuICAgIGluZm8uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8aDE+JHtkLm5hbWUgfHwgZC5pZH08L2gxPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibXV0ZWRcIj4ke2Qua2luZH0ke2Quc2NvcGUgPyBgIFx1MjAxNCBzY29wZTogJHtkLnNjb3BlfWAgOiBcIlwifTwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luOjhweCAwXCI+aW46IDxiPiR7aW5jb21pbmcubGVuZ3RofTwvYj4gXHUyMDIyIG91dDogPGI+JHtvdXRnb2luZy5sZW5ndGh9PC9iPjwvZGl2PlxyXG4gICAgICA8cHJlPiR7ZXNjYXBlSHRtbChKU09OLnN0cmluZ2lmeShkZXRhaWxzLCBudWxsLCAyKSl9PC9wcmU+XHJcbiAgICBgO1xyXG4gIH1cclxuICBmdW5jdGlvbiBlc2NhcGVIdG1sKHMpe3JldHVybiBzLnJlcGxhY2UoL1smPD5cIiddL2csIG0gPT4gKHsnJic6JyZhbXA7JywnPCc6JyZsdDsnLCc+JzonJmd0OycsJ1wiJzonJnF1b3Q7JyxcIidcIjonJiMzOTsnfVttXSkpfVxyXG5cclxuICAvLyB0aWNrc1xyXG4gIHNpbS5vbihcInRpY2tcIiwgKCkgPT4ge1xyXG4gICAgbGlua1xyXG4gICAgICAuYXR0cihcIngxXCIsIGQgPT4gZC5zb3VyY2UueCkuYXR0cihcInkxXCIsIGQgPT4gZC5zb3VyY2UueSlcclxuICAgICAgLmF0dHIoXCJ4MlwiLCBkID0+IGQudGFyZ2V0LngpLmF0dHIoXCJ5MlwiLCBkID0+IGQudGFyZ2V0LnkpO1xyXG5cclxuICAgIG5vZGUuYXR0cihcImN4XCIsIGQgPT4gZC54KS5hdHRyKFwiY3lcIiwgZCA9PiBkLnkpO1xyXG4gICAgbGFiZWwuYXR0cihcInhcIiwgZCA9PiBkLngpLmF0dHIoXCJ5XCIsIGQgPT4gZC55KTtcclxuICB9KTtcclxuXHJcbiAgLy8gbGFiZWwgdG9nZ2xlXHJcbiAgbGFiZWwuYXR0cihcIm9wYWNpdHlcIiwgbGFiZWxzVG9nZ2xlLmNoZWNrZWQgPyAxIDogMCk7XHJcblxyXG4gIC8vIGZpdCB2aWV3IG9uIGZpcnN0IHJ1blxyXG4gIGlmIChub2Rlcy5sZW5ndGgpIHtcclxuICAgIC8vIGxldCB0aGUgc2ltIHNldHRsZSBhIGJpdCwgdGhlbiBmaXRcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0gPSBleHRlbnRYWShub2Rlcyk7XHJcbiAgICAgIGNvbnN0IHcgPSBtYXhYIC0gbWluWCwgaCA9IG1heFkgLSBtaW5ZO1xyXG4gICAgICBjb25zdCB2YiA9IFttaW5YIC0gNDAsIG1pblkgLSA0MCwgdyArIDgwLCBoICsgODBdO1xyXG4gICAgICBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMClcclxuICAgICAgICAuY2FsbCh6b29tLnRyYW5zZm9ybSwgZDMuem9vbUlkZW50aXR5XHJcbiAgICAgICAgICAudHJhbnNsYXRlKHN2Zy5ub2RlKCkuY2xpZW50V2lkdGgvMiwgc3ZnLm5vZGUoKS5jbGllbnRIZWlnaHQvMilcclxuICAgICAgICAgIC5zY2FsZShNYXRoLm1pbihzdmcubm9kZSgpLmNsaWVudFdpZHRoL3ZiWzJdLCBzdmcubm9kZSgpLmNsaWVudEhlaWdodC92YlszXSkpXHJcbiAgICAgICAgICAudHJhbnNsYXRlKC0odmJbMF0rdmJbMl0vMiksIC0odmJbMV0rdmJbM10vMikpKTtcclxuICAgIH0sIDMwMCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBleHRlbnRYWShub2Rlcyl7XHJcbiAgbGV0IG1pblg9K0luZmluaXR5LG1pblk9K0luZmluaXR5LG1heFg9LUluZmluaXR5LG1heFk9LUluZmluaXR5O1xyXG4gIGZvciAoY29uc3QgbiBvZiBub2Rlcyl7IGlmKG4ueDxtaW5YKW1pblg9bi54OyBpZihuLnk8bWluWSltaW5ZPW4ueTsgaWYobi54Pm1heFgpbWF4WD1uLng7IGlmKG4ueT5tYXhZKW1heFk9bi55OyB9XHJcbiAgcmV0dXJuIFttaW5YLG1pblksbWF4WCxtYXhZXTtcclxufVxyXG5cclxuLy8gPT09PSB3aXJlIHVwIGNvbnRyb2xzID09PT1cclxuZWRnZVR5cGVTZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBydW4oZWRnZVR5cGVTZWwudmFsdWUsIGZpbHRlcklucHV0LnZhbHVlKSk7XHJcbmZpbHRlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBkMy5kZWJvdW5jZT8uKCAoKSA9PiBydW4oZWRnZVR5cGVTZWwudmFsdWUsIGZpbHRlcklucHV0LnZhbHVlKSwgMjAwKSB8fCAoKCk9PnJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpKSk7XHJcbmxhYmVsc1RvZ2dsZS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpKTtcclxuXHJcbi8vIGtpY2sgaXQgb2ZmXHJcbnJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQU8sSUFBTSxZQUFOLGNBQXdCLElBQUk7QUFBQSxFQUNqQyxZQUFZLFNBQVMsTUFBTSxPQUFPO0FBQ2hD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QUFBLEVBQ1osTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLEVBQ1AsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLEVBQ1AsVUFBVTtBQUFBLEVBQ1YsZUFBZTtBQUFBLEVBQ2YsV0FBVztBQUFBLEVBQ1gsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsc0JBQXNCO0FBQUEsRUFDdEIsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsZUFBZTtBQUFBLEVBQ2YsY0FBYztBQUFBLEVBQ2QsZ0JBQWdCO0FBQUEsRUFDaEIsZ0JBQWdCO0FBQUEsRUFDaEIsZ0JBQWdCO0FBQUEsRUFDaEIsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBQ1Isa0JBQWtCO0FBQUEsRUFDbEIsWUFBWTtBQUFBLEVBQ1osY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsZ0JBQWdCO0FBQUEsRUFDaEIsaUJBQWlCO0FBQUEsRUFDakIsbUJBQW1CO0FBQUEsRUFDbkIsaUJBQWlCO0FBQUEsRUFDakIsaUJBQWlCO0FBQUEsRUFDakIsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLEVBQ1QsT0FBTztBQUFBLEVBQ1AsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsZUFBZTtB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QUMsRUFDM0UsVUFBVSxFQUFFLEdBQUcsQ0FBQyxJQUFFLEdBQUcsQ0FBQyxJQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBRSxHQUFHLENBQUMsSUFBRSxFQUFFLENBQUM7QUFBQSxJQUNwRCxHQUFHLEdBQUc7QUFBQSxFQUNSO0FBQ0Y7QUFFQSxTQUFTLFNBQVMsT0FBTTtBQUN0QixNQUFJLE9BQUssVUFBVSxPQUFLLFVBQVUsT0FBSyxXQUFVLE9BQUs7QUFDdEQsYUFBVyxLQUFLLE9BQU07QUFBRSxRQUFHLEVBQUUsSUFBRSxLQUFLLFFBQUssRUFBRTtBQUFHLFFBQUcsRUFBRSxJQUFFLEtBQUssUUFBSyxFQUFFO0FBQUcsUUFBRyxFQUFFLElBQUUsS0FBSyxRQUFLLEVBQUU7QUFBRyxRQUFHLEVBQUUsSUFBRSxLQUFLLFFBQUssRUFBRTtBQUFBLEVBQUc7QUFDaEgsU0FBTyxDQUFDLE1BQUssTUFBSyxNQUFLLElBQUk7QUFDN0I7QUFHQSxZQUFZLGlCQUFpQixVQUFVLE1BQU0sSUFBSSxZQUFZLE9BQU8sWUFBWSxLQUFLLENBQUM7QUFDdEYsWUFBWSxpQkFBaUIsU0FBWSxXQUFZLE1BQU0sSUFBSSxZQUFZLE9BQU8sWUFBWSxLQUFLLEdBQUcsR0FBRyxNQUFNLE1BQUksSUFBSSxZQUFZLE9BQU8sWUFBWSxLQUFLLEVBQUU7QUFDN0osYUFBYSxpQkFBaUIsVUFBVSxNQUFNLElBQUksWUFBWSxPQUFPLFlBQVksS0FBSyxDQUFDO0FBR3ZGLElBQUksWUFBWSxPQUFPLFlBQVksS0FBSzsiLAogICJuYW1lcyI6IFsia2V5IiwgInR5cGUiLCAiYyIsICJkb2N1bWVudCIsICJtIiwgIngiLCAibSIsICJtIiwgImRhdHVtIiwgIngiLCAibSIsICJzZWxlY3Rpb24iLCAibSIsICJtIiwgImEiLCAibSIsICJtIiwgIm0iLCAiY3JlYXRlIiwgImNyZWF0ZSIsICJwYXJzZVR5cGVuYW1lcyIsICJtIiwgInR5cGUiLCAid2luZG93IiwgImRpc3BhdGNoX2RlZmF1bHQiLCAibSIsICJkaXNwYXRjaF9kZWZhdWx0IiwgInNlbGVjdF9kZWZhdWx0IiwgInN2ZyIsICJyb290IiwgInNlbGVjdGlvbiIsICJzZWxlY3RfZGVmYXVsdCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAidHlwZSIsICJ4IiwgInkiLCAiZGlzcGF0Y2giLCAiZmlsdGVyIiwgInNlbGVjdGlvbiIsICJzZWxlY3RfZGVmYXVsdCIsICJjIiwgImNvbnRhaW5lciIsICJkaXNwYXRjaCIsICJ0eXBlIiwgImV2ZW50IiwgInRvdWNoIiwgImNvbnN0YW50X2RlZmF1bHQiLCAibSIsICJhIiwgIm1pbiIsICJtYXgiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgImEiLCAieSIsICJ5IiwgImEiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ5IiwgImNvbG9yIiwgInJnYiIsICJzdGFydCIsICJhIiwgImEiLCAiaSIsICJhIiwgImMiLCAibSIsICJhIiwgIngiLCAiem9vbSIsICJub3ciLCAiaWQiLCAiaW5kZXgiLCAiZ2V0IiwgInNldCIsICJzdGFydCIsICJlbXB0eSIsICJpbnRlcnJ1cHRfZGVmYXVsdCIsICJpZCIsICJzZXQiLCAiZ2V0IiwgInRyYW5zaXRpb24iLCAiYSIsICJjIiwgImF0dHJSZW1vdmUiLCAiYXR0clJlbW92ZU5TIiwgImF0dHJDb25zdGFudCIsICJhdHRyQ29uc3RhbnROUyIsICJhdHRyRnVuY3Rpb24iLCAiYXR0ckZ1bmN0aW9uTlMiLCAiYXR0cl9kZWZhdWx0IiwgImlkIiwgImdldCIsICJpZCIsICJzZXQiLCAiZ2V0IiwgImlkIiwgInNldCIsICJnZXQiLCAiaWQiLCAic2V0IiwgImZpbHRlcl9kZWZhdWx0IiwgIm0iLCAibWVyZ2VfZGVmYXVsdCIsICJ0cmFuc2l0aW9uIiwgIm0iLCAiaWQiLCAic2V0IiwgIm9uX2RlZmF1bHQiLCAiZ2V0IiwgImlkIiwgInJlbW92ZV9kZWZhdWx0IiwgInNlbGVjdF9kZWZhdWx0IiwgImlkIiwgIm0iLCAiZ2V0IiwgInNlbGVjdEFsbF9kZWZhdWx0IiwgImlkIiwgIm0iLCAiY2hpbGRyZW4iLCAiaW5oZXJpdCIsICJnZXQiLCAiU2VsZWN0aW9uIiwgInNlbGVjdGlvbl9kZWZhdWx0IiwgInN0eWxlUmVtb3ZlIiwgInN0eWxlQ29uc3RhbnQiLCAic3R5bGVGdW5jdGlvbiIsICJpZCIsICJyZW1vdmUiLCAic2V0IiwgInN0eWxlX2RlZmF1bHQiLCAidGV4dENvbnN0YW50IiwgInRleHRGdW5jdGlvbiIsICJ0ZXh0X2RlZmF1bHQiLCAibSIsICJpbmhlcml0IiwgImdldCIsICJpZCIsICJzZXQiLCAiaWQiLCAic2VsZWN0X2RlZmF1bHQiLCAic2VsZWN0QWxsX2RlZmF1bHQiLCAiZmlsdGVyX2RlZmF1bHQiLCAibWVyZ2VfZGVmYXVsdCIsICJzZWxlY3Rpb25fZGVmYXVsdCIsICJvbl9kZWZhdWx0IiwgImF0dHJfZGVmYXVsdCIsICJzdHlsZV9kZWZhdWx0IiwgInRleHRfZGVmYXVsdCIsICJyZW1vdmVfZGVmYXVsdCIsICJpZCIsICJ0cmFuc2l0aW9uX2RlZmF1bHQiLCAibSIsICJpbnRlcnJ1cHRfZGVmYXVsdCIsICJ0cmFuc2l0aW9uX2RlZmF1bHQiLCAieCIsICJ5IiwgIngiLCAieSIsICJ4MiIsICJ5MiIsICJ4IiwgInkiLCAieCIsICJ5IiwgImRhdGFfZGVmYXVsdCIsICJ4IiwgInkiLCAieDIiLCAieTIiLCAieDMiLCAieTMiLCAicmVtb3ZlX2RlZmF1bHQiLCAieCIsICJ5IiwgInNpemVfZGVmYXVsdCIsICJ4IiwgInkiLCAiZGF0YV9kZWZhdWx0IiwgInJlbW92ZV9kZWZhdWx0IiwgInNpemVfZGVmYXVsdCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInkiLCAiZmluZCIsICJpZCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAieSIsICJtIiwgImkiLCAieCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAieCIsICJ5IiwgIm5vZGUiLCAic3RyZW5ndGgiLCAiYyIsICJ4MiIsICJ4X2RlZmF1bHQiLCAieCIsICJjb25zdGFudF9kZWZhdWx0IiwgInlfZGVmYXVsdCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAiaW5kZXgiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgIngiLCAieCIsICJ5IiwgIngiLCAieSIsICJ4IiwgInkiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJwYXRoIiwgImxpbmUiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInR5cGUiLCAidHJhbnNmb3JtIiwgImRpc3BhdGNoIiwgIngiLCAieSIsICJpZGVudGl0eSIsICJub3Byb3BhZ2F0aW9uIiwgIm5vZXZlbnRfZGVmYXVsdCIsICJkZWZhdWx0RmlsdGVyIiwgImlkZW50aXR5IiwgImRlZmF1bHRUb3VjaGFibGUiLCAidHJhbnNmb3JtIiwgInpvb21fZGVmYXVsdCIsICJmaWx0ZXIiLCAiem9vbSIsICJzZWxlY3Rpb24iLCAieCIsICJ5IiwgImV4dGVudCIsICJ0cmFuc2l0aW9uIiwgImEiLCAidHlwZSIsICJzZWxlY3RfZGVmYXVsdCIsICJub2V2ZW50X2RlZmF1bHQiLCAibm9wcm9wYWdhdGlvbiIsICJldmVudCIsICJjb25zdGFudF9kZWZhdWx0IiwgInNlbGVjdF9kZWZhdWx0IiwgImNvbG9yIiwgImlkIiwgInpvb21fZGVmYXVsdCIsICJ4X2RlZmF1bHQiLCAieV9kZWZhdWx0IiwgImxpbmtzIiwgIm0iLCAiaWRlbnRpdHkiXQp9Cg==
