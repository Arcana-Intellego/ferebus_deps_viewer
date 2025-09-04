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
function array(x3) {
  return x3 == null ? [] : Array.isArray(x3) ? x3 : Array.from(x3);
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
function constant_default(x3) {
  return function() {
    return x3;
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
var constant_default2 = (x3) => () => x3;

// node_modules/d3-drag/src/event.js
function DragEvent(type2, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x: x3,
  y: y3,
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
    x: { value: x3, enumerable: true, configurable: true },
    y: { value: y3, enumerable: true, configurable: true },
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
var constant_default3 = (x3) => () => x3;

// node_modules/d3-interpolate/src/color.js
function linear(a2, d) {
  return function(t) {
    return a2 + t * d;
  };
}
function exponential(a2, b, y3) {
  return a2 = Math.pow(a2, y3), b = Math.pow(b, y3) - a2, y3 = 1 / y3, function(t) {
    return Math.pow(a2 + t * b, y3);
  };
}
function gamma(y3) {
  return (y3 = +y3) === 1 ? nogamma : function(a2, b) {
    return b - a2 ? exponential(a2, b, y3) : constant_default3(isNaN(a2) ? b : a2);
  };
}
function nogamma(a2, b) {
  var d = b - a2;
  return d ? linear(a2, d) : constant_default3(isNaN(a2) ? b : a2);
}

// node_modules/d3-interpolate/src/rgb.js
var rgb_default = (function rgbGamma(y3) {
  var color2 = gamma(y3);
  function rgb2(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
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
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
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
function cosh(x3) {
  return ((x3 = Math.exp(x3)) + 1 / x3) / 2;
}
function sinh(x3) {
  return ((x3 = Math.exp(x3)) - 1 / x3) / 2;
}
function tanh(x3) {
  return ((x3 = Math.exp(2 * x3)) - 1) / (x3 + 1);
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
  input: function(x3, e) {
    return x3 == null ? null : [[+x3[0], e[0][1]], [+x3[1], e[1][1]]];
  },
  output: function(xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y3, e) {
    return y3 == null ? null : [[e[0][0], +y3[0]], [e[1][0], +y3[1]]];
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

// node_modules/d3-quadtree/src/add.js
function add_default(d) {
  const x3 = +this._x.call(null, d), y3 = +this._y.call(null, d);
  return add(this.cover(x3, y3), x3, y3, d);
}
function add(tree, x3, y3, d) {
  if (isNaN(x3) || isNaN(y3)) return tree;
  var parent, node = tree._root, leaf = { data: d }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node) return tree._root = leaf, tree;
  while (node.length) {
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x3 === xp && y3 === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
    else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data) {
  var d, i, n = data.length, x3, y3, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x3 = +this._x.call(null, d = data[i])) || isNaN(y3 = +this._y.call(null, d))) continue;
    xz[i] = x3;
    yz[i] = y3;
    if (x3 < x0) x0 = x3;
    if (x3 > x1) x1 = x3;
    if (y3 < y0) y0 = y3;
    if (y3 > y1) y1 = y3;
  }
  if (x0 > x1 || y0 > y1) return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }
  return this;
}

// node_modules/d3-quadtree/src/cover.js
function cover_default(x3, y3) {
  if (isNaN(x3 = +x3) || isNaN(y3 = +y3)) return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x3)) + 1;
    y1 = (y0 = Math.floor(y3)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x3 || x3 >= x1 || y0 > y3 || y3 >= y1) {
      i = (y3 < y0) << 1 | x3 < x0;
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
function find_default(x3, y3, radius) {
  var data, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x32 = this._x1, y32 = this._y1, quads = [], node = this._root, q, i;
  if (node) quads.push(new quad_default(node, x0, y0, x32, y32));
  if (radius == null) radius = Infinity;
  else {
    x0 = x3 - radius, y0 = y3 - radius;
    x32 = x3 + radius, y32 = y3 + radius;
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
      if (i = (y3 >= ym) << 1 | x3 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x3 - +this._x.call(null, node.data), dy = y3 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d = Math.sqrt(radius = d2);
        x0 = x3 - d, y0 = y3 - d;
        x32 = x3 + d, y32 = y3 + d;
        data = node.data;
      }
    }
  }
  return data;
}

// node_modules/d3-quadtree/src/remove.js
function remove_default3(d) {
  if (isNaN(x3 = +this._x.call(null, d)) || isNaN(y3 = +this._y.call(null, d))) return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x3, y3, xm, ym, right, bottom, i, j;
  if (!node) return this;
  if (node.length) while (true) {
    if (right = x3 >= (xm = (x0 + x1) / 2)) x0 = xm;
    else x1 = xm;
    if (bottom = y3 >= (ym = (y0 + y1) / 2)) y0 = ym;
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
function quadtree(nodes, x3, y3) {
  var tree = new Quadtree(x3 == null ? defaultX : x3, y3 == null ? defaultY : y3, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x3, y3, x0, y0, x1, y1) {
  this._x = x3;
  this._y = y3;
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
function constant_default5(x3) {
  return function() {
    return x3;
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
          var x3 = xi - data.x - data.vx, y3 = yi - data.y - data.vy, l = x3 * x3 + y3 * y3;
          if (l < r * r) {
            if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
            if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x3 *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y3 *= l) * r;
            data.vx -= x3 * (r = 1 - r);
            data.vy -= y3 * r;
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
      for (var i = 0, link, source, target, x3, y3, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x3 = target.x + target.vx - source.x - source.vx || jiggle_default(random);
        y3 = target.y + target.vy - source.y - source.vy || jiggle_default(random);
        l = Math.sqrt(x3 * x3 + y3 * y3);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x3 *= l, y3 *= l;
        target.vx -= x3 * (b = bias[i]);
        target.vy -= y3 * b;
        source.vx += x3 * (b = 1 - b);
        source.vy += y3 * b;
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
    find: function(x3, y3, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null) radius = Infinity;
      else radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x3 - node.x;
        dy = y3 - node.y;
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
    var strength2 = 0, q, c2, weight = 0, x3, y3, i;
    if (quad.length) {
      for (x3 = y3 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x3 += c2 * q.x, y3 += c2 * q.y;
        }
      }
      quad.x = x3 / weight;
      quad.y = y3 / weight;
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
    var x3 = quad.x - node.x, y3 = quad.y - node.y, w = x22 - x1, l = x3 * x3 + y3 * y3;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
        if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x3 * quad.value * alpha / l;
        node.vy += y3 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2) return;
    if (quad.data !== node || quad.next) {
      if (x3 === 0) x3 = jiggle_default(random), l += x3 * x3;
      if (y3 === 0) y3 = jiggle_default(random), l += y3 * y3;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x3 * w;
        node.vy += y3 * w;
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
function x_default2(x3) {
  var strength = constant_default5(0.1), nodes, strengths, xz;
  if (typeof x3 !== "function") x3 = constant_default5(x3 == null ? 0 : +x3);
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
      strengths[i] = isNaN(xz[i] = +x3(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
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
    return arguments.length ? (x3 = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : x3;
  };
  return force;
}

// node_modules/d3-force/src/y.js
function y_default2(y3) {
  var strength = constant_default5(0.1), nodes, strengths, yz;
  if (typeof y3 !== "function") y3 = constant_default5(y3 == null ? 0 : +y3);
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
      strengths[i] = isNaN(yz[i] = +y3(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
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
    return arguments.length ? (y3 = typeof _ === "function" ? _ : constant_default5(+_), initialize(), force) : y3;
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

// node_modules/d3-zoom/src/constant.js
var constant_default6 = (x3) => () => x3;

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
function Transform(k, x3, y3) {
  this.k = k;
  this.x = x3;
  this.y = y3;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x3, y3) {
    return x3 === 0 & y3 === 0 ? this : new Transform(this.k, this.x + this.k * x3, this.y + this.k * y3);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x3) {
    return x3 * this.k + this.x;
  },
  applyY: function(y3) {
    return y3 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x3) {
    return (x3 - this.x) / this.k;
  },
  invertY: function(y3) {
    return (y3 - this.y) / this.k;
  },
  rescaleX: function(x3) {
    return x3.copy().domain(x3.range().map(this.invertX, this).map(x3.invert, x3));
  },
  rescaleY: function(y3) {
    return y3.copy().domain(y3.range().map(this.invertY, this).map(y3.invert, y3));
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
  zoom2.translateBy = function(selection2, x3, y3, event) {
    zoom2.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x3 === "function" ? x3.apply(this, arguments) : x3,
        typeof y3 === "function" ? y3.apply(this, arguments) : y3
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom2.translateTo = function(selection2, x3, y3, p, event) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x3 === "function" ? -x3.apply(this, arguments) : -x3,
        typeof y3 === "function" ? -y3.apply(this, arguments) : -y3
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x3 = p0[0] - p1[0] * transform2.k, y3 = p0[1] - p1[1] * transform2.k;
    return x3 === transform2.x && y3 === transform2.y ? transform2 : new Transform(transform2.k, x3, y3);
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
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default6(+_), zoom2) : wheelDelta;
  };
  zoom2.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default6(!!_), zoom2) : filter2;
  };
  zoom2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default6(!!_), zoom2) : touchable;
  };
  zoom2.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default6([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom2) : extent;
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
var EDGE_TYPES = ["call", "use", "module-procedure-of", "binds-to", "uses-type"];
var TYPE_ALIAS = /* @__PURE__ */ new Map([["module_procedure_of", "module-procedure-of"]]);
var EDGE_COLORS = {
  "call": "#6aa0ff",
  "use": "#7bd389",
  "module-procedure-of": "#f59e0b",
  "binds-to": "#ef4444",
  "uses-type": "#a78bfa"
};
var activeTypes = new Set(EDGE_TYPES);
var deps = await fetch("./deps.json").then((r) => r.json());
var svg = select_default2("#viz");
var gMain = svg.append("g");
var gDefs = svg.append("defs");
var gLinks = gMain.append("g");
var gNodes = gMain.append("g");
var gLabels = gMain.append("g");
var info = document.querySelector("#info");
var edgeTypeSel = document.querySelector("#edgeType");
var filterInput = document.querySelector("#filter");
var labelsToggle = document.querySelector("#labels");
var legendEl = document.querySelector("#legend");
var colorByType = (t) => EDGE_COLORS[t] || "#999";
var colorByKind = ordinal().domain(["module", "program", "subroutine", "function", "interface", "generic", "type", "unknown"]).range(Tableau10_default);
function normType(t) {
  return TYPE_ALIAS.get(t) || t;
}
function nodeKey(d) {
  return d.id;
}
function filterNodes(nodes, q) {
  if (!q) return nodes;
  const t = q.toLowerCase();
  return nodes.filter(
    (n) => (n.id || "").toLowerCase().includes(t) || (n.name || "").toLowerCase().includes(t) || (n.scope || "").toLowerCase().includes(t) || (n.kind || "").toLowerCase().includes(t)
  );
}
function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map((n) => [n.id, { ...n }]));
  let types;
  if (edgeType === "all") {
    types = [...activeTypes];
  } else {
    types = [edgeType];
  }
  const uniq = /* @__PURE__ */ new Set();
  const links = [];
  for (const l of deps.links) {
    const t = normType(l.type);
    if (!types.includes(t)) continue;
    const sId = typeof l.source === "string" ? l.source : l.source?.id;
    const tId = typeof l.target === "string" ? l.target : l.target?.id;
    if (!nodesById.has(sId) || !nodesById.has(tId)) continue;
    const key = `${sId}	${tId}	${t}`;
    if (uniq.has(key)) continue;
    uniq.add(key);
    links.push({ source: nodesById.get(sId), target: nodesById.get(tId), etype: t });
  }
  const keep = new Set(filterNodes([...nodesById.values()], query).map((n) => n.id));
  const filtered = links.filter((l) => keep.has(l.source.id) || keep.has(l.target.id));
  const used = /* @__PURE__ */ new Set();
  for (const l of filtered) {
    used.add(l.source.id);
    used.add(l.target.id);
  }
  const nodes = [...used].map((id2) => nodesById.get(id2));
  const deg = new Map([...used].map((id2) => [id2, 0]));
  for (const l of filtered) {
    deg.set(l.source.id, (deg.get(l.source.id) || 0) + 1);
    deg.set(l.target.id, (deg.get(l.target.id) || 0) + 1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;
  return { nodes, links: filtered };
}
function renderLegend() {
  legendEl.innerHTML = "";
  const inAllMode = edgeTypeSel.value === "all";
  for (const t of EDGE_TYPES) {
    const row = document.createElement("div");
    row.className = "row";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = activeTypes.has(t);
    cb.disabled = !inAllMode;
    cb.addEventListener("change", () => {
      if (cb.checked) activeTypes.add(t);
      else activeTypes.delete(t);
      run(edgeTypeSel.value, filterInput.value);
    });
    const label = document.createElement("label");
    if (!inAllMode) label.classList.add("disabled");
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = EDGE_COLORS[t];
    label.appendChild(swatch);
    label.appendChild(document.createTextNode(t));
    row.appendChild(cb);
    row.appendChild(label);
    legendEl.appendChild(row);
  }
}
var markerBase = { width: 10, height: 10, refX: 12 };
function ensureMarkers() {
  gDefs.selectAll("marker").remove();
  for (const t of EDGE_TYPES) {
    gDefs.append("marker").attr("id", `arrow-${t}`).attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 -4 8 8").attr("refX", markerBase.refX).attr("refY", 0).attr("markerWidth", markerBase.width).attr("markerHeight", markerBase.height).attr("orient", "auto").append("path").attr("d", "M0,-4 L8,0 L0,4 Z").attr("fill", EDGE_COLORS[t]);
  }
}
function resizeMarkersForZoom(k) {
  const w = markerBase.width / k;
  const h = markerBase.height / k;
  const rx = markerBase.refX / k;
  for (const t of EDGE_TYPES) {
    const m2 = gDefs.select(`#arrow-${t}`);
    m2.attr("markerWidth", w).attr("markerHeight", h).attr("refX", rx);
  }
}
var zoom = zoom_default2().on("zoom", (ev) => {
  gMain.attr("transform", ev.transform);
  resizeMarkersForZoom(ev.transform.k);
});
svg.call(zoom);
function run(edgeType = "all", query = "") {
  renderLegend();
  ensureMarkers();
  resizeMarkersForZoom(transform(svg.node()).k);
  const { nodes, links } = buildGraph(edgeType, query);
  const sim = simulation_default(nodes).force("charge", manyBody_default().strength((d) => d.kind === "module" ? -220 : -90)).force("link", link_default(links).id(nodeKey).distance((d) => 42 + 2 * Math.min(d.source.degree, d.target.degree)).strength(0.35)).force("collide", collide_default().radius((d) => 4 + Math.sqrt(2 + d.degree)).iterations(2)).force("x", x_default2().strength(0.06)).force("y", y_default2().strength(0.06));
  const linkSel = gLinks.selectAll("line").data(links, (d) => d.source.id + "\u2192" + d.target.id + ":" + d.etype);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line").attr("class", "link").attr("stroke-width", 1.2);
  const link = linkEnter.merge(linkSel).attr("stroke", (d) => colorByType(d.etype)).attr("marker-end", (d) => `url(#arrow-${d.etype})`);
  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle").attr("class", "node").attr("r", (d) => 3 + Math.sqrt(1 + d.degree)).attr("fill", (d) => colorByKind(d.kind)).attr("stroke", "#0b0e12").attr("stroke-width", 0.75).call(
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
  function getNeighborsMap(links2) {
    const nb = /* @__PURE__ */ new Map();
    for (const l of links2) {
      (nb.get(l.source.id) || nb.set(l.source.id, /* @__PURE__ */ new Set()).get(l.source.id)).add(l.target.id);
      (nb.get(l.target.id) || nb.set(l.target.id, /* @__PURE__ */ new Set()).get(l.target.id)).add(l.source.id);
    }
    return nb;
  }
  function maybeHighlight(d) {
    const nb = neighbors.get(d.id) || /* @__PURE__ */ new Set();
    node.classed("highlight", (n) => n.id === d.id || nb.has(n.id)).attr("opacity", (n) => n.id === d.id || nb.has(n.id) ? 1 : 0.2);
    link.classed("highlight", (l) => l.source.id === d.id || l.target.id === d.id).attr("opacity", (l) => l.source.id === d.id || l.target.id === d.id ? 0.9 : 0.12).attr("stroke-width", (l) => l.source.id === d.id || l.target.id === d.id ? 2.2 : 1.2);
    label.attr("opacity", (n) => labelsToggle.checked ? n.id === d.id || nb.has(n.id) ? 1 : 0.05 : 0);
  }
  function clearHighlight() {
    node.classed("highlight", false).attr("opacity", 1);
    link.classed("highlight", false).attr("opacity", 0.28).attr("stroke-width", 1.2);
    label.attr("opacity", labelsToggle.checked ? 1 : 0);
  }
  function showInfo(d, links2) {
    const incoming = links2.filter((l) => l.target.id === d.id);
    const outgoing = links2.filter((l) => l.source.id === d.id);
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
      in_degree: incoming.length,
      out_degree: outgoing.length,
      in_by_type: countByType(incoming),
      out_by_type: countByType(outgoing)
    };
    info.innerHTML = `
      <h1>${d.name || d.id}</h1>
      <div class="muted">${d.kind}${d.scope ? ` \u2014 scope: ${d.scope}` : ""}</div>
      <div style="margin:8px 0">in: <b>${incoming.length}</b> \u2022 out: <b>${outgoing.length}</b></div>
      <pre>${escapeHtml(JSON.stringify(details, null, 2))}</pre>
    `;
  }
  function countByType(arr) {
    const m2 = /* @__PURE__ */ Object.create(null);
    for (const l of arr) m2[l.etype] = (m2[l.etype] || 0) + 1;
    return m2;
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
      const { clientWidth: CW, clientHeight: CH } = svg.node();
      const k = Math.min(CW / vb[2], CH / vb[3]);
      svg.transition().duration(400).call(zoom.transform, identity2.translate(CW / 2, CH / 2).scale(k).translate(-(vb[0] + vb[2] / 2), -(vb[1] + vb[3] / 2))).on("end", () => resizeMarkersForZoom(transform(svg.node()).k));
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL2ludGVybm1hcC9zcmMvaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2QzLWRpc3BhdGNoL3NyYy9kaXNwYXRjaC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jcmVhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvYXJyYXkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9tYXRjaGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0Q2hpbGRyZW4uanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZXhpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vam9pbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29yZGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zb3J0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2Rlcy5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbm9kZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW1wdHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VhY2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvd2luZG93LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zdHlsZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NsYXNzZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3RleHQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JhaXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9sb3dlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbnNlcnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JlbW92ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdHVtLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2l0ZXJhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc291cmNlRXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvcG9pbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9ldmVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9kcmFnLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1kcmFnL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWRyYWcvc3JjL2RyYWcuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9kZWZpbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jb2xvci5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2Jhc2lzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYmFzaXNDbG9zZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvbnVtYmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvc3RyaW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvdHJhbnNmb3JtL2RlY29tcG9zZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9wYXJzZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3pvb20uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRpbWVyL3NyYy90aW1lci5qcyIsICJub2RlX21vZHVsZXMvZDMtdGltZXIvc3JjL3RpbWVvdXQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2NoZWR1bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvc2VsZWN0aW9uL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90d2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbnRlcnBvbGF0ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9hdHRyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2F0dHJUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kZWxheS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kdXJhdGlvbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9lYXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2Vhc2VWYXJ5aW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9tZXJnZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9yZW1vdmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2VsZWN0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9zZWxlY3Rpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGVUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90ZXh0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3RleHRUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2VuZC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtZWFzZS9zcmMvY3ViaWMuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3NlbGVjdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2QzLWJydXNoL3NyYy9icnVzaC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2FkZC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2NvdmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2V4dGVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy9maW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcmVtb3ZlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcm9vdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3NpemUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy92aXNpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3Zpc2l0QWZ0ZXIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy94LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMveS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWR0cmVlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvY29uc3RhbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9qaWdnbGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9jb2xsaWRlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvbGluay5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL2xjZy5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3NpbXVsYXRpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9tYW55Qm9keS5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3guanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy95LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zY2FsZS9zcmMvaW5pdC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2NhbGUvc3JjL29yZGluYWwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNjYWxlLWNocm9tYXRpYy9zcmMvY29sb3JzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zY2FsZS1jaHJvbWF0aWMvc3JjL2NhdGVnb3JpY2FsL1RhYmxlYXUxMC5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvY29uc3RhbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXpvb20vc3JjL2V2ZW50LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy16b29tL3NyYy90cmFuc2Zvcm0uanMiLCAibm9kZV9tb2R1bGVzL2QzLXpvb20vc3JjL25vZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXpvb20vc3JjL3pvb20uanMiLCAiY2xpZW50LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgY2xhc3MgSW50ZXJuTWFwIGV4dGVuZHMgTWFwIHtcbiAgY29uc3RydWN0b3IoZW50cmllcywga2V5ID0ga2V5b2YpIHtcbiAgICBzdXBlcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtfaW50ZXJuOiB7dmFsdWU6IG5ldyBNYXAoKX0sIF9rZXk6IHt2YWx1ZToga2V5fX0pO1xuICAgIGlmIChlbnRyaWVzICE9IG51bGwpIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGVudHJpZXMpIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICB9XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gc3VwZXIuZ2V0KGludGVybl9nZXQodGhpcywga2V5KSk7XG4gIH1cbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCBrZXkpKTtcbiAgfVxuICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5zZXQoaW50ZXJuX3NldCh0aGlzLCBrZXkpLCB2YWx1ZSk7XG4gIH1cbiAgZGVsZXRlKGtleSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCBrZXkpKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJuU2V0IGV4dGVuZHMgU2V0IHtcbiAgY29uc3RydWN0b3IodmFsdWVzLCBrZXkgPSBrZXlvZikge1xuICAgIHN1cGVyKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge19pbnRlcm46IHt2YWx1ZTogbmV3IE1hcCgpfSwgX2tleToge3ZhbHVlOiBrZXl9fSk7XG4gICAgaWYgKHZhbHVlcyAhPSBudWxsKSBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykgdGhpcy5hZGQodmFsdWUpO1xuICB9XG4gIGhhcyh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5oYXMoaW50ZXJuX2dldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGFkZCh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5hZGQoaW50ZXJuX3NldCh0aGlzLCB2YWx1ZSkpO1xuICB9XG4gIGRlbGV0ZSh2YWx1ZSkge1xuICAgIHJldHVybiBzdXBlci5kZWxldGUoaW50ZXJuX2RlbGV0ZSh0aGlzLCB2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGludGVybl9nZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgcmV0dXJuIF9pbnRlcm4uaGFzKGtleSkgPyBfaW50ZXJuLmdldChrZXkpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVybl9zZXQoe19pbnRlcm4sIF9rZXl9LCB2YWx1ZSkge1xuICBjb25zdCBrZXkgPSBfa2V5KHZhbHVlKTtcbiAgaWYgKF9pbnRlcm4uaGFzKGtleSkpIHJldHVybiBfaW50ZXJuLmdldChrZXkpO1xuICBfaW50ZXJuLnNldChrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpbnRlcm5fZGVsZXRlKHtfaW50ZXJuLCBfa2V5fSwgdmFsdWUpIHtcbiAgY29uc3Qga2V5ID0gX2tleSh2YWx1ZSk7XG4gIGlmIChfaW50ZXJuLmhhcyhrZXkpKSB7XG4gICAgdmFsdWUgPSBfaW50ZXJuLmdldChrZXkpO1xuICAgIF9pbnRlcm4uZGVsZXRlKGtleSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBrZXlvZih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG59XG4iLCAidmFyIG5vb3AgPSB7dmFsdWU6ICgpID0+IHt9fTtcblxuZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gYXJndW1lbnRzLmxlbmd0aCwgXyA9IHt9LCB0OyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKCEodCA9IGFyZ3VtZW50c1tpXSArIFwiXCIpIHx8ICh0IGluIF8pIHx8IC9bXFxzLl0vLnRlc3QodCkpIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgdHlwZTogXCIgKyB0KTtcbiAgICBfW3RdID0gW107XG4gIH1cbiAgcmV0dXJuIG5ldyBEaXNwYXRjaChfKTtcbn1cblxuZnVuY3Rpb24gRGlzcGF0Y2goXykge1xuICB0aGlzLl8gPSBfO1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMsIHR5cGVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICBpZiAodCAmJiAhdHlwZXMuaGFzT3duUHJvcGVydHkodCkpIHRocm93IG5ldyBFcnJvcihcInVua25vd24gdHlwZTogXCIgKyB0KTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuRGlzcGF0Y2gucHJvdG90eXBlID0gZGlzcGF0Y2gucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogRGlzcGF0Y2gsXG4gIG9uOiBmdW5jdGlvbih0eXBlbmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgXyA9IHRoaXMuXyxcbiAgICAgICAgVCA9IHBhcnNlVHlwZW5hbWVzKHR5cGVuYW1lICsgXCJcIiwgXyksXG4gICAgICAgIHQsXG4gICAgICAgIGkgPSAtMSxcbiAgICAgICAgbiA9IFQubGVuZ3RoO1xuXG4gICAgLy8gSWYgbm8gY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBjYWxsYmFjayBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSAmJiAodCA9IGdldChfW3RdLCB0eXBlbmFtZS5uYW1lKSkpIHJldHVybiB0O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIGEgdHlwZSB3YXMgc3BlY2lmaWVkLCBzZXQgdGhlIGNhbGxiYWNrIGZvciB0aGUgZ2l2ZW4gdHlwZSBhbmQgbmFtZS5cbiAgICAvLyBPdGhlcndpc2UsIGlmIGEgbnVsbCBjYWxsYmFjayB3YXMgc3BlY2lmaWVkLCByZW1vdmUgY2FsbGJhY2tzIG9mIHRoZSBnaXZlbiBuYW1lLlxuICAgIGlmIChjYWxsYmFjayAhPSBudWxsICYmIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGNhbGxiYWNrOiBcIiArIGNhbGxiYWNrKTtcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgaWYgKHQgPSAodHlwZW5hbWUgPSBUW2ldKS50eXBlKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIGNhbGxiYWNrKTtcbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09IG51bGwpIGZvciAodCBpbiBfKSBfW3RdID0gc2V0KF9bdF0sIHR5cGVuYW1lLm5hbWUsIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjb3B5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29weSA9IHt9LCBfID0gdGhpcy5fO1xuICAgIGZvciAodmFyIHQgaW4gXykgY29weVt0XSA9IF9bdF0uc2xpY2UoKTtcbiAgICByZXR1cm4gbmV3IERpc3BhdGNoKGNvcHkpO1xuICB9LFxuICBjYWxsOiBmdW5jdGlvbih0eXBlLCB0aGF0KSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCAtIDIpID4gMCkgZm9yICh2YXIgYXJncyA9IG5ldyBBcnJheShuKSwgaSA9IDAsIG4sIHQ7IGkgPCBuOyArK2kpIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh0ID0gdGhpcy5fW3R5cGVdLCBpID0gMCwgbiA9IHQubGVuZ3RoOyBpIDwgbjsgKytpKSB0W2ldLnZhbHVlLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24odHlwZSwgdGhhdCwgYXJncykge1xuICAgIGlmICghdGhpcy5fLmhhc093blByb3BlcnR5KHR5cGUpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdHlwZSk7XG4gICAgZm9yICh2YXIgdCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0KHR5cGUsIG5hbWUpIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aCwgYzsgaSA8IG47ICsraSkge1xuICAgIGlmICgoYyA9IHR5cGVbaV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHJldHVybiBjLnZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBzZXQodHlwZSwgbmFtZSwgY2FsbGJhY2spIHtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0eXBlLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgIGlmICh0eXBlW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHR5cGVbaV0gPSBub29wLCB0eXBlID0gdHlwZS5zbGljZSgwLCBpKS5jb25jYXQodHlwZS5zbGljZShpICsgMSkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChjYWxsYmFjayAhPSBudWxsKSB0eXBlLnB1c2goe25hbWU6IG5hbWUsIHZhbHVlOiBjYWxsYmFja30pO1xuICByZXR1cm4gdHlwZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGF0Y2g7XG4iLCAiZXhwb3J0IHZhciB4aHRtbCA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuIiwgImltcG9ydCBuYW1lc3BhY2VzIGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgcHJlZml4ID0gbmFtZSArPSBcIlwiLCBpID0gcHJlZml4LmluZGV4T2YoXCI6XCIpO1xuICBpZiAoaSA+PSAwICYmIChwcmVmaXggPSBuYW1lLnNsaWNlKDAsIGkpKSAhPT0gXCJ4bWxuc1wiKSBuYW1lID0gbmFtZS5zbGljZShpICsgMSk7XG4gIHJldHVybiBuYW1lc3BhY2VzLmhhc093blByb3BlcnR5KHByZWZpeCkgPyB7c3BhY2U6IG5hbWVzcGFjZXNbcHJlZml4XSwgbG9jYWw6IG5hbWV9IDogbmFtZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuL25hbWVzcGFjZS5qc1wiO1xuaW1wb3J0IHt4aHRtbH0gZnJvbSBcIi4vbmFtZXNwYWNlcy5qc1wiO1xuXG5mdW5jdGlvbiBjcmVhdG9ySW5oZXJpdChuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLm93bmVyRG9jdW1lbnQsXG4gICAgICAgIHVyaSA9IHRoaXMubmFtZXNwYWNlVVJJO1xuICAgIHJldHVybiB1cmkgPT09IHhodG1sICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5uYW1lc3BhY2VVUkkgPT09IHhodG1sXG4gICAgICAgID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh1cmksIG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yRml4ZWQoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIG5vbmUoKSB7fVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IG5vbmUgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiLy8gR2l2ZW4gc29tZXRoaW5nIGFycmF5IGxpa2UgKG9yIG51bGwpLCByZXR1cm5zIHNvbWV0aGluZyB0aGF0IGlzIHN0cmljdGx5IGFuXG4vLyBhcnJheS4gVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0IGFycmF5LWxpa2Ugb2JqZWN0cyBwYXNzZWQgdG8gZDMuc2VsZWN0QWxsXG4vLyBvciBzZWxlY3Rpb24uc2VsZWN0QWxsIGFyZSBjb252ZXJ0ZWQgaW50byBwcm9wZXIgYXJyYXlzIHdoZW4gY3JlYXRpbmcgYVxuLy8gc2VsZWN0aW9uOyB3ZSBkb25cdTIwMTl0IGV2ZXIgd2FudCB0byBjcmVhdGUgYSBzZWxlY3Rpb24gYmFja2VkIGJ5IGEgbGl2ZVxuLy8gSFRNTENvbGxlY3Rpb24gb3IgTm9kZUxpc3QuIEhvd2V2ZXIsIG5vdGUgdGhhdCBzZWxlY3Rpb24uc2VsZWN0QWxsIHdpbGwgdXNlIGFcbi8vIHN0YXRpYyBOb2RlTGlzdCBhcyBhIGdyb3VwLCBzaW5jZSBpdCBzYWZlbHkgZGVyaXZlZCBmcm9tIHF1ZXJ5U2VsZWN0b3JBbGwuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcnJheSh4KSB7XG4gIHJldHVybiB4ID09IG51bGwgPyBbXSA6IEFycmF5LmlzQXJyYXkoeCkgPyB4IDogQXJyYXkuZnJvbSh4KTtcbn1cbiIsICJmdW5jdGlvbiBlbXB0eSgpIHtcbiAgcmV0dXJuIFtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPT0gbnVsbCA/IGVtcHR5IDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgYXJyYXkgZnJvbSBcIi4uL2FycmF5LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3JBbGwgZnJvbSBcIi4uL3NlbGVjdG9yQWxsLmpzXCI7XG5cbmZ1bmN0aW9uIGFycmF5QWxsKHNlbGVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFycmF5KHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ID09PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IGFycmF5QWxsKHNlbGVjdCk7XG4gIGVsc2Ugc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZE1hdGNoZXIoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmluZCA9IEFycmF5LnByb3RvdHlwZS5maW5kO1xuXG5mdW5jdGlvbiBjaGlsZEZpbmQobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaW5kLmNhbGwodGhpcy5jaGlsZHJlbiwgbWF0Y2gpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjaGlsZEZpcnN0KCkge1xuICByZXR1cm4gdGhpcy5maXJzdEVsZW1lbnRDaGlsZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KG1hdGNoID09IG51bGwgPyBjaGlsZEZpcnN0XG4gICAgICA6IGNoaWxkRmluZCh0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7Y2hpbGRNYXRjaGVyfSBmcm9tIFwiLi4vbWF0Y2hlci5qc1wiO1xuXG52YXIgZmlsdGVyID0gQXJyYXkucHJvdG90eXBlLmZpbHRlcjtcblxuZnVuY3Rpb24gY2hpbGRyZW4oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pO1xufVxuXG5mdW5jdGlvbiBjaGlsZHJlbkZpbHRlcihtYXRjaCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZpbHRlci5jYWxsKHRoaXMuY2hpbGRyZW4sIG1hdGNoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKG1hdGNoID09IG51bGwgPyBjaGlsZHJlblxuICAgICAgOiBjaGlsZHJlbkZpbHRlcih0eXBlb2YgbWF0Y2ggPT09IFwiZnVuY3Rpb25cIiA/IG1hdGNoIDogY2hpbGRNYXRjaGVyKG1hdGNoKSkpO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IG1hdGNoZXIgZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odXBkYXRlKSB7XG4gIHJldHVybiBuZXcgQXJyYXkodXBkYXRlLmxlbmd0aCk7XG59XG4iLCAiaW1wb3J0IHNwYXJzZSBmcm9tIFwiLi9zcGFyc2UuanNcIjtcbmltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZW50ZXIgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVudGVyTm9kZShwYXJlbnQsIGRhdHVtKSB7XG4gIHRoaXMub3duZXJEb2N1bWVudCA9IHBhcmVudC5vd25lckRvY3VtZW50O1xuICB0aGlzLm5hbWVzcGFjZVVSSSA9IHBhcmVudC5uYW1lc3BhY2VVUkk7XG4gIHRoaXMuX25leHQgPSBudWxsO1xuICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuX19kYXRhX18gPSBkYXR1bTtcbn1cblxuRW50ZXJOb2RlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEVudGVyTm9kZSxcbiAgYXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiB0aGlzLl9wYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkLCB0aGlzLl9uZXh0KTsgfSxcbiAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbihjaGlsZCwgbmV4dCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgbmV4dCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7IHJldHVybiB0aGlzLl9wYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7IH1cbn07XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHg7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQge0VudGVyTm9kZX0gZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9uXHUyMDE5dCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSBuZXcgTWFwLFxuICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICBrZXlWYWx1ZXMgPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpLFxuICAgICAga2V5VmFsdWU7XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIG5vZGUuXG4gIC8vIElmIG11bHRpcGxlIG5vZGVzIGhhdmUgdGhlIHNhbWUga2V5LCB0aGUgZHVwbGljYXRlcyBhcmUgYWRkZWQgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBrZXlWYWx1ZXNbaV0gPSBrZXlWYWx1ZSA9IGtleS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSArIFwiXCI7XG4gICAgICBpZiAobm9kZUJ5S2V5VmFsdWUuaGFzKGtleVZhbHVlKSkge1xuICAgICAgICBleGl0W2ldID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVCeUtleVZhbHVlLnNldChrZXlWYWx1ZSwgbm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tcHV0ZSB0aGUga2V5IGZvciBlYWNoIGRhdHVtLlxuICAvLyBJZiB0aGVyZSBhIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LCBqb2luIGFuZCBhZGQgaXQgdG8gdXBkYXRlLlxuICAvLyBJZiB0aGVyZSBpcyBub3QgKG9yIHRoZSBrZXkgaXMgYSBkdXBsaWNhdGUpLCBhZGQgaXQgdG8gZW50ZXIuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhTGVuZ3RoOyArK2kpIHtcbiAgICBrZXlWYWx1ZSA9IGtleS5jYWxsKHBhcmVudCwgZGF0YVtpXSwgaSwgZGF0YSkgKyBcIlwiO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlKSkge1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgbm9kZUJ5S2V5VmFsdWUuZGVsZXRlKGtleVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQWRkIGFueSByZW1haW5pbmcgbm9kZXMgdGhhdCB3ZXJlIG5vdCBib3VuZCB0byBkYXRhIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChub2RlQnlLZXlWYWx1ZS5nZXQoa2V5VmFsdWVzW2ldKSA9PT0gbm9kZSkpIHtcbiAgICAgIGV4aXRbaV0gPSBub2RlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkYXR1bShub2RlKSB7XG4gIHJldHVybiBub2RlLl9fZGF0YV9fO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIEFycmF5LmZyb20odGhpcywgZGF0dW0pO1xuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IGFycmF5bGlrZSh2YWx1ZS5jYWxsKHBhcmVudCwgcGFyZW50ICYmIHBhcmVudC5fX2RhdGFfXywgaiwgcGFyZW50cykpLFxuICAgICAgICBkYXRhTGVuZ3RoID0gZGF0YS5sZW5ndGgsXG4gICAgICAgIGVudGVyR3JvdXAgPSBlbnRlcltqXSA9IG5ldyBBcnJheShkYXRhTGVuZ3RoKSxcbiAgICAgICAgdXBkYXRlR3JvdXAgPSB1cGRhdGVbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIGV4aXRHcm91cCA9IGV4aXRbal0gPSBuZXcgQXJyYXkoZ3JvdXBMZW5ndGgpO1xuXG4gICAgYmluZChwYXJlbnQsIGdyb3VwLCBlbnRlckdyb3VwLCB1cGRhdGVHcm91cCwgZXhpdEdyb3VwLCBkYXRhLCBrZXkpO1xuXG4gICAgLy8gTm93IGNvbm5lY3QgdGhlIGVudGVyIG5vZGVzIHRvIHRoZWlyIGZvbGxvd2luZyB1cGRhdGUgbm9kZSwgc3VjaCB0aGF0XG4gICAgLy8gYXBwZW5kQ2hpbGQgY2FuIGluc2VydCB0aGUgbWF0ZXJpYWxpemVkIGVudGVyIG5vZGUgYmVmb3JlIHRoaXMgbm9kZSxcbiAgICAvLyByYXRoZXIgdGhhbiBhdCB0aGUgZW5kIG9mIHRoZSBwYXJlbnQgbm9kZS5cbiAgICBmb3IgKHZhciBpMCA9IDAsIGkxID0gMCwgcHJldmlvdXMsIG5leHQ7IGkwIDwgZGF0YUxlbmd0aDsgKytpMCkge1xuICAgICAgaWYgKHByZXZpb3VzID0gZW50ZXJHcm91cFtpMF0pIHtcbiAgICAgICAgaWYgKGkwID49IGkxKSBpMSA9IGkwICsgMTtcbiAgICAgICAgd2hpbGUgKCEobmV4dCA9IHVwZGF0ZUdyb3VwW2kxXSkgJiYgKytpMSA8IGRhdGFMZW5ndGgpO1xuICAgICAgICBwcmV2aW91cy5fbmV4dCA9IG5leHQgfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUgPSBuZXcgU2VsZWN0aW9uKHVwZGF0ZSwgcGFyZW50cyk7XG4gIHVwZGF0ZS5fZW50ZXIgPSBlbnRlcjtcbiAgdXBkYXRlLl9leGl0ID0gZXhpdDtcbiAgcmV0dXJuIHVwZGF0ZTtcbn1cblxuLy8gR2l2ZW4gc29tZSBkYXRhLCB0aGlzIHJldHVybnMgYW4gYXJyYXktbGlrZSB2aWV3IG9mIGl0OiBhbiBvYmplY3QgdGhhdFxuLy8gZXhwb3NlcyBhIGxlbmd0aCBwcm9wZXJ0eSBhbmQgYWxsb3dzIG51bWVyaWMgaW5kZXhpbmcuIE5vdGUgdGhhdCB1bmxpa2Vcbi8vIHNlbGVjdEFsbCwgdGhpcyBpc25cdTIwMTl0IHdvcnJpZWQgYWJvdXQgXHUyMDFDbGl2ZVx1MjAxRCBjb2xsZWN0aW9ucyBiZWNhdXNlIHRoZSByZXN1bHRpbmdcbi8vIGFycmF5IHdpbGwgb25seSBiZSB1c2VkIGJyaWVmbHkgd2hpbGUgZGF0YSBpcyBiZWluZyBib3VuZC4gKEl0IGlzIHBvc3NpYmxlIHRvXG4vLyBjYXVzZSB0aGUgZGF0YSB0byBjaGFuZ2Ugd2hpbGUgaXRlcmF0aW5nIGJ5IHVzaW5nIGEga2V5IGZ1bmN0aW9uLCBidXQgcGxlYXNlXG4vLyBkb25cdTIwMTl0OyB3ZVx1MjAxOWQgcmF0aGVyIGF2b2lkIGEgZ3JhdHVpdG91cyBjb3B5LilcbmZ1bmN0aW9uIGFycmF5bGlrZShkYXRhKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBcImxlbmd0aFwiIGluIGRhdGFcbiAgICA/IGRhdGEgLy8gQXJyYXksIFR5cGVkQXJyYXksIE5vZGVMaXN0LCBhcnJheS1saWtlXG4gICAgOiBBcnJheS5mcm9tKGRhdGEpOyAvLyBNYXAsIFNldCwgaXRlcmFibGUsIHN0cmluZywgb3IgYW55dGhpbmcgZWxzZVxufVxuIiwgImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2V4aXQgfHwgdGhpcy5fZ3JvdXBzLm1hcChzcGFyc2UpLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvbmVudGVyLCBvbnVwZGF0ZSwgb25leGl0KSB7XG4gIHZhciBlbnRlciA9IHRoaXMuZW50ZXIoKSwgdXBkYXRlID0gdGhpcywgZXhpdCA9IHRoaXMuZXhpdCgpO1xuICBpZiAodHlwZW9mIG9uZW50ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGVudGVyID0gb25lbnRlcihlbnRlcik7XG4gICAgaWYgKGVudGVyKSBlbnRlciA9IGVudGVyLnNlbGVjdGlvbigpO1xuICB9IGVsc2Uge1xuICAgIGVudGVyID0gZW50ZXIuYXBwZW5kKG9uZW50ZXIgKyBcIlwiKTtcbiAgfVxuICBpZiAob251cGRhdGUgIT0gbnVsbCkge1xuICAgIHVwZGF0ZSA9IG9udXBkYXRlKHVwZGF0ZSk7XG4gICAgaWYgKHVwZGF0ZSkgdXBkYXRlID0gdXBkYXRlLnNlbGVjdGlvbigpO1xuICB9XG4gIGlmIChvbmV4aXQgPT0gbnVsbCkgZXhpdC5yZW1vdmUoKTsgZWxzZSBvbmV4aXQoZXhpdCk7XG4gIHJldHVybiBlbnRlciAmJiB1cGRhdGUgPyBlbnRlci5tZXJnZSh1cGRhdGUpLm9yZGVyKCkgOiB1cGRhdGU7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgdmFyIHNlbGVjdGlvbiA9IGNvbnRleHQuc2VsZWN0aW9uID8gY29udGV4dC5zZWxlY3Rpb24oKSA6IGNvbnRleHQ7XG5cbiAgZm9yICh2YXIgZ3JvdXBzMCA9IHRoaXMuX2dyb3VwcywgZ3JvdXBzMSA9IHNlbGVjdGlvbi5fZ3JvdXBzLCBtMCA9IGdyb3VwczAubGVuZ3RoLCBtMSA9IGdyb3VwczEubGVuZ3RoLCBtID0gTWF0aC5taW4obTAsIG0xKSwgbWVyZ2VzID0gbmV3IEFycmF5KG0wKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cDAgPSBncm91cHMwW2pdLCBncm91cDEgPSBncm91cHMxW2pdLCBuID0gZ3JvdXAwLmxlbmd0aCwgbWVyZ2UgPSBtZXJnZXNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwMFtpXSB8fCBncm91cDFbaV0pIHtcbiAgICAgICAgbWVyZ2VbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBqIDwgbTA7ICsraikge1xuICAgIG1lcmdlc1tqXSA9IGdyb3VwczBbal07XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihtZXJnZXMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IC0xLCBtID0gZ3JvdXBzLmxlbmd0aDsgKytqIDwgbTspIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IGdyb3VwLmxlbmd0aCAtIDEsIG5leHQgPSBncm91cFtpXSwgbm9kZTsgLS1pID49IDA7KSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIGlmIChuZXh0ICYmIG5vZGUuY29tcGFyZURvY3VtZW50UG9zaXRpb24obmV4dCkgXiA0KSBuZXh0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG5vZGUsIG5leHQpO1xuICAgICAgICBuZXh0ID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29tcGFyZSkge1xuICBpZiAoIWNvbXBhcmUpIGNvbXBhcmUgPSBhc2NlbmRpbmc7XG5cbiAgZnVuY3Rpb24gY29tcGFyZU5vZGUoYSwgYikge1xuICAgIHJldHVybiBhICYmIGIgPyBjb21wYXJlKGEuX19kYXRhX18sIGIuX19kYXRhX18pIDogIWEgLSAhYjtcbiAgfVxuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHNvcnRncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHNvcnRncm91cCA9IHNvcnRncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHNvcnRncm91cFtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRncm91cC5zb3J0KGNvbXBhcmVOb2RlKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHNvcnRncm91cHMsIHRoaXMuX3BhcmVudHMpLm9yZGVyKCk7XG59XG5cbmZ1bmN0aW9uIGFzY2VuZGluZyhhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzBdO1xuICBhcmd1bWVudHNbMF0gPSB0aGlzO1xuICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20odGhpcyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGxldCBzaXplID0gMDtcbiAgZm9yIChjb25zdCBub2RlIG9mIHRoaXMpICsrc2l6ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaykge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSBjYWxsYmFjay5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgbmFtZXNwYWNlIGZyb20gXCIuLi9uYW1lc3BhY2UuanNcIjtcblxuZnVuY3Rpb24gYXR0clJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clJlbW92ZU5TKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnROUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2YWx1ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKGZ1bGxuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCB2KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBub2RlID0gdGhpcy5ub2RlKCk7XG4gICAgcmV0dXJuIGZ1bGxuYW1lLmxvY2FsXG4gICAgICAgID8gbm9kZS5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpXG4gICAgICAgIDogbm9kZS5nZXRBdHRyaWJ1dGUoZnVsbG5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyUmVtb3ZlTlMgOiBhdHRyUmVtb3ZlKSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyRnVuY3Rpb25OUyA6IGF0dHJGdW5jdGlvbilcbiAgICAgIDogKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKSkoZnVsbG5hbWUsIHZhbHVlKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSkge1xuICByZXR1cm4gKG5vZGUub3duZXJEb2N1bWVudCAmJiBub2RlLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIC8vIG5vZGUgaXMgYSBOb2RlXG4gICAgICB8fCAobm9kZS5kb2N1bWVudCAmJiBub2RlKSAvLyBub2RlIGlzIGEgV2luZG93XG4gICAgICB8fCBub2RlLmRlZmF1bHRWaWV3OyAvLyBub2RlIGlzIGEgRG9jdW1lbnRcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICAgID8gc3R5bGVSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgPyBzdHlsZUZ1bmN0aW9uXG4gICAgICAgICAgICA6IHN0eWxlQ29uc3RhbnQpKG5hbWUsIHZhbHVlLCBwcmlvcml0eSA9PSBudWxsID8gXCJcIiA6IHByaW9yaXR5KSlcbiAgICAgIDogc3R5bGVWYWx1ZSh0aGlzLm5vZGUoKSwgbmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHlsZVZhbHVlKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKVxuICAgICAgfHwgZGVmYXVsdFZpZXcobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuIiwgImZ1bmN0aW9uIHByb3BlcnR5UmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGRlbGV0ZSB0aGlzW25hbWVdO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUNvbnN0YW50KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5RnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSBkZWxldGUgdGhpc1tuYW1lXTtcbiAgICBlbHNlIHRoaXNbbmFtZV0gPSB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBwcm9wZXJ0eVJlbW92ZSA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBwcm9wZXJ0eUZ1bmN0aW9uXG4gICAgICAgICAgOiBwcm9wZXJ0eUNvbnN0YW50KShuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpW25hbWVdO1xufVxuIiwgImZ1bmN0aW9uIGNsYXNzQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NMaXN0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0IHx8IG5ldyBDbGFzc0xpc3Qobm9kZSk7XG59XG5cbmZ1bmN0aW9uIENsYXNzTGlzdChub2RlKSB7XG4gIHRoaXMuX25vZGUgPSBub2RlO1xuICB0aGlzLl9uYW1lcyA9IGNsYXNzQXJyYXkobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuQ2xhc3NMaXN0LnByb3RvdHlwZSA9IHtcbiAgYWRkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgdGhpcy5fbmFtZXMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjbGFzc2VkQWRkKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LmFkZChuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRSZW1vdmUobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QucmVtb3ZlKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFRydWUobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRBZGQodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRmFsc2UobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRSZW1vdmUodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24obmFtZXMsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAodmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IGNsYXNzZWRBZGQgOiBjbGFzc2VkUmVtb3ZlKSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBuYW1lcyA9IGNsYXNzQXJyYXkobmFtZSArIFwiXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBsaXN0ID0gY2xhc3NMaXN0KHRoaXMubm9kZSgpKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWxpc3QuY29udGFpbnMobmFtZXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb24gOiB2YWx1ZVxuICAgICAgPyBjbGFzc2VkVHJ1ZVxuICAgICAgOiBjbGFzc2VkRmFsc2UpKG5hbWVzLCB2YWx1ZSkpO1xufVxuIiwgImZ1bmN0aW9uIHRleHRSZW1vdmUoKSB7XG4gIHRoaXMudGV4dENvbnRlbnQgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gdGV4dFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gdGV4dEZ1bmN0aW9uXG4gICAgICAgICAgOiB0ZXh0Q29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkudGV4dENvbnRlbnQ7XG59XG4iLCAiZnVuY3Rpb24gaHRtbFJlbW92ZSgpIHtcbiAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG5mdW5jdGlvbiBodG1sQ29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGh0bWxGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdiA9PSBudWxsID8gXCJcIiA6IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgPyBodG1sUmVtb3ZlIDogKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBodG1sRnVuY3Rpb25cbiAgICAgICAgICA6IGh0bWxDb25zdGFudCkodmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKS5pbm5lckhUTUw7XG59XG4iLCAiZnVuY3Rpb24gcmFpc2UoKSB7XG4gIGlmICh0aGlzLm5leHRTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJhaXNlKTtcbn1cbiIsICJmdW5jdGlvbiBsb3dlcigpIHtcbiAgaWYgKHRoaXMucHJldmlvdXNTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRoaXMsIHRoaXMucGFyZW50Tm9kZS5maXJzdENoaWxkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuIiwgImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IGNyZWF0b3IgZnJvbSBcIi4uL2NyZWF0b3IuanNcIjtcbmltcG9ydCBzZWxlY3RvciBmcm9tIFwiLi4vc2VsZWN0b3IuanNcIjtcblxuZnVuY3Rpb24gY29uc3RhbnROdWxsKCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgYmVmb3JlKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSksXG4gICAgICBzZWxlY3QgPSBiZWZvcmUgPT0gbnVsbCA/IGNvbnN0YW50TnVsbCA6IHR5cGVvZiBiZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IGJlZm9yZSA6IHNlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn1cbiIsICJmdW5jdGlvbiByZW1vdmUoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cbiIsICJmdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZShmYWxzZSksIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgcmV0dXJuIHBhcmVudCA/IHBhcmVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIHRoaXMubmV4dFNpYmxpbmcpIDogY2xvbmU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9jbG9uZURlZXAoKSB7XG4gIHZhciBjbG9uZSA9IHRoaXMuY2xvbmVOb2RlKHRydWUpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkZWVwKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdChkZWVwID8gc2VsZWN0aW9uX2Nsb25lRGVlcCA6IHNlbGVjdGlvbl9jbG9uZVNoYWxsb3cpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMucHJvcGVydHkoXCJfX2RhdGFfX1wiLCB2YWx1ZSlcbiAgICAgIDogdGhpcy5ub2RlKCkuX19kYXRhX187XG59XG4iLCAiZnVuY3Rpb24gY29udGV4dExpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQsIHRoaXMuX19kYXRhX18pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gY29udGV4dExpc3RlbmVyKHZhbHVlKTtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAoKG8gPSBvbltqXSkudHlwZSA9PT0gdHlwZW5hbWUudHlwZSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5vcHRpb25zKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciA9IGxpc3RlbmVyLCBvLm9wdGlvbnMgPSBvcHRpb25zKTtcbiAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0eXBlbmFtZS50eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgbyA9IHt0eXBlOiB0eXBlbmFtZS50eXBlLCBuYW1lOiB0eXBlbmFtZS5uYW1lLCB2YWx1ZTogdmFsdWUsIGxpc3RlbmVyOiBsaXN0ZW5lciwgb3B0aW9uczogb3B0aW9uc307XG4gICAgaWYgKCFvbikgdGhpcy5fX29uID0gW29dO1xuICAgIGVsc2Ugb24ucHVzaChvKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZW5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB0aGlzLmVhY2gob24odHlwZW5hbWVzW2ldLCB2YWx1ZSwgb3B0aW9ucykpO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgZGVmYXVsdFZpZXcgZnJvbSBcIi4uL3dpbmRvdy5qc1wiO1xuXG5mdW5jdGlvbiBkaXNwYXRjaEV2ZW50KG5vZGUsIHR5cGUsIHBhcmFtcykge1xuICB2YXIgd2luZG93ID0gZGVmYXVsdFZpZXcobm9kZSksXG4gICAgICBldmVudCA9IHdpbmRvdy5DdXN0b21FdmVudDtcblxuICBpZiAodHlwZW9mIGV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBldmVudCA9IG5ldyBldmVudCh0eXBlLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgaWYgKHBhcmFtcykgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSksIGV2ZW50LmRldGFpbCA9IHBhcmFtcy5kZXRhaWw7XG4gICAgZWxzZSBldmVudC5pbml0RXZlbnQodHlwZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQ29uc3RhbnQodHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEZ1bmN0aW9uKHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGRpc3BhdGNoRnVuY3Rpb25cbiAgICAgIDogZGlzcGF0Y2hDb25zdGFudCkodHlwZSwgcGFyYW1zKSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qKCkge1xuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgeWllbGQgbm9kZTtcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgc2VsZWN0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3QuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCBmcm9tIFwiLi9zZWxlY3RDaGlsZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbiBmcm9tIFwiLi9zZWxlY3RDaGlsZHJlbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdGEgZnJvbSBcIi4vZGF0YS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbnRlciBmcm9tIFwiLi9lbnRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9leGl0IGZyb20gXCIuL2V4aXQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fam9pbiBmcm9tIFwiLi9qb2luLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29yZGVyIGZyb20gXCIuL29yZGVyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NvcnQgZnJvbSBcIi4vc29ydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jYWxsIGZyb20gXCIuL2NhbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZXMgZnJvbSBcIi4vbm9kZXMuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fbm9kZSBmcm9tIFwiLi9ub2RlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lbXB0eSBmcm9tIFwiLi9lbXB0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9lYWNoIGZyb20gXCIuL2VhY2guanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fYXR0ciBmcm9tIFwiLi9hdHRyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3Byb3BlcnR5IGZyb20gXCIuL3Byb3BlcnR5LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2NsYXNzZWQgZnJvbSBcIi4vY2xhc3NlZC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl90ZXh0IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faHRtbCBmcm9tIFwiLi9odG1sLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3JhaXNlIGZyb20gXCIuL3JhaXNlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2xvd2VyIGZyb20gXCIuL2xvd2VyLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2FwcGVuZCBmcm9tIFwiLi9hcHBlbmQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25faW5zZXJ0IGZyb20gXCIuL2luc2VydC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yZW1vdmUgZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Nsb25lIGZyb20gXCIuL2Nsb25lLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2RhdHVtIGZyb20gXCIuL2RhdHVtLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX29uIGZyb20gXCIuL29uLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2Rpc3BhdGNoIGZyb20gXCIuL2Rpc3BhdGNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2l0ZXJhdG9yIGZyb20gXCIuL2l0ZXJhdG9yLmpzXCI7XG5cbmV4cG9ydCB2YXIgcm9vdCA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFNlbGVjdGlvbihncm91cHMsIHBhcmVudHMpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF1dLCByb290KTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3NlbGVjdGlvbigpIHtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgc2VsZWN0Q2hpbGQ6IHNlbGVjdGlvbl9zZWxlY3RDaGlsZCxcbiAgc2VsZWN0Q2hpbGRyZW46IHNlbGVjdGlvbl9zZWxlY3RDaGlsZHJlbixcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIGpvaW46IHNlbGVjdGlvbl9qb2luLFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBzZWxlY3Rpb246IHNlbGVjdGlvbl9zZWxlY3Rpb24sXG4gIG9yZGVyOiBzZWxlY3Rpb25fb3JkZXIsXG4gIHNvcnQ6IHNlbGVjdGlvbl9zb3J0LFxuICBjYWxsOiBzZWxlY3Rpb25fY2FsbCxcbiAgbm9kZXM6IHNlbGVjdGlvbl9ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX25vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9zaXplLFxuICBlbXB0eTogc2VsZWN0aW9uX2VtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fZWFjaCxcbiAgYXR0cjogc2VsZWN0aW9uX2F0dHIsXG4gIHN0eWxlOiBzZWxlY3Rpb25fc3R5bGUsXG4gIHByb3BlcnR5OiBzZWxlY3Rpb25fcHJvcGVydHksXG4gIGNsYXNzZWQ6IHNlbGVjdGlvbl9jbGFzc2VkLFxuICB0ZXh0OiBzZWxlY3Rpb25fdGV4dCxcbiAgaHRtbDogc2VsZWN0aW9uX2h0bWwsXG4gIHJhaXNlOiBzZWxlY3Rpb25fcmFpc2UsXG4gIGxvd2VyOiBzZWxlY3Rpb25fbG93ZXIsXG4gIGFwcGVuZDogc2VsZWN0aW9uX2FwcGVuZCxcbiAgaW5zZXJ0OiBzZWxlY3Rpb25faW5zZXJ0LFxuICByZW1vdmU6IHNlbGVjdGlvbl9yZW1vdmUsXG4gIGNsb25lOiBzZWxlY3Rpb25fY2xvbmUsXG4gIGRhdHVtOiBzZWxlY3Rpb25fZGF0dW0sXG4gIG9uOiBzZWxlY3Rpb25fb24sXG4gIGRpc3BhdGNoOiBzZWxlY3Rpb25fZGlzcGF0Y2gsXG4gIFtTeW1ib2wuaXRlcmF0b3JdOiBzZWxlY3Rpb25faXRlcmF0b3Jcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbGVjdGlvbjtcbiIsICJpbXBvcnQge1NlbGVjdGlvbiwgcm9vdH0gZnJvbSBcIi4vc2VsZWN0aW9uL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCJcbiAgICAgID8gbmV3IFNlbGVjdGlvbihbW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXV0sIFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdKVxuICAgICAgOiBuZXcgU2VsZWN0aW9uKFtbc2VsZWN0b3JdXSwgcm9vdCk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZXZlbnQpIHtcbiAgbGV0IHNvdXJjZUV2ZW50O1xuICB3aGlsZSAoc291cmNlRXZlbnQgPSBldmVudC5zb3VyY2VFdmVudCkgZXZlbnQgPSBzb3VyY2VFdmVudDtcbiAgcmV0dXJuIGV2ZW50O1xufVxuIiwgImltcG9ydCBzb3VyY2VFdmVudCBmcm9tIFwiLi9zb3VyY2VFdmVudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihldmVudCwgbm9kZSkge1xuICBldmVudCA9IHNvdXJjZUV2ZW50KGV2ZW50KTtcbiAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkgbm9kZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gIGlmIChub2RlKSB7XG4gICAgdmFyIHN2ZyA9IG5vZGUub3duZXJTVkdFbGVtZW50IHx8IG5vZGU7XG4gICAgaWYgKHN2Zy5jcmVhdGVTVkdQb2ludCkge1xuICAgICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgICBwb2ludC54ID0gZXZlbnQuY2xpZW50WCwgcG9pbnQueSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICBwb2ludCA9IHBvaW50Lm1hdHJpeFRyYW5zZm9ybShub2RlLmdldFNjcmVlbkNUTSgpLmludmVyc2UoKSk7XG4gICAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICAgIH1cbiAgICBpZiAobm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgIHZhciByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHJldHVybiBbZXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIG5vZGUuY2xpZW50TGVmdCwgZXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gbm9kZS5jbGllbnRUb3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW2V2ZW50LnBhZ2VYLCBldmVudC5wYWdlWV07XG59XG4iLCAiLy8gVGhlc2UgYXJlIHR5cGljYWxseSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggbm9ldmVudCB0byBlbnN1cmUgdGhhdCB3ZSBjYW5cbi8vIHByZXZlbnREZWZhdWx0IG9uIHRoZSBldmVudC5cbmV4cG9ydCBjb25zdCBub25wYXNzaXZlID0ge3Bhc3NpdmU6IGZhbHNlfTtcbmV4cG9ydCBjb25zdCBub25wYXNzaXZlY2FwdHVyZSA9IHtjYXB0dXJlOiB0cnVlLCBwYXNzaXZlOiBmYWxzZX07XG5cbmV4cG9ydCBmdW5jdGlvbiBub3Byb3BhZ2F0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdH0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IG5vZXZlbnQsIHtub25wYXNzaXZlY2FwdHVyZX0gZnJvbSBcIi4vbm9ldmVudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2aWV3KSB7XG4gIHZhciByb290ID0gdmlldy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBzZWxlY3Rpb24gPSBzZWxlY3Qodmlldykub24oXCJkcmFnc3RhcnQuZHJhZ1wiLCBub2V2ZW50LCBub25wYXNzaXZlY2FwdHVyZSk7XG4gIGlmIChcIm9uc2VsZWN0c3RhcnRcIiBpbiByb290KSB7XG4gICAgc2VsZWN0aW9uLm9uKFwic2VsZWN0c3RhcnQuZHJhZ1wiLCBub2V2ZW50LCBub25wYXNzaXZlY2FwdHVyZSk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fX25vc2VsZWN0ID0gcm9vdC5zdHlsZS5Nb3pVc2VyU2VsZWN0O1xuICAgIHJvb3Quc3R5bGUuTW96VXNlclNlbGVjdCA9IFwibm9uZVwiO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB5ZXNkcmFnKHZpZXcsIG5vY2xpY2spIHtcbiAgdmFyIHJvb3QgPSB2aWV3LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdCh2aWV3KS5vbihcImRyYWdzdGFydC5kcmFnXCIsIG51bGwpO1xuICBpZiAobm9jbGljaykge1xuICAgIHNlbGVjdGlvbi5vbihcImNsaWNrLmRyYWdcIiwgbm9ldmVudCwgbm9ucGFzc2l2ZWNhcHR1cmUpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHNlbGVjdGlvbi5vbihcImNsaWNrLmRyYWdcIiwgbnVsbCk7IH0sIDApO1xuICB9XG4gIGlmIChcIm9uc2VsZWN0c3RhcnRcIiBpbiByb290KSB7XG4gICAgc2VsZWN0aW9uLm9uKFwic2VsZWN0c3RhcnQuZHJhZ1wiLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICByb290LnN0eWxlLk1velVzZXJTZWxlY3QgPSByb290Ll9fbm9zZWxlY3Q7XG4gICAgZGVsZXRlIHJvb3QuX19ub3NlbGVjdDtcbiAgfVxufVxuIiwgImV4cG9ydCBkZWZhdWx0IHggPT4gKCkgPT4geDtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEcmFnRXZlbnQodHlwZSwge1xuICBzb3VyY2VFdmVudCxcbiAgc3ViamVjdCxcbiAgdGFyZ2V0LFxuICBpZGVudGlmaWVyLFxuICBhY3RpdmUsXG4gIHgsIHksIGR4LCBkeSxcbiAgZGlzcGF0Y2hcbn0pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgIHR5cGU6IHt2YWx1ZTogdHlwZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBzb3VyY2VFdmVudDoge3ZhbHVlOiBzb3VyY2VFdmVudCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBzdWJqZWN0OiB7dmFsdWU6IHN1YmplY3QsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgdGFyZ2V0OiB7dmFsdWU6IHRhcmdldCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBpZGVudGlmaWVyOiB7dmFsdWU6IGlkZW50aWZpZXIsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgYWN0aXZlOiB7dmFsdWU6IGFjdGl2ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB4OiB7dmFsdWU6IHgsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgeToge3ZhbHVlOiB5LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIGR4OiB7dmFsdWU6IGR4LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIGR5OiB7dmFsdWU6IGR5LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIF86IHt2YWx1ZTogZGlzcGF0Y2h9XG4gIH0pO1xufVxuXG5EcmFnRXZlbnQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciB2YWx1ZSA9IHRoaXMuXy5vbi5hcHBseSh0aGlzLl8sIGFyZ3VtZW50cyk7XG4gIHJldHVybiB2YWx1ZSA9PT0gdGhpcy5fID8gdGhpcyA6IHZhbHVlO1xufTtcbiIsICJpbXBvcnQge2Rpc3BhdGNofSBmcm9tIFwiZDMtZGlzcGF0Y2hcIjtcbmltcG9ydCB7c2VsZWN0LCBwb2ludGVyfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQgbm9kcmFnLCB7eWVzZHJhZ30gZnJvbSBcIi4vbm9kcmFnLmpzXCI7XG5pbXBvcnQgbm9ldmVudCwge25vbnBhc3NpdmUsIG5vbnBhc3NpdmVjYXB0dXJlLCBub3Byb3BhZ2F0aW9ufSBmcm9tIFwiLi9ub2V2ZW50LmpzXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBEcmFnRXZlbnQgZnJvbSBcIi4vZXZlbnQuanNcIjtcblxuLy8gSWdub3JlIHJpZ2h0LWNsaWNrLCBzaW5jZSB0aGF0IHNob3VsZCBvcGVuIHRoZSBjb250ZXh0IG1lbnUuXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyKGV2ZW50KSB7XG4gIHJldHVybiAhZXZlbnQuY3RybEtleSAmJiAhZXZlbnQuYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29udGFpbmVyKCkge1xuICByZXR1cm4gdGhpcy5wYXJlbnROb2RlO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0U3ViamVjdChldmVudCwgZCkge1xuICByZXR1cm4gZCA9PSBudWxsID8ge3g6IGV2ZW50LngsIHk6IGV2ZW50Lnl9IDogZDtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRvdWNoYWJsZSgpIHtcbiAgcmV0dXJuIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyB8fCAoXCJvbnRvdWNoc3RhcnRcIiBpbiB0aGlzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBmaWx0ZXIgPSBkZWZhdWx0RmlsdGVyLFxuICAgICAgY29udGFpbmVyID0gZGVmYXVsdENvbnRhaW5lcixcbiAgICAgIHN1YmplY3QgPSBkZWZhdWx0U3ViamVjdCxcbiAgICAgIHRvdWNoYWJsZSA9IGRlZmF1bHRUb3VjaGFibGUsXG4gICAgICBnZXN0dXJlcyA9IHt9LFxuICAgICAgbGlzdGVuZXJzID0gZGlzcGF0Y2goXCJzdGFydFwiLCBcImRyYWdcIiwgXCJlbmRcIiksXG4gICAgICBhY3RpdmUgPSAwLFxuICAgICAgbW91c2Vkb3dueCxcbiAgICAgIG1vdXNlZG93bnksXG4gICAgICBtb3VzZW1vdmluZyxcbiAgICAgIHRvdWNoZW5kaW5nLFxuICAgICAgY2xpY2tEaXN0YW5jZTIgPSAwO1xuXG4gIGZ1bmN0aW9uIGRyYWcoc2VsZWN0aW9uKSB7XG4gICAgc2VsZWN0aW9uXG4gICAgICAgIC5vbihcIm1vdXNlZG93bi5kcmFnXCIsIG1vdXNlZG93bmVkKVxuICAgICAgLmZpbHRlcih0b3VjaGFibGUpXG4gICAgICAgIC5vbihcInRvdWNoc3RhcnQuZHJhZ1wiLCB0b3VjaHN0YXJ0ZWQpXG4gICAgICAgIC5vbihcInRvdWNobW92ZS5kcmFnXCIsIHRvdWNobW92ZWQsIG5vbnBhc3NpdmUpXG4gICAgICAgIC5vbihcInRvdWNoZW5kLmRyYWcgdG91Y2hjYW5jZWwuZHJhZ1wiLCB0b3VjaGVuZGVkKVxuICAgICAgICAuc3R5bGUoXCJ0b3VjaC1hY3Rpb25cIiwgXCJub25lXCIpXG4gICAgICAgIC5zdHlsZShcIi13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvclwiLCBcInJnYmEoMCwwLDAsMClcIik7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZWRvd25lZChldmVudCwgZCkge1xuICAgIGlmICh0b3VjaGVuZGluZyB8fCAhZmlsdGVyLmNhbGwodGhpcywgZXZlbnQsIGQpKSByZXR1cm47XG4gICAgdmFyIGdlc3R1cmUgPSBiZWZvcmVzdGFydCh0aGlzLCBjb250YWluZXIuY2FsbCh0aGlzLCBldmVudCwgZCksIGV2ZW50LCBkLCBcIm1vdXNlXCIpO1xuICAgIGlmICghZ2VzdHVyZSkgcmV0dXJuO1xuICAgIHNlbGVjdChldmVudC52aWV3KVxuICAgICAgLm9uKFwibW91c2Vtb3ZlLmRyYWdcIiwgbW91c2Vtb3ZlZCwgbm9ucGFzc2l2ZWNhcHR1cmUpXG4gICAgICAub24oXCJtb3VzZXVwLmRyYWdcIiwgbW91c2V1cHBlZCwgbm9ucGFzc2l2ZWNhcHR1cmUpO1xuICAgIG5vZHJhZyhldmVudC52aWV3KTtcbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBtb3VzZW1vdmluZyA9IGZhbHNlO1xuICAgIG1vdXNlZG93bnggPSBldmVudC5jbGllbnRYO1xuICAgIG1vdXNlZG93bnkgPSBldmVudC5jbGllbnRZO1xuICAgIGdlc3R1cmUoXCJzdGFydFwiLCBldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW1vdmVkKGV2ZW50KSB7XG4gICAgbm9ldmVudChldmVudCk7XG4gICAgaWYgKCFtb3VzZW1vdmluZykge1xuICAgICAgdmFyIGR4ID0gZXZlbnQuY2xpZW50WCAtIG1vdXNlZG93bngsIGR5ID0gZXZlbnQuY2xpZW50WSAtIG1vdXNlZG93bnk7XG4gICAgICBtb3VzZW1vdmluZyA9IGR4ICogZHggKyBkeSAqIGR5ID4gY2xpY2tEaXN0YW5jZTI7XG4gICAgfVxuICAgIGdlc3R1cmVzLm1vdXNlKFwiZHJhZ1wiLCBldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZXVwcGVkKGV2ZW50KSB7XG4gICAgc2VsZWN0KGV2ZW50LnZpZXcpLm9uKFwibW91c2Vtb3ZlLmRyYWcgbW91c2V1cC5kcmFnXCIsIG51bGwpO1xuICAgIHllc2RyYWcoZXZlbnQudmlldywgbW91c2Vtb3ZpbmcpO1xuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGdlc3R1cmVzLm1vdXNlKFwiZW5kXCIsIGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoc3RhcnRlZChldmVudCwgZCkge1xuICAgIGlmICghZmlsdGVyLmNhbGwodGhpcywgZXZlbnQsIGQpKSByZXR1cm47XG4gICAgdmFyIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgYyA9IGNvbnRhaW5lci5jYWxsKHRoaXMsIGV2ZW50LCBkKSxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCBnZXN0dXJlO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKGdlc3R1cmUgPSBiZWZvcmVzdGFydCh0aGlzLCBjLCBldmVudCwgZCwgdG91Y2hlc1tpXS5pZGVudGlmaWVyLCB0b3VjaGVzW2ldKSkge1xuICAgICAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgZ2VzdHVyZShcInN0YXJ0XCIsIGV2ZW50LCB0b3VjaGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaG1vdmVkKGV2ZW50KSB7XG4gICAgdmFyIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCBnZXN0dXJlO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKGdlc3R1cmUgPSBnZXN0dXJlc1t0b3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgICAgICBnZXN0dXJlKFwiZHJhZ1wiLCBldmVudCwgdG91Y2hlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hlbmRlZChldmVudCkge1xuICAgIHZhciB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMsXG4gICAgICAgIG4gPSB0b3VjaGVzLmxlbmd0aCwgaSwgZ2VzdHVyZTtcblxuICAgIGlmICh0b3VjaGVuZGluZykgY2xlYXJUaW1lb3V0KHRvdWNoZW5kaW5nKTtcbiAgICB0b3VjaGVuZGluZyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRvdWNoZW5kaW5nID0gbnVsbDsgfSwgNTAwKTsgLy8gR2hvc3QgY2xpY2tzIGFyZSBkZWxheWVkIVxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChnZXN0dXJlID0gZ2VzdHVyZXNbdG91Y2hlc1tpXS5pZGVudGlmaWVyXSkge1xuICAgICAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICAgICAgZ2VzdHVyZShcImVuZFwiLCBldmVudCwgdG91Y2hlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmVmb3Jlc3RhcnQodGhhdCwgY29udGFpbmVyLCBldmVudCwgZCwgaWRlbnRpZmllciwgdG91Y2gpIHtcbiAgICB2YXIgZGlzcGF0Y2ggPSBsaXN0ZW5lcnMuY29weSgpLFxuICAgICAgICBwID0gcG9pbnRlcih0b3VjaCB8fCBldmVudCwgY29udGFpbmVyKSwgZHgsIGR5LFxuICAgICAgICBzO1xuXG4gICAgaWYgKChzID0gc3ViamVjdC5jYWxsKHRoYXQsIG5ldyBEcmFnRXZlbnQoXCJiZWZvcmVzdGFydFwiLCB7XG4gICAgICAgIHNvdXJjZUV2ZW50OiBldmVudCxcbiAgICAgICAgdGFyZ2V0OiBkcmFnLFxuICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICBhY3RpdmUsXG4gICAgICAgIHg6IHBbMF0sXG4gICAgICAgIHk6IHBbMV0sXG4gICAgICAgIGR4OiAwLFxuICAgICAgICBkeTogMCxcbiAgICAgICAgZGlzcGF0Y2hcbiAgICAgIH0pLCBkKSkgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgZHggPSBzLnggLSBwWzBdIHx8IDA7XG4gICAgZHkgPSBzLnkgLSBwWzFdIHx8IDA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZ2VzdHVyZSh0eXBlLCBldmVudCwgdG91Y2gpIHtcbiAgICAgIHZhciBwMCA9IHAsIG47XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcInN0YXJ0XCI6IGdlc3R1cmVzW2lkZW50aWZpZXJdID0gZ2VzdHVyZSwgbiA9IGFjdGl2ZSsrOyBicmVhaztcbiAgICAgICAgY2FzZSBcImVuZFwiOiBkZWxldGUgZ2VzdHVyZXNbaWRlbnRpZmllcl0sIC0tYWN0aXZlOyAvLyBmYWxscyB0aHJvdWdoXG4gICAgICAgIGNhc2UgXCJkcmFnXCI6IHAgPSBwb2ludGVyKHRvdWNoIHx8IGV2ZW50LCBjb250YWluZXIpLCBuID0gYWN0aXZlOyBicmVhaztcbiAgICAgIH1cbiAgICAgIGRpc3BhdGNoLmNhbGwoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHRoYXQsXG4gICAgICAgIG5ldyBEcmFnRXZlbnQodHlwZSwge1xuICAgICAgICAgIHNvdXJjZUV2ZW50OiBldmVudCxcbiAgICAgICAgICBzdWJqZWN0OiBzLFxuICAgICAgICAgIHRhcmdldDogZHJhZyxcbiAgICAgICAgICBpZGVudGlmaWVyLFxuICAgICAgICAgIGFjdGl2ZTogbixcbiAgICAgICAgICB4OiBwWzBdICsgZHgsXG4gICAgICAgICAgeTogcFsxXSArIGR5LFxuICAgICAgICAgIGR4OiBwWzBdIC0gcDBbMF0sXG4gICAgICAgICAgZHk6IHBbMV0gLSBwMFsxXSxcbiAgICAgICAgICBkaXNwYXRjaFxuICAgICAgICB9KSxcbiAgICAgICAgZFxuICAgICAgKTtcbiAgICB9O1xuICB9XG5cbiAgZHJhZy5maWx0ZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZmlsdGVyID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCBkcmFnKSA6IGZpbHRlcjtcbiAgfTtcblxuICBkcmFnLmNvbnRhaW5lciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb250YWluZXIgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KF8pLCBkcmFnKSA6IGNvbnRhaW5lcjtcbiAgfTtcblxuICBkcmFnLnN1YmplY3QgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3ViamVjdCA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoXyksIGRyYWcpIDogc3ViamVjdDtcbiAgfTtcblxuICBkcmFnLnRvdWNoYWJsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0b3VjaGFibGUgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIGRyYWcpIDogdG91Y2hhYmxlO1xuICB9O1xuXG4gIGRyYWcub24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUgPSBsaXN0ZW5lcnMub24uYXBwbHkobGlzdGVuZXJzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbGlzdGVuZXJzID8gZHJhZyA6IHZhbHVlO1xuICB9O1xuXG4gIGRyYWcuY2xpY2tEaXN0YW5jZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGlja0Rpc3RhbmNlMiA9IChfID0gK18pICogXywgZHJhZykgOiBNYXRoLnNxcnQoY2xpY2tEaXN0YW5jZTIpO1xuICB9O1xuXG4gIHJldHVybiBkcmFnO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbnN0cnVjdG9yLCBmYWN0b3J5LCBwcm90b3R5cGUpIHtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gZmFjdG9yeS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHBhcmVudCwgZGVmaW5pdGlvbikge1xuICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcbiAgZm9yICh2YXIga2V5IGluIGRlZmluaXRpb24pIHByb3RvdHlwZVtrZXldID0gZGVmaW5pdGlvbltrZXldO1xuICByZXR1cm4gcHJvdG90eXBlO1xufVxuIiwgImltcG9ydCBkZWZpbmUsIHtleHRlbmR9IGZyb20gXCIuL2RlZmluZS5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29sb3IoKSB7fVxuXG5leHBvcnQgdmFyIGRhcmtlciA9IDAuNztcbmV4cG9ydCB2YXIgYnJpZ2h0ZXIgPSAxIC8gZGFya2VyO1xuXG52YXIgcmVJID0gXCJcXFxccyooWystXT9cXFxcZCspXFxcXHMqXCIsXG4gICAgcmVOID0gXCJcXFxccyooWystXT8oPzpcXFxcZCpcXFxcLik/XFxcXGQrKD86W2VFXVsrLV0/XFxcXGQrKT8pXFxcXHMqXCIsXG4gICAgcmVQID0gXCJcXFxccyooWystXT8oPzpcXFxcZCpcXFxcLik/XFxcXGQrKD86W2VFXVsrLV0/XFxcXGQrKT8pJVxcXFxzKlwiLFxuICAgIHJlSGV4ID0gL14jKFswLTlhLWZdezMsOH0pJC8sXG4gICAgcmVSZ2JJbnRlZ2VyID0gbmV3IFJlZ0V4cChgXnJnYlxcXFwoJHtyZUl9LCR7cmVJfSwke3JlSX1cXFxcKSRgKSxcbiAgICByZVJnYlBlcmNlbnQgPSBuZXcgUmVnRXhwKGBecmdiXFxcXCgke3JlUH0sJHtyZVB9LCR7cmVQfVxcXFwpJGApLFxuICAgIHJlUmdiYUludGVnZXIgPSBuZXcgUmVnRXhwKGBecmdiYVxcXFwoJHtyZUl9LCR7cmVJfSwke3JlSX0sJHtyZU59XFxcXCkkYCksXG4gICAgcmVSZ2JhUGVyY2VudCA9IG5ldyBSZWdFeHAoYF5yZ2JhXFxcXCgke3JlUH0sJHtyZVB9LCR7cmVQfSwke3JlTn1cXFxcKSRgKSxcbiAgICByZUhzbFBlcmNlbnQgPSBuZXcgUmVnRXhwKGBeaHNsXFxcXCgke3JlTn0sJHtyZVB9LCR7cmVQfVxcXFwpJGApLFxuICAgIHJlSHNsYVBlcmNlbnQgPSBuZXcgUmVnRXhwKGBeaHNsYVxcXFwoJHtyZU59LCR7cmVQfSwke3JlUH0sJHtyZU59XFxcXCkkYCk7XG5cbnZhciBuYW1lZCA9IHtcbiAgYWxpY2VibHVlOiAweGYwZjhmZixcbiAgYW50aXF1ZXdoaXRlOiAweGZhZWJkNyxcbiAgYXF1YTogMHgwMGZmZmYsXG4gIGFxdWFtYXJpbmU6IDB4N2ZmZmQ0LFxuICBhenVyZTogMHhmMGZmZmYsXG4gIGJlaWdlOiAweGY1ZjVkYyxcbiAgYmlzcXVlOiAweGZmZTRjNCxcbiAgYmxhY2s6IDB4MDAwMDAwLFxuICBibGFuY2hlZGFsbW9uZDogMHhmZmViY2QsXG4gIGJsdWU6IDB4MDAwMGZmLFxuICBibHVldmlvbGV0OiAweDhhMmJlMixcbiAgYnJvd246IDB4YTUyYTJhLFxuICBidXJseXdvb2Q6IDB4ZGViODg3LFxuICBjYWRldGJsdWU6IDB4NWY5ZWEwLFxuICBjaGFydHJldXNlOiAweDdmZmYwMCxcbiAgY2hvY29sYXRlOiAweGQyNjkxZSxcbiAgY29yYWw6IDB4ZmY3ZjUwLFxuICBjb3JuZmxvd2VyYmx1ZTogMHg2NDk1ZWQsXG4gIGNvcm5zaWxrOiAweGZmZjhkYyxcbiAgY3JpbXNvbjogMHhkYzE0M2MsXG4gIGN5YW46IDB4MDBmZmZmLFxuICBkYXJrYmx1ZTogMHgwMDAwOGIsXG4gIGRhcmtjeWFuOiAweDAwOGI4YixcbiAgZGFya2dvbGRlbnJvZDogMHhiODg2MGIsXG4gIGRhcmtncmF5OiAweGE5YTlhOSxcbiAgZGFya2dyZWVuOiAweDAwNjQwMCxcbiAgZGFya2dyZXk6IDB4YTlhOWE5LFxuICBkYXJra2hha2k6IDB4YmRiNzZiLFxuICBkYXJrbWFnZW50YTogMHg4YjAwOGIsXG4gIGRhcmtvbGl2ZWdyZWVuOiAweDU1NmIyZixcbiAgZGFya29yYW5nZTogMHhmZjhjMDAsXG4gIGRhcmtvcmNoaWQ6IDB4OTkzMmNjLFxuICBkYXJrcmVkOiAweDhiMDAwMCxcbiAgZGFya3NhbG1vbjogMHhlOTk2N2EsXG4gIGRhcmtzZWFncmVlbjogMHg4ZmJjOGYsXG4gIGRhcmtzbGF0ZWJsdWU6IDB4NDgzZDhiLFxuICBkYXJrc2xhdGVncmF5OiAweDJmNGY0ZixcbiAgZGFya3NsYXRlZ3JleTogMHgyZjRmNGYsXG4gIGRhcmt0dXJxdW9pc2U6IDB4MDBjZWQxLFxuICBkYXJrdmlvbGV0OiAweDk0MDBkMyxcbiAgZGVlcHBpbms6IDB4ZmYxNDkzLFxuICBkZWVwc2t5Ymx1ZTogMHgwMGJmZmYsXG4gIGRpbWdyYXk6IDB4Njk2OTY5LFxuICBkaW1ncmV5OiAweDY5Njk2OSxcbiAgZG9kZ2VyYmx1ZTogMHgxZTkwZmYsXG4gIGZpcmVicmljazogMHhiMjIyMjIsXG4gIGZsb3JhbHdoaXRlOiAweGZmZmFmMCxcbiAgZm9yZXN0Z3JlZW46IDB4MjI4YjIyLFxuICBmdWNoc2lhOiAweGZmMDBmZixcbiAgZ2FpbnNib3JvOiAweGRjZGNkYyxcbiAgZ2hvc3R3aGl0ZTogMHhmOGY4ZmYsXG4gIGdvbGQ6IDB4ZmZkNzAwLFxuICBnb2xkZW5yb2Q6IDB4ZGFhNTIwLFxuICBncmF5OiAweDgwODA4MCxcbiAgZ3JlZW46IDB4MDA4MDAwLFxuICBncmVlbnllbGxvdzogMHhhZGZmMmYsXG4gIGdyZXk6IDB4ODA4MDgwLFxuICBob25leWRldzogMHhmMGZmZjAsXG4gIGhvdHBpbms6IDB4ZmY2OWI0LFxuICBpbmRpYW5yZWQ6IDB4Y2Q1YzVjLFxuICBpbmRpZ286IDB4NGIwMDgyLFxuICBpdm9yeTogMHhmZmZmZjAsXG4gIGtoYWtpOiAweGYwZTY4YyxcbiAgbGF2ZW5kZXI6IDB4ZTZlNmZhLFxuICBsYXZlbmRlcmJsdXNoOiAweGZmZjBmNSxcbiAgbGF3bmdyZWVuOiAweDdjZmMwMCxcbiAgbGVtb25jaGlmZm9uOiAweGZmZmFjZCxcbiAgbGlnaHRibHVlOiAweGFkZDhlNixcbiAgbGlnaHRjb3JhbDogMHhmMDgwODAsXG4gIGxpZ2h0Y3lhbjogMHhlMGZmZmYsXG4gIGxpZ2h0Z29sZGVucm9keWVsbG93OiAweGZhZmFkMixcbiAgbGlnaHRncmF5OiAweGQzZDNkMyxcbiAgbGlnaHRncmVlbjogMHg5MGVlOTAsXG4gIGxpZ2h0Z3JleTogMHhkM2QzZDMsXG4gIGxpZ2h0cGluazogMHhmZmI2YzEsXG4gIGxpZ2h0c2FsbW9uOiAweGZmYTA3YSxcbiAgbGlnaHRzZWFncmVlbjogMHgyMGIyYWEsXG4gIGxpZ2h0c2t5Ymx1ZTogMHg4N2NlZmEsXG4gIGxpZ2h0c2xhdGVncmF5OiAweDc3ODg5OSxcbiAgbGlnaHRzbGF0ZWdyZXk6IDB4Nzc4ODk5LFxuICBsaWdodHN0ZWVsYmx1ZTogMHhiMGM0ZGUsXG4gIGxpZ2h0eWVsbG93OiAweGZmZmZlMCxcbiAgbGltZTogMHgwMGZmMDAsXG4gIGxpbWVncmVlbjogMHgzMmNkMzIsXG4gIGxpbmVuOiAweGZhZjBlNixcbiAgbWFnZW50YTogMHhmZjAwZmYsXG4gIG1hcm9vbjogMHg4MDAwMDAsXG4gIG1lZGl1bWFxdWFtYXJpbmU6IDB4NjZjZGFhLFxuICBtZWRpdW1ibHVlOiAweDAwMDBjZCxcbiAgbWVkaXVtb3JjaGlkOiAweGJhNTVkMyxcbiAgbWVkaXVtcHVycGxlOiAweDkzNzBkYixcbiAgbWVkaXVtc2VhZ3JlZW46IDB4M2NiMzcxLFxuICBtZWRpdW1zbGF0ZWJsdWU6IDB4N2I2OGVlLFxuICBtZWRpdW1zcHJpbmdncmVlbjogMHgwMGZhOWEsXG4gIG1lZGl1bXR1cnF1b2lzZTogMHg0OGQxY2MsXG4gIG1lZGl1bXZpb2xldHJlZDogMHhjNzE1ODUsXG4gIG1pZG5pZ2h0Ymx1ZTogMHgxOTE5NzAsXG4gIG1pbnRjcmVhbTogMHhmNWZmZmEsXG4gIG1pc3R5cm9zZTogMHhmZmU0ZTEsXG4gIG1vY2Nhc2luOiAweGZmZTRiNSxcbiAgbmF2YWpvd2hpdGU6IDB4ZmZkZWFkLFxuICBuYXZ5OiAweDAwMDA4MCxcbiAgb2xkbGFjZTogMHhmZGY1ZTYsXG4gIG9saXZlOiAweDgwODAwMCxcbiAgb2xpdmVkcmFiOiAweDZiOGUyMyxcbiAgb3JhbmdlOiAweGZmYTUwMCxcbiAgb3JhbmdlcmVkOiAweGZmNDUwMCxcbiAgb3JjaGlkOiAweGRhNzBkNixcbiAgcGFsZWdvbGRlbnJvZDogMHhlZWU4YWEsXG4gIHBhbGVncmVlbjogMHg5OGZiOTgsXG4gIHBhbGV0dXJxdW9pc2U6IDB4YWZlZWVlLFxuICBwYWxldmlvbGV0cmVkOiAweGRiNzA5MyxcbiAgcGFwYXlhd2hpcDogMHhmZmVmZDUsXG4gIHBlYWNocHVmZjogMHhmZmRhYjksXG4gIHBlcnU6IDB4Y2Q4NTNmLFxuICBwaW5rOiAweGZmYzBjYixcbiAgcGx1bTogMHhkZGEwZGQsXG4gIHBvd2RlcmJsdWU6IDB4YjBlMGU2LFxuICBwdXJwbGU6IDB4ODAwMDgwLFxuICByZWJlY2NhcHVycGxlOiAweDY2MzM5OSxcbiAgcmVkOiAweGZmMDAwMCxcbiAgcm9zeWJyb3duOiAweGJjOGY4ZixcbiAgcm95YWxibHVlOiAweDQxNjllMSxcbiAgc2FkZGxlYnJvd246IDB4OGI0NTEzLFxuICBzYWxtb246IDB4ZmE4MDcyLFxuICBzYW5keWJyb3duOiAweGY0YTQ2MCxcbiAgc2VhZ3JlZW46IDB4MmU4YjU3LFxuICBzZWFzaGVsbDogMHhmZmY1ZWUsXG4gIHNpZW5uYTogMHhhMDUyMmQsXG4gIHNpbHZlcjogMHhjMGMwYzAsXG4gIHNreWJsdWU6IDB4ODdjZWViLFxuICBzbGF0ZWJsdWU6IDB4NmE1YWNkLFxuICBzbGF0ZWdyYXk6IDB4NzA4MDkwLFxuICBzbGF0ZWdyZXk6IDB4NzA4MDkwLFxuICBzbm93OiAweGZmZmFmYSxcbiAgc3ByaW5nZ3JlZW46IDB4MDBmZjdmLFxuICBzdGVlbGJsdWU6IDB4NDY4MmI0LFxuICB0YW46IDB4ZDJiNDhjLFxuICB0ZWFsOiAweDAwODA4MCxcbiAgdGhpc3RsZTogMHhkOGJmZDgsXG4gIHRvbWF0bzogMHhmZjYzNDcsXG4gIHR1cnF1b2lzZTogMHg0MGUwZDAsXG4gIHZpb2xldDogMHhlZTgyZWUsXG4gIHdoZWF0OiAweGY1ZGViMyxcbiAgd2hpdGU6IDB4ZmZmZmZmLFxuICB3aGl0ZXNtb2tlOiAweGY1ZjVmNSxcbiAgeWVsbG93OiAweGZmZmYwMCxcbiAgeWVsbG93Z3JlZW46IDB4OWFjZDMyXG59O1xuXG5kZWZpbmUoQ29sb3IsIGNvbG9yLCB7XG4gIGNvcHkoY2hhbm5lbHMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5jb25zdHJ1Y3RvciwgdGhpcywgY2hhbm5lbHMpO1xuICB9LFxuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZ2IoKS5kaXNwbGF5YWJsZSgpO1xuICB9LFxuICBoZXg6IGNvbG9yX2Zvcm1hdEhleCwgLy8gRGVwcmVjYXRlZCEgVXNlIGNvbG9yLmZvcm1hdEhleC5cbiAgZm9ybWF0SGV4OiBjb2xvcl9mb3JtYXRIZXgsXG4gIGZvcm1hdEhleDg6IGNvbG9yX2Zvcm1hdEhleDgsXG4gIGZvcm1hdEhzbDogY29sb3JfZm9ybWF0SHNsLFxuICBmb3JtYXRSZ2I6IGNvbG9yX2Zvcm1hdFJnYixcbiAgdG9TdHJpbmc6IGNvbG9yX2Zvcm1hdFJnYlxufSk7XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhleCgpIHtcbiAgcmV0dXJuIHRoaXMucmdiKCkuZm9ybWF0SGV4KCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhleDgoKSB7XG4gIHJldHVybiB0aGlzLnJnYigpLmZvcm1hdEhleDgoKTtcbn1cblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0SHNsKCkge1xuICByZXR1cm4gaHNsQ29udmVydCh0aGlzKS5mb3JtYXRIc2woKTtcbn1cblxuZnVuY3Rpb24gY29sb3JfZm9ybWF0UmdiKCkge1xuICByZXR1cm4gdGhpcy5yZ2IoKS5mb3JtYXRSZ2IoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29sb3IoZm9ybWF0KSB7XG4gIHZhciBtLCBsO1xuICBmb3JtYXQgPSAoZm9ybWF0ICsgXCJcIikudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiAobSA9IHJlSGV4LmV4ZWMoZm9ybWF0KSkgPyAobCA9IG1bMV0ubGVuZ3RoLCBtID0gcGFyc2VJbnQobVsxXSwgMTYpLCBsID09PSA2ID8gcmdibihtKSAvLyAjZmYwMDAwXG4gICAgICA6IGwgPT09IDMgPyBuZXcgUmdiKChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4ZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZiksIDEpIC8vICNmMDBcbiAgICAgIDogbCA9PT0gOCA/IHJnYmEobSA+PiAyNCAmIDB4ZmYsIG0gPj4gMTYgJiAweGZmLCBtID4+IDggJiAweGZmLCAobSAmIDB4ZmYpIC8gMHhmZikgLy8gI2ZmMDAwMDAwXG4gICAgICA6IGwgPT09IDQgPyByZ2JhKChtID4+IDEyICYgMHhmKSB8IChtID4+IDggJiAweGYwKSwgKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHhmMCksIChtID4+IDQgJiAweGYpIHwgKG0gJiAweGYwKSwgKCgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpIC8gMHhmZikgLy8gI2YwMDBcbiAgICAgIDogbnVsbCkgLy8gaW52YWxpZCBoZXhcbiAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSwgbVsyXSwgbVszXSwgMSkgLy8gcmdiKDI1NSwgMCwgMClcbiAgICAgIDogKG0gPSByZVJnYlBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IG5ldyBSZ2IobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgMSkgLy8gcmdiKDEwMCUsIDAlLCAwJSlcbiAgICAgIDogKG0gPSByZVJnYmFJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0sIG1bMl0sIG1bM10sIG1bNF0pIC8vIHJnYmEoMjU1LCAwLCAwLCAxKVxuICAgICAgOiAobSA9IHJlUmdiYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IHJnYmEobVsxXSAqIDI1NSAvIDEwMCwgbVsyXSAqIDI1NSAvIDEwMCwgbVszXSAqIDI1NSAvIDEwMCwgbVs0XSkgLy8gcmdiKDEwMCUsIDAlLCAwJSwgMSlcbiAgICAgIDogKG0gPSByZUhzbFBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgMSkgLy8gaHNsKDEyMCwgNTAlLCA1MCUpXG4gICAgICA6IChtID0gcmVIc2xhUGVyY2VudC5leGVjKGZvcm1hdCkpID8gaHNsYShtWzFdLCBtWzJdIC8gMTAwLCBtWzNdIC8gMTAwLCBtWzRdKSAvLyBoc2xhKDEyMCwgNTAlLCA1MCUsIDEpXG4gICAgICA6IG5hbWVkLmhhc093blByb3BlcnR5KGZvcm1hdCkgPyByZ2JuKG5hbWVkW2Zvcm1hdF0pIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gICAgICA6IGZvcm1hdCA9PT0gXCJ0cmFuc3BhcmVudFwiID8gbmV3IFJnYihOYU4sIE5hTiwgTmFOLCAwKVxuICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiByZ2JuKG4pIHtcbiAgcmV0dXJuIG5ldyBSZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmLCAxKTtcbn1cblxuZnVuY3Rpb24gcmdiYShyLCBnLCBiLCBhKSB7XG4gIGlmIChhIDw9IDApIHIgPSBnID0gYiA9IE5hTjtcbiAgcmV0dXJuIG5ldyBSZ2IociwgZywgYiwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2JDb252ZXJ0KG8pIHtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgUmdiO1xuICBvID0gby5yZ2IoKTtcbiAgcmV0dXJuIG5ldyBSZ2Ioby5yLCBvLmcsIG8uYiwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gcmdiQ29udmVydChyKSA6IG5ldyBSZ2IociwgZywgYiwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUmdiKHIsIGcsIGIsIG9wYWNpdHkpIHtcbiAgdGhpcy5yID0gK3I7XG4gIHRoaXMuZyA9ICtnO1xuICB0aGlzLmIgPSArYjtcbiAgdGhpcy5vcGFjaXR5ID0gK29wYWNpdHk7XG59XG5cbmRlZmluZShSZ2IsIHJnYiwgZXh0ZW5kKENvbG9yLCB7XG4gIGJyaWdodGVyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2IoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNsYW1wKCkge1xuICAgIHJldHVybiBuZXcgUmdiKGNsYW1waSh0aGlzLnIpLCBjbGFtcGkodGhpcy5nKSwgY2xhbXBpKHRoaXMuYiksIGNsYW1wYSh0aGlzLm9wYWNpdHkpKTtcbiAgfSxcbiAgZGlzcGxheWFibGUoKSB7XG4gICAgcmV0dXJuICgtMC41IDw9IHRoaXMuciAmJiB0aGlzLnIgPCAyNTUuNSlcbiAgICAgICAgJiYgKC0wLjUgPD0gdGhpcy5nICYmIHRoaXMuZyA8IDI1NS41KVxuICAgICAgICAmJiAoLTAuNSA8PSB0aGlzLmIgJiYgdGhpcy5iIDwgMjU1LjUpXG4gICAgICAgICYmICgwIDw9IHRoaXMub3BhY2l0eSAmJiB0aGlzLm9wYWNpdHkgPD0gMSk7XG4gIH0sXG4gIGhleDogcmdiX2Zvcm1hdEhleCwgLy8gRGVwcmVjYXRlZCEgVXNlIGNvbG9yLmZvcm1hdEhleC5cbiAgZm9ybWF0SGV4OiByZ2JfZm9ybWF0SGV4LFxuICBmb3JtYXRIZXg4OiByZ2JfZm9ybWF0SGV4OCxcbiAgZm9ybWF0UmdiOiByZ2JfZm9ybWF0UmdiLFxuICB0b1N0cmluZzogcmdiX2Zvcm1hdFJnYlxufSkpO1xuXG5mdW5jdGlvbiByZ2JfZm9ybWF0SGV4KCkge1xuICByZXR1cm4gYCMke2hleCh0aGlzLnIpfSR7aGV4KHRoaXMuZyl9JHtoZXgodGhpcy5iKX1gO1xufVxuXG5mdW5jdGlvbiByZ2JfZm9ybWF0SGV4OCgpIHtcbiAgcmV0dXJuIGAjJHtoZXgodGhpcy5yKX0ke2hleCh0aGlzLmcpfSR7aGV4KHRoaXMuYil9JHtoZXgoKGlzTmFOKHRoaXMub3BhY2l0eSkgPyAxIDogdGhpcy5vcGFjaXR5KSAqIDI1NSl9YDtcbn1cblxuZnVuY3Rpb24gcmdiX2Zvcm1hdFJnYigpIHtcbiAgY29uc3QgYSA9IGNsYW1wYSh0aGlzLm9wYWNpdHkpO1xuICByZXR1cm4gYCR7YSA9PT0gMSA/IFwicmdiKFwiIDogXCJyZ2JhKFwifSR7Y2xhbXBpKHRoaXMucil9LCAke2NsYW1waSh0aGlzLmcpfSwgJHtjbGFtcGkodGhpcy5iKX0ke2EgPT09IDEgPyBcIilcIiA6IGAsICR7YX0pYH1gO1xufVxuXG5mdW5jdGlvbiBjbGFtcGEob3BhY2l0eSkge1xuICByZXR1cm4gaXNOYU4ob3BhY2l0eSkgPyAxIDogTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgb3BhY2l0eSkpO1xufVxuXG5mdW5jdGlvbiBjbGFtcGkodmFsdWUpIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgTWF0aC5yb3VuZCh2YWx1ZSkgfHwgMCkpO1xufVxuXG5mdW5jdGlvbiBoZXgodmFsdWUpIHtcbiAgdmFsdWUgPSBjbGFtcGkodmFsdWUpO1xuICByZXR1cm4gKHZhbHVlIDwgMTYgPyBcIjBcIiA6IFwiXCIpICsgdmFsdWUudG9TdHJpbmcoMTYpO1xufVxuXG5mdW5jdGlvbiBoc2xhKGgsIHMsIGwsIGEpIHtcbiAgaWYgKGEgPD0gMCkgaCA9IHMgPSBsID0gTmFOO1xuICBlbHNlIGlmIChsIDw9IDAgfHwgbCA+PSAxKSBoID0gcyA9IE5hTjtcbiAgZWxzZSBpZiAocyA8PSAwKSBoID0gTmFOO1xuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbENvbnZlcnQobykge1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG5ldyBIc2woby5oLCBvLnMsIG8ubCwgby5vcGFjaXR5KTtcbiAgaWYgKCEobyBpbnN0YW5jZW9mIENvbG9yKSkgbyA9IGNvbG9yKG8pO1xuICBpZiAoIW8pIHJldHVybiBuZXcgSHNsO1xuICBpZiAobyBpbnN0YW5jZW9mIEhzbCkgcmV0dXJuIG87XG4gIG8gPSBvLnJnYigpO1xuICB2YXIgciA9IG8uciAvIDI1NSxcbiAgICAgIGcgPSBvLmcgLyAyNTUsXG4gICAgICBiID0gby5iIC8gMjU1LFxuICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcbiAgICAgIGggPSBOYU4sXG4gICAgICBzID0gbWF4IC0gbWluLFxuICAgICAgbCA9IChtYXggKyBtaW4pIC8gMjtcbiAgaWYgKHMpIHtcbiAgICBpZiAociA9PT0gbWF4KSBoID0gKGcgLSBiKSAvIHMgKyAoZyA8IGIpICogNjtcbiAgICBlbHNlIGlmIChnID09PSBtYXgpIGggPSAoYiAtIHIpIC8gcyArIDI7XG4gICAgZWxzZSBoID0gKHIgLSBnKSAvIHMgKyA0O1xuICAgIHMgLz0gbCA8IDAuNSA/IG1heCArIG1pbiA6IDIgLSBtYXggLSBtaW47XG4gICAgaCAqPSA2MDtcbiAgfSBlbHNlIHtcbiAgICBzID0gbCA+IDAgJiYgbCA8IDEgPyAwIDogaDtcbiAgfVxuICByZXR1cm4gbmV3IEhzbChoLCBzLCBsLCBvLm9wYWNpdHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHNsKGgsIHMsIGwsIG9wYWNpdHkpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBoc2xDb252ZXJ0KGgpIDogbmV3IEhzbChoLCBzLCBsLCBvcGFjaXR5ID09IG51bGwgPyAxIDogb3BhY2l0eSk7XG59XG5cbmZ1bmN0aW9uIEhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHRoaXMuaCA9ICtoO1xuICB0aGlzLnMgPSArcztcbiAgdGhpcy5sID0gK2w7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoSHNsLCBoc2wsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICBkYXJrZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrLCB0aGlzLm9wYWNpdHkpO1xuICB9LFxuICByZ2IoKSB7XG4gICAgdmFyIGggPSB0aGlzLmggJSAzNjAgKyAodGhpcy5oIDwgMCkgKiAzNjAsXG4gICAgICAgIHMgPSBpc05hTihoKSB8fCBpc05hTih0aGlzLnMpID8gMCA6IHRoaXMucyxcbiAgICAgICAgbCA9IHRoaXMubCxcbiAgICAgICAgbTIgPSBsICsgKGwgPCAwLjUgPyBsIDogMSAtIGwpICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMiksXG4gICAgICB0aGlzLm9wYWNpdHlcbiAgICApO1xuICB9LFxuICBjbGFtcCgpIHtcbiAgICByZXR1cm4gbmV3IEhzbChjbGFtcGgodGhpcy5oKSwgY2xhbXB0KHRoaXMucyksIGNsYW1wdCh0aGlzLmwpLCBjbGFtcGEodGhpcy5vcGFjaXR5KSk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlKCkge1xuICAgIHJldHVybiAoMCA8PSB0aGlzLnMgJiYgdGhpcy5zIDw9IDEgfHwgaXNOYU4odGhpcy5zKSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5sICYmIHRoaXMubCA8PSAxKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9LFxuICBmb3JtYXRIc2woKSB7XG4gICAgY29uc3QgYSA9IGNsYW1wYSh0aGlzLm9wYWNpdHkpO1xuICAgIHJldHVybiBgJHthID09PSAxID8gXCJoc2woXCIgOiBcImhzbGEoXCJ9JHtjbGFtcGgodGhpcy5oKX0sICR7Y2xhbXB0KHRoaXMucykgKiAxMDB9JSwgJHtjbGFtcHQodGhpcy5sKSAqIDEwMH0lJHthID09PSAxID8gXCIpXCIgOiBgLCAke2F9KWB9YDtcbiAgfVxufSkpO1xuXG5mdW5jdGlvbiBjbGFtcGgodmFsdWUpIHtcbiAgdmFsdWUgPSAodmFsdWUgfHwgMCkgJSAzNjA7XG4gIHJldHVybiB2YWx1ZSA8IDAgPyB2YWx1ZSArIDM2MCA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBjbGFtcHQodmFsdWUpIHtcbiAgcmV0dXJuIE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHZhbHVlIHx8IDApKTtcbn1cblxuLyogRnJvbSBGdkQgMTMuMzcsIENTUyBDb2xvciBNb2R1bGUgTGV2ZWwgMyAqL1xuZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgOiBoIDwgMTgwID8gbTJcbiAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgIDogbTEpICogMjU1O1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBiYXNpcyh0MSwgdjAsIHYxLCB2MiwgdjMpIHtcbiAgdmFyIHQyID0gdDEgKiB0MSwgdDMgPSB0MiAqIHQxO1xuICByZXR1cm4gKCgxIC0gMyAqIHQxICsgMyAqIHQyIC0gdDMpICogdjBcbiAgICAgICsgKDQgLSA2ICogdDIgKyAzICogdDMpICogdjFcbiAgICAgICsgKDEgKyAzICogdDEgKyAzICogdDIgLSAzICogdDMpICogdjJcbiAgICAgICsgdDMgKiB2MykgLyA2O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIG4gPSB2YWx1ZXMubGVuZ3RoIC0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IHQgPD0gMCA/ICh0ID0gMCkgOiB0ID49IDEgPyAodCA9IDEsIG4gLSAxKSA6IE1hdGguZmxvb3IodCAqIG4pLFxuICAgICAgICB2MSA9IHZhbHVlc1tpXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbaSArIDFdLFxuICAgICAgICB2MCA9IGkgPiAwID8gdmFsdWVzW2kgLSAxXSA6IDIgKiB2MSAtIHYyLFxuICAgICAgICB2MyA9IGkgPCBuIC0gMSA/IHZhbHVlc1tpICsgMl0gOiAyICogdjIgLSB2MTtcbiAgICByZXR1cm4gYmFzaXMoKHQgLSBpIC8gbikgKiBuLCB2MCwgdjEsIHYyLCB2Myk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtiYXNpc30gZnJvbSBcIi4vYmFzaXMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aDtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoKCh0ICU9IDEpIDwgMCA/ICsrdCA6IHQpICogbiksXG4gICAgICAgIHYwID0gdmFsdWVzWyhpICsgbiAtIDEpICUgbl0sXG4gICAgICAgIHYxID0gdmFsdWVzW2kgJSBuXSxcbiAgICAgICAgdjIgPSB2YWx1ZXNbKGkgKyAxKSAlIG5dLFxuICAgICAgICB2MyA9IHZhbHVlc1soaSArIDIpICUgbl07XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IHggPT4gKCkgPT4geDtcbiIsICJpbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcblxuZnVuY3Rpb24gbGluZWFyKGEsIGQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYSArIHQgKiBkO1xuICB9O1xufVxuXG5mdW5jdGlvbiBleHBvbmVudGlhbChhLCBiLCB5KSB7XG4gIHJldHVybiBhID0gTWF0aC5wb3coYSwgeSksIGIgPSBNYXRoLnBvdyhiLCB5KSAtIGEsIHkgPSAxIC8geSwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBNYXRoLnBvdyhhICsgdCAqIGIsIHkpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaHVlKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCA+IDE4MCB8fCBkIDwgLTE4MCA/IGQgLSAzNjAgKiBNYXRoLnJvdW5kKGQgLyAzNjApIDogZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdhbW1hKHkpIHtcbiAgcmV0dXJuICh5ID0gK3kpID09PSAxID8gbm9nYW1tYSA6IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYiAtIGEgPyBleHBvbmVudGlhbChhLCBiLCB5KSA6IGNvbnN0YW50KGlzTmFOKGEpID8gYiA6IGEpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub2dhbW1hKGEsIGIpIHtcbiAgdmFyIGQgPSBiIC0gYTtcbiAgcmV0dXJuIGQgPyBsaW5lYXIoYSwgZCkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbn1cbiIsICJpbXBvcnQge3JnYiBhcyBjb2xvclJnYn0gZnJvbSBcImQzLWNvbG9yXCI7XG5pbXBvcnQgYmFzaXMgZnJvbSBcIi4vYmFzaXMuanNcIjtcbmltcG9ydCBiYXNpc0Nsb3NlZCBmcm9tIFwiLi9iYXNpc0Nsb3NlZC5qc1wiO1xuaW1wb3J0IG5vZ2FtbWEsIHtnYW1tYX0gZnJvbSBcIi4vY29sb3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIHJnYkdhbW1hKHkpIHtcbiAgdmFyIGNvbG9yID0gZ2FtbWEoeSk7XG5cbiAgZnVuY3Rpb24gcmdiKHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgciA9IGNvbG9yKChzdGFydCA9IGNvbG9yUmdiKHN0YXJ0KSkuciwgKGVuZCA9IGNvbG9yUmdiKGVuZCkpLnIpLFxuICAgICAgICBnID0gY29sb3Ioc3RhcnQuZywgZW5kLmcpLFxuICAgICAgICBiID0gY29sb3Ioc3RhcnQuYiwgZW5kLmIpLFxuICAgICAgICBvcGFjaXR5ID0gbm9nYW1tYShzdGFydC5vcGFjaXR5LCBlbmQub3BhY2l0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHN0YXJ0LnIgPSByKHQpO1xuICAgICAgc3RhcnQuZyA9IGcodCk7XG4gICAgICBzdGFydC5iID0gYih0KTtcbiAgICAgIHN0YXJ0Lm9wYWNpdHkgPSBvcGFjaXR5KHQpO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgcmdiLmdhbW1hID0gcmdiR2FtbWE7XG5cbiAgcmV0dXJuIHJnYjtcbn0pKDEpO1xuXG5mdW5jdGlvbiByZ2JTcGxpbmUoc3BsaW5lKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xvcnMpIHtcbiAgICB2YXIgbiA9IGNvbG9ycy5sZW5ndGgsXG4gICAgICAgIHIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGcgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGIgPSBuZXcgQXJyYXkobiksXG4gICAgICAgIGksIGNvbG9yO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGNvbG9yID0gY29sb3JSZ2IoY29sb3JzW2ldKTtcbiAgICAgIHJbaV0gPSBjb2xvci5yIHx8IDA7XG4gICAgICBnW2ldID0gY29sb3IuZyB8fCAwO1xuICAgICAgYltpXSA9IGNvbG9yLmIgfHwgMDtcbiAgICB9XG4gICAgciA9IHNwbGluZShyKTtcbiAgICBnID0gc3BsaW5lKGcpO1xuICAgIGIgPSBzcGxpbmUoYik7XG4gICAgY29sb3Iub3BhY2l0eSA9IDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGNvbG9yLnIgPSByKHQpO1xuICAgICAgY29sb3IuZyA9IGcodCk7XG4gICAgICBjb2xvci5iID0gYih0KTtcbiAgICAgIHJldHVybiBjb2xvciArIFwiXCI7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IHZhciByZ2JCYXNpcyA9IHJnYlNwbGluZShiYXNpcyk7XG5leHBvcnQgdmFyIHJnYkJhc2lzQ2xvc2VkID0gcmdiU3BsaW5lKGJhc2lzQ2xvc2VkKTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID0gK2EsIGIgPSArYiwgZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBhICogKDEgLSB0KSArIGIgKiB0O1xuICB9O1xufVxuIiwgImltcG9ydCBudW1iZXIgZnJvbSBcIi4vbnVtYmVyLmpzXCI7XG5cbnZhciByZUEgPSAvWy0rXT8oPzpcXGQrXFwuP1xcZCp8XFwuP1xcZCspKD86W2VFXVstK10/XFxkKyk/L2csXG4gICAgcmVCID0gbmV3IFJlZ0V4cChyZUEuc291cmNlLCBcImdcIik7XG5cbmZ1bmN0aW9uIHplcm8oYikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGI7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uZShiKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGIodCkgKyBcIlwiO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhLCBiKSB7XG4gIHZhciBiaSA9IHJlQS5sYXN0SW5kZXggPSByZUIubGFzdEluZGV4ID0gMCwgLy8gc2NhbiBpbmRleCBmb3IgbmV4dCBudW1iZXIgaW4gYlxuICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgYm0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYlxuICAgICAgYnMsIC8vIHN0cmluZyBwcmVjZWRpbmcgY3VycmVudCBudW1iZXIgaW4gYiwgaWYgYW55XG4gICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgIHMgPSBbXSwgLy8gc3RyaW5nIGNvbnN0YW50cyBhbmQgcGxhY2Vob2xkZXJzXG4gICAgICBxID0gW107IC8vIG51bWJlciBpbnRlcnBvbGF0b3JzXG5cbiAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICBhID0gYSArIFwiXCIsIGIgPSBiICsgXCJcIjtcblxuICAvLyBJbnRlcnBvbGF0ZSBwYWlycyBvZiBudW1iZXJzIGluIGEgJiBiLlxuICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAmJiAoYm0gPSByZUIuZXhlYyhiKSkpIHtcbiAgICBpZiAoKGJzID0gYm0uaW5kZXgpID4gYmkpIHsgLy8gYSBzdHJpbmcgcHJlY2VkZXMgdGhlIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJzO1xuICAgIH1cbiAgICBpZiAoKGFtID0gYW1bMF0pID09PSAoYm0gPSBibVswXSkpIHsgLy8gbnVtYmVycyBpbiBhICYgYiBtYXRjaFxuICAgICAgaWYgKHNbaV0pIHNbaV0gKz0gYm07IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgIH0gZWxzZSB7IC8vIGludGVycG9sYXRlIG5vbi1tYXRjaGluZyBudW1iZXJzXG4gICAgICBzWysraV0gPSBudWxsO1xuICAgICAgcS5wdXNoKHtpOiBpLCB4OiBudW1iZXIoYW0sIGJtKX0pO1xuICAgIH1cbiAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gIH1cblxuICAvLyBBZGQgcmVtYWlucyBvZiBiLlxuICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgIGJzID0gYi5zbGljZShiaSk7XG4gICAgaWYgKHNbaV0pIHNbaV0gKz0gYnM7IC8vIGNvYWxlc2NlIHdpdGggcHJldmlvdXMgc3RyaW5nXG4gICAgZWxzZSBzWysraV0gPSBicztcbiAgfVxuXG4gIC8vIFNwZWNpYWwgb3B0aW1pemF0aW9uIGZvciBvbmx5IGEgc2luZ2xlIG1hdGNoLlxuICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICByZXR1cm4gcy5sZW5ndGggPCAyID8gKHFbMF1cbiAgICAgID8gb25lKHFbMF0ueClcbiAgICAgIDogemVybyhiKSlcbiAgICAgIDogKGIgPSBxLmxlbmd0aCwgZnVuY3Rpb24odCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgcmV0dXJuIHMuam9pbihcIlwiKTtcbiAgICAgICAgfSk7XG59XG4iLCAidmFyIGRlZ3JlZXMgPSAxODAgLyBNYXRoLlBJO1xuXG5leHBvcnQgdmFyIGlkZW50aXR5ID0ge1xuICB0cmFuc2xhdGVYOiAwLFxuICB0cmFuc2xhdGVZOiAwLFxuICByb3RhdGU6IDAsXG4gIHNrZXdYOiAwLFxuICBzY2FsZVg6IDEsXG4gIHNjYWxlWTogMVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYiwgYywgZCwgZSwgZikge1xuICB2YXIgc2NhbGVYLCBzY2FsZVksIHNrZXdYO1xuICBpZiAoc2NhbGVYID0gTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpKSBhIC89IHNjYWxlWCwgYiAvPSBzY2FsZVg7XG4gIGlmIChza2V3WCA9IGEgKiBjICsgYiAqIGQpIGMgLT0gYSAqIHNrZXdYLCBkIC09IGIgKiBza2V3WDtcbiAgaWYgKHNjYWxlWSA9IE1hdGguc3FydChjICogYyArIGQgKiBkKSkgYyAvPSBzY2FsZVksIGQgLz0gc2NhbGVZLCBza2V3WCAvPSBzY2FsZVk7XG4gIGlmIChhICogZCA8IGIgKiBjKSBhID0gLWEsIGIgPSAtYiwgc2tld1ggPSAtc2tld1gsIHNjYWxlWCA9IC1zY2FsZVg7XG4gIHJldHVybiB7XG4gICAgdHJhbnNsYXRlWDogZSxcbiAgICB0cmFuc2xhdGVZOiBmLFxuICAgIHJvdGF0ZTogTWF0aC5hdGFuMihiLCBhKSAqIGRlZ3JlZXMsXG4gICAgc2tld1g6IE1hdGguYXRhbihza2V3WCkgKiBkZWdyZWVzLFxuICAgIHNjYWxlWDogc2NhbGVYLFxuICAgIHNjYWxlWTogc2NhbGVZXG4gIH07XG59XG4iLCAiaW1wb3J0IGRlY29tcG9zZSwge2lkZW50aXR5fSBmcm9tIFwiLi9kZWNvbXBvc2UuanNcIjtcblxudmFyIHN2Z05vZGU7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDc3ModmFsdWUpIHtcbiAgY29uc3QgbSA9IG5ldyAodHlwZW9mIERPTU1hdHJpeCA9PT0gXCJmdW5jdGlvblwiID8gRE9NTWF0cml4IDogV2ViS2l0Q1NTTWF0cml4KSh2YWx1ZSArIFwiXCIpO1xuICByZXR1cm4gbS5pc0lkZW50aXR5ID8gaWRlbnRpdHkgOiBkZWNvbXBvc2UobS5hLCBtLmIsIG0uYywgbS5kLCBtLmUsIG0uZik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVN2Zyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIGlkZW50aXR5O1xuICBpZiAoIXN2Z05vZGUpIHN2Z05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImdcIik7XG4gIHN2Z05vZGUuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIHZhbHVlKTtcbiAgaWYgKCEodmFsdWUgPSBzdmdOb2RlLnRyYW5zZm9ybS5iYXNlVmFsLmNvbnNvbGlkYXRlKCkpKSByZXR1cm4gaWRlbnRpdHk7XG4gIHZhbHVlID0gdmFsdWUubWF0cml4O1xuICByZXR1cm4gZGVjb21wb3NlKHZhbHVlLmEsIHZhbHVlLmIsIHZhbHVlLmMsIHZhbHVlLmQsIHZhbHVlLmUsIHZhbHVlLmYpO1xufVxuIiwgImltcG9ydCBudW1iZXIgZnJvbSBcIi4uL251bWJlci5qc1wiO1xuaW1wb3J0IHtwYXJzZUNzcywgcGFyc2VTdmd9IGZyb20gXCIuL3BhcnNlLmpzXCI7XG5cbmZ1bmN0aW9uIGludGVycG9sYXRlVHJhbnNmb3JtKHBhcnNlLCBweENvbW1hLCBweFBhcmVuLCBkZWdQYXJlbikge1xuXG4gIGZ1bmN0aW9uIHBvcChzKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoID8gcy5wb3AoKSArIFwiIFwiIDogXCJcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZSh4YSwgeWEsIHhiLCB5YiwgcywgcSkge1xuICAgIGlmICh4YSAhPT0geGIgfHwgeWEgIT09IHliKSB7XG4gICAgICB2YXIgaSA9IHMucHVzaChcInRyYW5zbGF0ZShcIiwgbnVsbCwgcHhDb21tYSwgbnVsbCwgcHhQYXJlbik7XG4gICAgICBxLnB1c2goe2k6IGkgLSA0LCB4OiBudW1iZXIoeGEsIHhiKX0sIHtpOiBpIC0gMiwgeDogbnVtYmVyKHlhLCB5Yil9KTtcbiAgICB9IGVsc2UgaWYgKHhiIHx8IHliKSB7XG4gICAgICBzLnB1c2goXCJ0cmFuc2xhdGUoXCIgKyB4YiArIHB4Q29tbWEgKyB5YiArIHB4UGFyZW4pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJvdGF0ZShhLCBiLCBzLCBxKSB7XG4gICAgaWYgKGEgIT09IGIpIHtcbiAgICAgIGlmIChhIC0gYiA+IDE4MCkgYiArPSAzNjA7IGVsc2UgaWYgKGIgLSBhID4gMTgwKSBhICs9IDM2MDsgLy8gc2hvcnRlc3QgcGF0aFxuICAgICAgcS5wdXNoKHtpOiBzLnB1c2gocG9wKHMpICsgXCJyb3RhdGUoXCIsIG51bGwsIGRlZ1BhcmVuKSAtIDIsIHg6IG51bWJlcihhLCBiKX0pO1xuICAgIH0gZWxzZSBpZiAoYikge1xuICAgICAgcy5wdXNoKHBvcChzKSArIFwicm90YXRlKFwiICsgYiArIGRlZ1BhcmVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBza2V3WChhLCBiLCBzLCBxKSB7XG4gICAgaWYgKGEgIT09IGIpIHtcbiAgICAgIHEucHVzaCh7aTogcy5wdXNoKHBvcChzKSArIFwic2tld1goXCIsIG51bGwsIGRlZ1BhcmVuKSAtIDIsIHg6IG51bWJlcihhLCBiKX0pO1xuICAgIH0gZWxzZSBpZiAoYikge1xuICAgICAgcy5wdXNoKHBvcChzKSArIFwic2tld1goXCIgKyBiICsgZGVnUGFyZW4pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjYWxlKHhhLCB5YSwgeGIsIHliLCBzLCBxKSB7XG4gICAgaWYgKHhhICE9PSB4YiB8fCB5YSAhPT0geWIpIHtcbiAgICAgIHZhciBpID0gcy5wdXNoKHBvcChzKSArIFwic2NhbGUoXCIsIG51bGwsIFwiLFwiLCBudWxsLCBcIilcIik7XG4gICAgICBxLnB1c2goe2k6IGkgLSA0LCB4OiBudW1iZXIoeGEsIHhiKX0sIHtpOiBpIC0gMiwgeDogbnVtYmVyKHlhLCB5Yil9KTtcbiAgICB9IGVsc2UgaWYgKHhiICE9PSAxIHx8IHliICE9PSAxKSB7XG4gICAgICBzLnB1c2gocG9wKHMpICsgXCJzY2FsZShcIiArIHhiICsgXCIsXCIgKyB5YiArIFwiKVwiKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBzID0gW10sIC8vIHN0cmluZyBjb25zdGFudHMgYW5kIHBsYWNlaG9sZGVyc1xuICAgICAgICBxID0gW107IC8vIG51bWJlciBpbnRlcnBvbGF0b3JzXG4gICAgYSA9IHBhcnNlKGEpLCBiID0gcGFyc2UoYik7XG4gICAgdHJhbnNsYXRlKGEudHJhbnNsYXRlWCwgYS50cmFuc2xhdGVZLCBiLnRyYW5zbGF0ZVgsIGIudHJhbnNsYXRlWSwgcywgcSk7XG4gICAgcm90YXRlKGEucm90YXRlLCBiLnJvdGF0ZSwgcywgcSk7XG4gICAgc2tld1goYS5za2V3WCwgYi5za2V3WCwgcywgcSk7XG4gICAgc2NhbGUoYS5zY2FsZVgsIGEuc2NhbGVZLCBiLnNjYWxlWCwgYi5zY2FsZVksIHMsIHEpO1xuICAgIGEgPSBiID0gbnVsbDsgLy8gZ2NcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgdmFyIGkgPSAtMSwgbiA9IHEubGVuZ3RoLCBvO1xuICAgICAgd2hpbGUgKCsraSA8IG4pIHNbKG8gPSBxW2ldKS5pXSA9IG8ueCh0KTtcbiAgICAgIHJldHVybiBzLmpvaW4oXCJcIik7XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IHZhciBpbnRlcnBvbGF0ZVRyYW5zZm9ybUNzcyA9IGludGVycG9sYXRlVHJhbnNmb3JtKHBhcnNlQ3NzLCBcInB4LCBcIiwgXCJweClcIiwgXCJkZWcpXCIpO1xuZXhwb3J0IHZhciBpbnRlcnBvbGF0ZVRyYW5zZm9ybVN2ZyA9IGludGVycG9sYXRlVHJhbnNmb3JtKHBhcnNlU3ZnLCBcIiwgXCIsIFwiKVwiLCBcIilcIik7XG4iLCAidmFyIGVwc2lsb24yID0gMWUtMTI7XG5cbmZ1bmN0aW9uIGNvc2goeCkge1xuICByZXR1cm4gKCh4ID0gTWF0aC5leHAoeCkpICsgMSAvIHgpIC8gMjtcbn1cblxuZnVuY3Rpb24gc2luaCh4KSB7XG4gIHJldHVybiAoKHggPSBNYXRoLmV4cCh4KSkgLSAxIC8geCkgLyAyO1xufVxuXG5mdW5jdGlvbiB0YW5oKHgpIHtcbiAgcmV0dXJuICgoeCA9IE1hdGguZXhwKDIgKiB4KSkgLSAxKSAvICh4ICsgMSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiB6b29tUmhvKHJobywgcmhvMiwgcmhvNCkge1xuXG4gIC8vIHAwID0gW3V4MCwgdXkwLCB3MF1cbiAgLy8gcDEgPSBbdXgxLCB1eTEsIHcxXVxuICBmdW5jdGlvbiB6b29tKHAwLCBwMSkge1xuICAgIHZhciB1eDAgPSBwMFswXSwgdXkwID0gcDBbMV0sIHcwID0gcDBbMl0sXG4gICAgICAgIHV4MSA9IHAxWzBdLCB1eTEgPSBwMVsxXSwgdzEgPSBwMVsyXSxcbiAgICAgICAgZHggPSB1eDEgLSB1eDAsXG4gICAgICAgIGR5ID0gdXkxIC0gdXkwLFxuICAgICAgICBkMiA9IGR4ICogZHggKyBkeSAqIGR5LFxuICAgICAgICBpLFxuICAgICAgICBTO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciB1MCBcdTIyNDUgdTEuXG4gICAgaWYgKGQyIDwgZXBzaWxvbjIpIHtcbiAgICAgIFMgPSBNYXRoLmxvZyh3MSAvIHcwKSAvIHJobztcbiAgICAgIGkgPSBmdW5jdGlvbih0KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgdXgwICsgdCAqIGR4LFxuICAgICAgICAgIHV5MCArIHQgKiBkeSxcbiAgICAgICAgICB3MCAqIE1hdGguZXhwKHJobyAqIHQgKiBTKVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEdlbmVyYWwgY2FzZS5cbiAgICBlbHNlIHtcbiAgICAgIHZhciBkMSA9IE1hdGguc3FydChkMiksXG4gICAgICAgICAgYjAgPSAodzEgKiB3MSAtIHcwICogdzAgKyByaG80ICogZDIpIC8gKDIgKiB3MCAqIHJobzIgKiBkMSksXG4gICAgICAgICAgYjEgPSAodzEgKiB3MSAtIHcwICogdzAgLSByaG80ICogZDIpIC8gKDIgKiB3MSAqIHJobzIgKiBkMSksXG4gICAgICAgICAgcjAgPSBNYXRoLmxvZyhNYXRoLnNxcnQoYjAgKiBiMCArIDEpIC0gYjApLFxuICAgICAgICAgIHIxID0gTWF0aC5sb2coTWF0aC5zcXJ0KGIxICogYjEgKyAxKSAtIGIxKTtcbiAgICAgIFMgPSAocjEgLSByMCkgLyByaG87XG4gICAgICBpID0gZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcyA9IHQgKiBTLFxuICAgICAgICAgICAgY29zaHIwID0gY29zaChyMCksXG4gICAgICAgICAgICB1ID0gdzAgLyAocmhvMiAqIGQxKSAqIChjb3NocjAgKiB0YW5oKHJobyAqIHMgKyByMCkgLSBzaW5oKHIwKSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgdXgwICsgdSAqIGR4LFxuICAgICAgICAgIHV5MCArIHUgKiBkeSxcbiAgICAgICAgICB3MCAqIGNvc2hyMCAvIGNvc2gocmhvICogcyArIHIwKVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGkuZHVyYXRpb24gPSBTICogMTAwMCAqIHJobyAvIE1hdGguU1FSVDI7XG5cbiAgICByZXR1cm4gaTtcbiAgfVxuXG4gIHpvb20ucmhvID0gZnVuY3Rpb24oXykge1xuICAgIHZhciBfMSA9IE1hdGgubWF4KDFlLTMsICtfKSwgXzIgPSBfMSAqIF8xLCBfNCA9IF8yICogXzI7XG4gICAgcmV0dXJuIHpvb21SaG8oXzEsIF8yLCBfNCk7XG4gIH07XG5cbiAgcmV0dXJuIHpvb207XG59KShNYXRoLlNRUlQyLCAyLCA0KTtcbiIsICJ2YXIgZnJhbWUgPSAwLCAvLyBpcyBhbiBhbmltYXRpb24gZnJhbWUgcGVuZGluZz9cbiAgICB0aW1lb3V0ID0gMCwgLy8gaXMgYSB0aW1lb3V0IHBlbmRpbmc/XG4gICAgaW50ZXJ2YWwgPSAwLCAvLyBhcmUgYW55IHRpbWVycyBhY3RpdmU/XG4gICAgcG9rZURlbGF5ID0gMTAwMCwgLy8gaG93IGZyZXF1ZW50bHkgd2UgY2hlY2sgZm9yIGNsb2NrIHNrZXdcbiAgICB0YXNrSGVhZCxcbiAgICB0YXNrVGFpbCxcbiAgICBjbG9ja0xhc3QgPSAwLFxuICAgIGNsb2NrTm93ID0gMCxcbiAgICBjbG9ja1NrZXcgPSAwLFxuICAgIGNsb2NrID0gdHlwZW9mIHBlcmZvcm1hbmNlID09PSBcIm9iamVjdFwiICYmIHBlcmZvcm1hbmNlLm5vdyA/IHBlcmZvcm1hbmNlIDogRGF0ZSxcbiAgICBzZXRGcmFtZSA9IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgJiYgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA/IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpIDogZnVuY3Rpb24oZikgeyBzZXRUaW1lb3V0KGYsIDE3KTsgfTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5vdygpIHtcbiAgcmV0dXJuIGNsb2NrTm93IHx8IChzZXRGcmFtZShjbGVhck5vdyksIGNsb2NrTm93ID0gY2xvY2subm93KCkgKyBjbG9ja1NrZXcpO1xufVxuXG5mdW5jdGlvbiBjbGVhck5vdygpIHtcbiAgY2xvY2tOb3cgPSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVGltZXIoKSB7XG4gIHRoaXMuX2NhbGwgPVxuICB0aGlzLl90aW1lID1cbiAgdGhpcy5fbmV4dCA9IG51bGw7XG59XG5cblRpbWVyLnByb3RvdHlwZSA9IHRpbWVyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFRpbWVyLFxuICByZXN0YXJ0OiBmdW5jdGlvbihjYWxsYmFjaywgZGVsYXksIHRpbWUpIHtcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvblwiKTtcbiAgICB0aW1lID0gKHRpbWUgPT0gbnVsbCA/IG5vdygpIDogK3RpbWUpICsgKGRlbGF5ID09IG51bGwgPyAwIDogK2RlbGF5KTtcbiAgICBpZiAoIXRoaXMuX25leHQgJiYgdGFza1RhaWwgIT09IHRoaXMpIHtcbiAgICAgIGlmICh0YXNrVGFpbCkgdGFza1RhaWwuX25leHQgPSB0aGlzO1xuICAgICAgZWxzZSB0YXNrSGVhZCA9IHRoaXM7XG4gICAgICB0YXNrVGFpbCA9IHRoaXM7XG4gICAgfVxuICAgIHRoaXMuX2NhbGwgPSBjYWxsYmFjaztcbiAgICB0aGlzLl90aW1lID0gdGltZTtcbiAgICBzbGVlcCgpO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fY2FsbCkge1xuICAgICAgdGhpcy5fY2FsbCA9IG51bGw7XG4gICAgICB0aGlzLl90aW1lID0gSW5maW5pdHk7XG4gICAgICBzbGVlcCgpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGNhbGxiYWNrLCBkZWxheSwgdGltZSkge1xuICB2YXIgdCA9IG5ldyBUaW1lcjtcbiAgdC5yZXN0YXJ0KGNhbGxiYWNrLCBkZWxheSwgdGltZSk7XG4gIHJldHVybiB0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGltZXJGbHVzaCgpIHtcbiAgbm93KCk7IC8vIEdldCB0aGUgY3VycmVudCB0aW1lLCBpZiBub3QgYWxyZWFkeSBzZXQuXG4gICsrZnJhbWU7IC8vIFByZXRlbmQgd2VcdTIwMTl2ZSBzZXQgYW4gYWxhcm0sIGlmIHdlIGhhdmVuXHUyMDE5dCBhbHJlYWR5LlxuICB2YXIgdCA9IHRhc2tIZWFkLCBlO1xuICB3aGlsZSAodCkge1xuICAgIGlmICgoZSA9IGNsb2NrTm93IC0gdC5fdGltZSkgPj0gMCkgdC5fY2FsbC5jYWxsKHVuZGVmaW5lZCwgZSk7XG4gICAgdCA9IHQuX25leHQ7XG4gIH1cbiAgLS1mcmFtZTtcbn1cblxuZnVuY3Rpb24gd2FrZSgpIHtcbiAgY2xvY2tOb3cgPSAoY2xvY2tMYXN0ID0gY2xvY2subm93KCkpICsgY2xvY2tTa2V3O1xuICBmcmFtZSA9IHRpbWVvdXQgPSAwO1xuICB0cnkge1xuICAgIHRpbWVyRmx1c2goKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBmcmFtZSA9IDA7XG4gICAgbmFwKCk7XG4gICAgY2xvY2tOb3cgPSAwO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBva2UoKSB7XG4gIHZhciBub3cgPSBjbG9jay5ub3coKSwgZGVsYXkgPSBub3cgLSBjbG9ja0xhc3Q7XG4gIGlmIChkZWxheSA+IHBva2VEZWxheSkgY2xvY2tTa2V3IC09IGRlbGF5LCBjbG9ja0xhc3QgPSBub3c7XG59XG5cbmZ1bmN0aW9uIG5hcCgpIHtcbiAgdmFyIHQwLCB0MSA9IHRhc2tIZWFkLCB0MiwgdGltZSA9IEluZmluaXR5O1xuICB3aGlsZSAodDEpIHtcbiAgICBpZiAodDEuX2NhbGwpIHtcbiAgICAgIGlmICh0aW1lID4gdDEuX3RpbWUpIHRpbWUgPSB0MS5fdGltZTtcbiAgICAgIHQwID0gdDEsIHQxID0gdDEuX25leHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQyID0gdDEuX25leHQsIHQxLl9uZXh0ID0gbnVsbDtcbiAgICAgIHQxID0gdDAgPyB0MC5fbmV4dCA9IHQyIDogdGFza0hlYWQgPSB0MjtcbiAgICB9XG4gIH1cbiAgdGFza1RhaWwgPSB0MDtcbiAgc2xlZXAodGltZSk7XG59XG5cbmZ1bmN0aW9uIHNsZWVwKHRpbWUpIHtcbiAgaWYgKGZyYW1lKSByZXR1cm47IC8vIFNvb25lc3QgYWxhcm0gYWxyZWFkeSBzZXQsIG9yIHdpbGwgYmUuXG4gIGlmICh0aW1lb3V0KSB0aW1lb3V0ID0gY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICB2YXIgZGVsYXkgPSB0aW1lIC0gY2xvY2tOb3c7IC8vIFN0cmljdGx5IGxlc3MgdGhhbiBpZiB3ZSByZWNvbXB1dGVkIGNsb2NrTm93LlxuICBpZiAoZGVsYXkgPiAyNCkge1xuICAgIGlmICh0aW1lIDwgSW5maW5pdHkpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KHdha2UsIHRpbWUgLSBjbG9jay5ub3coKSAtIGNsb2NrU2tldyk7XG4gICAgaWYgKGludGVydmFsKSBpbnRlcnZhbCA9IGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9IGVsc2Uge1xuICAgIGlmICghaW50ZXJ2YWwpIGNsb2NrTGFzdCA9IGNsb2NrLm5vdygpLCBpbnRlcnZhbCA9IHNldEludGVydmFsKHBva2UsIHBva2VEZWxheSk7XG4gICAgZnJhbWUgPSAxLCBzZXRGcmFtZSh3YWtlKTtcbiAgfVxufVxuIiwgImltcG9ydCB7VGltZXJ9IGZyb20gXCIuL3RpbWVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrLCBkZWxheSwgdGltZSkge1xuICB2YXIgdCA9IG5ldyBUaW1lcjtcbiAgZGVsYXkgPSBkZWxheSA9PSBudWxsID8gMCA6ICtkZWxheTtcbiAgdC5yZXN0YXJ0KGVsYXBzZWQgPT4ge1xuICAgIHQuc3RvcCgpO1xuICAgIGNhbGxiYWNrKGVsYXBzZWQgKyBkZWxheSk7XG4gIH0sIGRlbGF5LCB0aW1lKTtcbiAgcmV0dXJuIHQ7XG59XG4iLCAiaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5pbXBvcnQge3RpbWVyLCB0aW1lb3V0fSBmcm9tIFwiZDMtdGltZXJcIjtcblxudmFyIGVtcHR5T24gPSBkaXNwYXRjaChcInN0YXJ0XCIsIFwiZW5kXCIsIFwiY2FuY2VsXCIsIFwiaW50ZXJydXB0XCIpO1xudmFyIGVtcHR5VHdlZW4gPSBbXTtcblxuZXhwb3J0IHZhciBDUkVBVEVEID0gMDtcbmV4cG9ydCB2YXIgU0NIRURVTEVEID0gMTtcbmV4cG9ydCB2YXIgU1RBUlRJTkcgPSAyO1xuZXhwb3J0IHZhciBTVEFSVEVEID0gMztcbmV4cG9ydCB2YXIgUlVOTklORyA9IDQ7XG5leHBvcnQgdmFyIEVORElORyA9IDU7XG5leHBvcnQgdmFyIEVOREVEID0gNjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSwgbmFtZSwgaWQsIGluZGV4LCBncm91cCwgdGltaW5nKSB7XG4gIHZhciBzY2hlZHVsZXMgPSBub2RlLl9fdHJhbnNpdGlvbjtcbiAgaWYgKCFzY2hlZHVsZXMpIG5vZGUuX190cmFuc2l0aW9uID0ge307XG4gIGVsc2UgaWYgKGlkIGluIHNjaGVkdWxlcykgcmV0dXJuO1xuICBjcmVhdGUobm9kZSwgaWQsIHtcbiAgICBuYW1lOiBuYW1lLFxuICAgIGluZGV4OiBpbmRleCwgLy8gRm9yIGNvbnRleHQgZHVyaW5nIGNhbGxiYWNrLlxuICAgIGdyb3VwOiBncm91cCwgLy8gRm9yIGNvbnRleHQgZHVyaW5nIGNhbGxiYWNrLlxuICAgIG9uOiBlbXB0eU9uLFxuICAgIHR3ZWVuOiBlbXB0eVR3ZWVuLFxuICAgIHRpbWU6IHRpbWluZy50aW1lLFxuICAgIGRlbGF5OiB0aW1pbmcuZGVsYXksXG4gICAgZHVyYXRpb246IHRpbWluZy5kdXJhdGlvbixcbiAgICBlYXNlOiB0aW1pbmcuZWFzZSxcbiAgICB0aW1lcjogbnVsbCxcbiAgICBzdGF0ZTogQ1JFQVRFRFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQobm9kZSwgaWQpIHtcbiAgdmFyIHNjaGVkdWxlID0gZ2V0KG5vZGUsIGlkKTtcbiAgaWYgKHNjaGVkdWxlLnN0YXRlID4gQ1JFQVRFRCkgdGhyb3cgbmV3IEVycm9yKFwidG9vIGxhdGU7IGFscmVhZHkgc2NoZWR1bGVkXCIpO1xuICByZXR1cm4gc2NoZWR1bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXQobm9kZSwgaWQpIHtcbiAgdmFyIHNjaGVkdWxlID0gZ2V0KG5vZGUsIGlkKTtcbiAgaWYgKHNjaGVkdWxlLnN0YXRlID4gU1RBUlRFRCkgdGhyb3cgbmV3IEVycm9yKFwidG9vIGxhdGU7IGFscmVhZHkgcnVubmluZ1wiKTtcbiAgcmV0dXJuIHNjaGVkdWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG5vZGUsIGlkKSB7XG4gIHZhciBzY2hlZHVsZSA9IG5vZGUuX190cmFuc2l0aW9uO1xuICBpZiAoIXNjaGVkdWxlIHx8ICEoc2NoZWR1bGUgPSBzY2hlZHVsZVtpZF0pKSB0aHJvdyBuZXcgRXJyb3IoXCJ0cmFuc2l0aW9uIG5vdCBmb3VuZFwiKTtcbiAgcmV0dXJuIHNjaGVkdWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGUobm9kZSwgaWQsIHNlbGYpIHtcbiAgdmFyIHNjaGVkdWxlcyA9IG5vZGUuX190cmFuc2l0aW9uLFxuICAgICAgdHdlZW47XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2VsZiB0aW1lciB3aGVuIHRoZSB0cmFuc2l0aW9uIGlzIGNyZWF0ZWQuXG4gIC8vIE5vdGUgdGhlIGFjdHVhbCBkZWxheSBpcyBub3Qga25vd24gdW50aWwgdGhlIGZpcnN0IGNhbGxiYWNrIVxuICBzY2hlZHVsZXNbaWRdID0gc2VsZjtcbiAgc2VsZi50aW1lciA9IHRpbWVyKHNjaGVkdWxlLCAwLCBzZWxmLnRpbWUpO1xuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlKGVsYXBzZWQpIHtcbiAgICBzZWxmLnN0YXRlID0gU0NIRURVTEVEO1xuICAgIHNlbGYudGltZXIucmVzdGFydChzdGFydCwgc2VsZi5kZWxheSwgc2VsZi50aW1lKTtcblxuICAgIC8vIElmIHRoZSBlbGFwc2VkIGRlbGF5IGlzIGxlc3MgdGhhbiBvdXIgZmlyc3Qgc2xlZXAsIHN0YXJ0IGltbWVkaWF0ZWx5LlxuICAgIGlmIChzZWxmLmRlbGF5IDw9IGVsYXBzZWQpIHN0YXJ0KGVsYXBzZWQgLSBzZWxmLmRlbGF5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0KGVsYXBzZWQpIHtcbiAgICB2YXIgaSwgaiwgbiwgbztcblxuICAgIC8vIElmIHRoZSBzdGF0ZSBpcyBub3QgU0NIRURVTEVELCB0aGVuIHdlIHByZXZpb3VzbHkgZXJyb3JlZCBvbiBzdGFydC5cbiAgICBpZiAoc2VsZi5zdGF0ZSAhPT0gU0NIRURVTEVEKSByZXR1cm4gc3RvcCgpO1xuXG4gICAgZm9yIChpIGluIHNjaGVkdWxlcykge1xuICAgICAgbyA9IHNjaGVkdWxlc1tpXTtcbiAgICAgIGlmIChvLm5hbWUgIT09IHNlbGYubmFtZSkgY29udGludWU7XG5cbiAgICAgIC8vIFdoaWxlIHRoaXMgZWxlbWVudCBhbHJlYWR5IGhhcyBhIHN0YXJ0aW5nIHRyYW5zaXRpb24gZHVyaW5nIHRoaXMgZnJhbWUsXG4gICAgICAvLyBkZWZlciBzdGFydGluZyBhbiBpbnRlcnJ1cHRpbmcgdHJhbnNpdGlvbiB1bnRpbCB0aGF0IHRyYW5zaXRpb24gaGFzIGFcbiAgICAgIC8vIGNoYW5jZSB0byB0aWNrIChhbmQgcG9zc2libHkgZW5kKTsgc2VlIGQzL2QzLXRyYW5zaXRpb24jNTQhXG4gICAgICBpZiAoby5zdGF0ZSA9PT0gU1RBUlRFRCkgcmV0dXJuIHRpbWVvdXQoc3RhcnQpO1xuXG4gICAgICAvLyBJbnRlcnJ1cHQgdGhlIGFjdGl2ZSB0cmFuc2l0aW9uLCBpZiBhbnkuXG4gICAgICBpZiAoby5zdGF0ZSA9PT0gUlVOTklORykge1xuICAgICAgICBvLnN0YXRlID0gRU5ERUQ7XG4gICAgICAgIG8udGltZXIuc3RvcCgpO1xuICAgICAgICBvLm9uLmNhbGwoXCJpbnRlcnJ1cHRcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgby5pbmRleCwgby5ncm91cCk7XG4gICAgICAgIGRlbGV0ZSBzY2hlZHVsZXNbaV07XG4gICAgICB9XG5cbiAgICAgIC8vIENhbmNlbCBhbnkgcHJlLWVtcHRlZCB0cmFuc2l0aW9ucy5cbiAgICAgIGVsc2UgaWYgKCtpIDwgaWQpIHtcbiAgICAgICAgby5zdGF0ZSA9IEVOREVEO1xuICAgICAgICBvLnRpbWVyLnN0b3AoKTtcbiAgICAgICAgby5vbi5jYWxsKFwiY2FuY2VsXCIsIG5vZGUsIG5vZGUuX19kYXRhX18sIG8uaW5kZXgsIG8uZ3JvdXApO1xuICAgICAgICBkZWxldGUgc2NoZWR1bGVzW2ldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERlZmVyIHRoZSBmaXJzdCB0aWNrIHRvIGVuZCBvZiB0aGUgY3VycmVudCBmcmFtZTsgc2VlIGQzL2QzIzE1NzYuXG4gICAgLy8gTm90ZSB0aGUgdHJhbnNpdGlvbiBtYXkgYmUgY2FuY2VsZWQgYWZ0ZXIgc3RhcnQgYW5kIGJlZm9yZSB0aGUgZmlyc3QgdGljayFcbiAgICAvLyBOb3RlIHRoaXMgbXVzdCBiZSBzY2hlZHVsZWQgYmVmb3JlIHRoZSBzdGFydCBldmVudDsgc2VlIGQzL2QzLXRyYW5zaXRpb24jMTYhXG4gICAgLy8gQXNzdW1pbmcgdGhpcyBpcyBzdWNjZXNzZnVsLCBzdWJzZXF1ZW50IGNhbGxiYWNrcyBnbyBzdHJhaWdodCB0byB0aWNrLlxuICAgIHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gU1RBUlRFRCkge1xuICAgICAgICBzZWxmLnN0YXRlID0gUlVOTklORztcbiAgICAgICAgc2VsZi50aW1lci5yZXN0YXJ0KHRpY2ssIHNlbGYuZGVsYXksIHNlbGYudGltZSk7XG4gICAgICAgIHRpY2soZWxhcHNlZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEaXNwYXRjaCB0aGUgc3RhcnQgZXZlbnQuXG4gICAgLy8gTm90ZSB0aGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdGhlIHR3ZWVuIGFyZSBpbml0aWFsaXplZC5cbiAgICBzZWxmLnN0YXRlID0gU1RBUlRJTkc7XG4gICAgc2VsZi5vbi5jYWxsKFwic3RhcnRcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgc2VsZi5pbmRleCwgc2VsZi5ncm91cCk7XG4gICAgaWYgKHNlbGYuc3RhdGUgIT09IFNUQVJUSU5HKSByZXR1cm47IC8vIGludGVycnVwdGVkXG4gICAgc2VsZi5zdGF0ZSA9IFNUQVJURUQ7XG5cbiAgICAvLyBJbml0aWFsaXplIHRoZSB0d2VlbiwgZGVsZXRpbmcgbnVsbCB0d2Vlbi5cbiAgICB0d2VlbiA9IG5ldyBBcnJheShuID0gc2VsZi50d2Vlbi5sZW5ndGgpO1xuICAgIGZvciAoaSA9IDAsIGogPSAtMTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG8gPSBzZWxmLnR3ZWVuW2ldLnZhbHVlLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgc2VsZi5pbmRleCwgc2VsZi5ncm91cCkpIHtcbiAgICAgICAgdHdlZW5bKytqXSA9IG87XG4gICAgICB9XG4gICAgfVxuICAgIHR3ZWVuLmxlbmd0aCA9IGogKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gdGljayhlbGFwc2VkKSB7XG4gICAgdmFyIHQgPSBlbGFwc2VkIDwgc2VsZi5kdXJhdGlvbiA/IHNlbGYuZWFzZS5jYWxsKG51bGwsIGVsYXBzZWQgLyBzZWxmLmR1cmF0aW9uKSA6IChzZWxmLnRpbWVyLnJlc3RhcnQoc3RvcCksIHNlbGYuc3RhdGUgPSBFTkRJTkcsIDEpLFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIG4gPSB0d2Vlbi5sZW5ndGg7XG5cbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgdHdlZW5baV0uY2FsbChub2RlLCB0KTtcbiAgICB9XG5cbiAgICAvLyBEaXNwYXRjaCB0aGUgZW5kIGV2ZW50LlxuICAgIGlmIChzZWxmLnN0YXRlID09PSBFTkRJTkcpIHtcbiAgICAgIHNlbGYub24uY2FsbChcImVuZFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBzZWxmLmluZGV4LCBzZWxmLmdyb3VwKTtcbiAgICAgIHN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgIHNlbGYuc3RhdGUgPSBFTkRFRDtcbiAgICBzZWxmLnRpbWVyLnN0b3AoKTtcbiAgICBkZWxldGUgc2NoZWR1bGVzW2lkXTtcbiAgICBmb3IgKHZhciBpIGluIHNjaGVkdWxlcykgcmV0dXJuOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgZGVsZXRlIG5vZGUuX190cmFuc2l0aW9uO1xuICB9XG59XG4iLCAiaW1wb3J0IHtTVEFSVElORywgRU5ESU5HLCBFTkRFRH0gZnJvbSBcIi4vdHJhbnNpdGlvbi9zY2hlZHVsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2RlLCBuYW1lKSB7XG4gIHZhciBzY2hlZHVsZXMgPSBub2RlLl9fdHJhbnNpdGlvbixcbiAgICAgIHNjaGVkdWxlLFxuICAgICAgYWN0aXZlLFxuICAgICAgZW1wdHkgPSB0cnVlLFxuICAgICAgaTtcblxuICBpZiAoIXNjaGVkdWxlcykgcmV0dXJuO1xuXG4gIG5hbWUgPSBuYW1lID09IG51bGwgPyBudWxsIDogbmFtZSArIFwiXCI7XG5cbiAgZm9yIChpIGluIHNjaGVkdWxlcykge1xuICAgIGlmICgoc2NoZWR1bGUgPSBzY2hlZHVsZXNbaV0pLm5hbWUgIT09IG5hbWUpIHsgZW1wdHkgPSBmYWxzZTsgY29udGludWU7IH1cbiAgICBhY3RpdmUgPSBzY2hlZHVsZS5zdGF0ZSA+IFNUQVJUSU5HICYmIHNjaGVkdWxlLnN0YXRlIDwgRU5ESU5HO1xuICAgIHNjaGVkdWxlLnN0YXRlID0gRU5ERUQ7XG4gICAgc2NoZWR1bGUudGltZXIuc3RvcCgpO1xuICAgIHNjaGVkdWxlLm9uLmNhbGwoYWN0aXZlID8gXCJpbnRlcnJ1cHRcIiA6IFwiY2FuY2VsXCIsIG5vZGUsIG5vZGUuX19kYXRhX18sIHNjaGVkdWxlLmluZGV4LCBzY2hlZHVsZS5ncm91cCk7XG4gICAgZGVsZXRlIHNjaGVkdWxlc1tpXTtcbiAgfVxuXG4gIGlmIChlbXB0eSkgZGVsZXRlIG5vZGUuX190cmFuc2l0aW9uO1xufVxuIiwgImltcG9ydCBpbnRlcnJ1cHQgZnJvbSBcIi4uL2ludGVycnVwdC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgaW50ZXJydXB0KHRoaXMsIG5hbWUpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQge2dldCwgc2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiB0d2VlblJlbW92ZShpZCwgbmFtZSkge1xuICB2YXIgdHdlZW4wLCB0d2VlbjE7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NoZWR1bGUgPSBzZXQodGhpcywgaWQpLFxuICAgICAgICB0d2VlbiA9IHNjaGVkdWxlLnR3ZWVuO1xuXG4gICAgLy8gSWYgdGhpcyBub2RlIHNoYXJlZCB0d2VlbiB3aXRoIHRoZSBwcmV2aW91cyBub2RlLFxuICAgIC8vIGp1c3QgYXNzaWduIHRoZSB1cGRhdGVkIHNoYXJlZCB0d2VlbiBhbmQgd2VcdTIwMTlyZSBkb25lIVxuICAgIC8vIE90aGVyd2lzZSwgY29weS1vbi13cml0ZS5cbiAgICBpZiAodHdlZW4gIT09IHR3ZWVuMCkge1xuICAgICAgdHdlZW4xID0gdHdlZW4wID0gdHdlZW47XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHR3ZWVuMS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKHR3ZWVuMVtpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgdHdlZW4xID0gdHdlZW4xLnNsaWNlKCk7XG4gICAgICAgICAgdHdlZW4xLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHNjaGVkdWxlLnR3ZWVuID0gdHdlZW4xO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0d2VlbkZ1bmN0aW9uKGlkLCBuYW1lLCB2YWx1ZSkge1xuICB2YXIgdHdlZW4wLCB0d2VlbjE7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjaGVkdWxlID0gc2V0KHRoaXMsIGlkKSxcbiAgICAgICAgdHdlZW4gPSBzY2hlZHVsZS50d2VlbjtcblxuICAgIC8vIElmIHRoaXMgbm9kZSBzaGFyZWQgdHdlZW4gd2l0aCB0aGUgcHJldmlvdXMgbm9kZSxcbiAgICAvLyBqdXN0IGFzc2lnbiB0aGUgdXBkYXRlZCBzaGFyZWQgdHdlZW4gYW5kIHdlXHUyMDE5cmUgZG9uZSFcbiAgICAvLyBPdGhlcndpc2UsIGNvcHktb24td3JpdGUuXG4gICAgaWYgKHR3ZWVuICE9PSB0d2VlbjApIHtcbiAgICAgIHR3ZWVuMSA9ICh0d2VlbjAgPSB0d2Vlbikuc2xpY2UoKTtcbiAgICAgIGZvciAodmFyIHQgPSB7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSwgaSA9IDAsIG4gPSB0d2VlbjEubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICh0d2VlbjFbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHR3ZWVuMVtpXSA9IHQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpID09PSBuKSB0d2VlbjEucHVzaCh0KTtcbiAgICB9XG5cbiAgICBzY2hlZHVsZS50d2VlbiA9IHR3ZWVuMTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGlkID0gdGhpcy5faWQ7XG5cbiAgbmFtZSArPSBcIlwiO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciB0d2VlbiA9IGdldCh0aGlzLm5vZGUoKSwgaWQpLnR3ZWVuO1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gdHdlZW4ubGVuZ3RoLCB0OyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKHQgPSB0d2VlbltpXSkubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gdC52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsID8gdHdlZW5SZW1vdmUgOiB0d2VlbkZ1bmN0aW9uKShpZCwgbmFtZSwgdmFsdWUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHR3ZWVuVmFsdWUodHJhbnNpdGlvbiwgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIGlkID0gdHJhbnNpdGlvbi5faWQ7XG5cbiAgdHJhbnNpdGlvbi5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlZHVsZSA9IHNldCh0aGlzLCBpZCk7XG4gICAgKHNjaGVkdWxlLnZhbHVlIHx8IChzY2hlZHVsZS52YWx1ZSA9IHt9KSlbbmFtZV0gPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIHJldHVybiBnZXQobm9kZSwgaWQpLnZhbHVlW25hbWVdO1xuICB9O1xufVxuIiwgImltcG9ydCB7Y29sb3J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IHtpbnRlcnBvbGF0ZU51bWJlciwgaW50ZXJwb2xhdGVSZ2IsIGludGVycG9sYXRlU3RyaW5nfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgYztcbiAgcmV0dXJuICh0eXBlb2YgYiA9PT0gXCJudW1iZXJcIiA/IGludGVycG9sYXRlTnVtYmVyXG4gICAgICA6IGIgaW5zdGFuY2VvZiBjb2xvciA/IGludGVycG9sYXRlUmdiXG4gICAgICA6IChjID0gY29sb3IoYikpID8gKGIgPSBjLCBpbnRlcnBvbGF0ZVJnYilcbiAgICAgIDogaW50ZXJwb2xhdGVTdHJpbmcpKGEsIGIpO1xufVxuIiwgImltcG9ydCB7aW50ZXJwb2xhdGVUcmFuc2Zvcm1TdmcgYXMgaW50ZXJwb2xhdGVUcmFuc2Zvcm19IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IHtuYW1lc3BhY2V9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7dHdlZW5WYWx1ZX0gZnJvbSBcIi4vdHdlZW4uanNcIjtcbmltcG9ydCBpbnRlcnBvbGF0ZSBmcm9tIFwiLi9pbnRlcnBvbGF0ZS5qc1wiO1xuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlKG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyUmVtb3ZlTlMoZnVsbG5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50KG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZTEpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCIsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnROUyhmdWxsbmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlMSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIixcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwID0gdGhpcy5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb24obmFtZSwgaW50ZXJwb2xhdGUsIHZhbHVlKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEwLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAsIHZhbHVlMSA9IHZhbHVlKHRoaXMpLCBzdHJpbmcxO1xuICAgIGlmICh2YWx1ZTEgPT0gbnVsbCkgcmV0dXJuIHZvaWQgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgc3RyaW5nMCA9IHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwICYmIHN0cmluZzEgPT09IHN0cmluZzEwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogKHN0cmluZzEwID0gc3RyaW5nMSwgaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uTlMoZnVsbG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxMCxcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwLCB2YWx1ZTEgPSB2YWx1ZSh0aGlzKSwgc3RyaW5nMTtcbiAgICBpZiAodmFsdWUxID09IG51bGwpIHJldHVybiB2b2lkIHRoaXMucmVtb3ZlQXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBzdHJpbmcwID0gdGhpcy5nZXRBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwICYmIHN0cmluZzEgPT09IHN0cmluZzEwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogKHN0cmluZzEwID0gc3RyaW5nMSwgaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpLCBpID0gZnVsbG5hbWUgPT09IFwidHJhbnNmb3JtXCIgPyBpbnRlcnBvbGF0ZVRyYW5zZm9ybSA6IGludGVycG9sYXRlO1xuICByZXR1cm4gdGhpcy5hdHRyVHdlZW4obmFtZSwgdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pKGZ1bGxuYW1lLCBpLCB0d2VlblZhbHVlKHRoaXMsIFwiYXR0ci5cIiArIG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdmFsdWUgPT0gbnVsbCA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJSZW1vdmVOUyA6IGF0dHJSZW1vdmUpKGZ1bGxuYW1lKVxuICAgICAgOiAoZnVsbG5hbWUubG9jYWwgPyBhdHRyQ29uc3RhbnROUyA6IGF0dHJDb25zdGFudCkoZnVsbG5hbWUsIGksIHZhbHVlKSk7XG59XG4iLCAiaW1wb3J0IHtuYW1lc3BhY2V9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcblxuZnVuY3Rpb24gYXR0ckludGVycG9sYXRlKG5hbWUsIGkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBpLmNhbGwodGhpcywgdCkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRySW50ZXJwb2xhdGVOUyhmdWxsbmFtZSwgaSkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsLCBpLmNhbGwodGhpcywgdCkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyVHdlZW5OUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgdmFyIHQwLCBpMDtcbiAgZnVuY3Rpb24gdHdlZW4oKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChpICE9PSBpMCkgdDAgPSAoaTAgPSBpKSAmJiBhdHRySW50ZXJwb2xhdGVOUyhmdWxsbmFtZSwgaSk7XG4gICAgcmV0dXJuIHQwO1xuICB9XG4gIHR3ZWVuLl92YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gdHdlZW47XG59XG5cbmZ1bmN0aW9uIGF0dHJUd2VlbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgdDAsIGkwO1xuICBmdW5jdGlvbiB0d2VlbigpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGkgIT09IGkwKSB0MCA9IChpMCA9IGkpICYmIGF0dHJJbnRlcnBvbGF0ZShuYW1lLCBpKTtcbiAgICByZXR1cm4gdDA7XG4gIH1cbiAgdHdlZW4uX3ZhbHVlID0gdmFsdWU7XG4gIHJldHVybiB0d2Vlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdmFyIGtleSA9IFwiYXR0ci5cIiArIG5hbWU7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIChrZXkgPSB0aGlzLnR3ZWVuKGtleSkpICYmIGtleS5fdmFsdWU7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdGhpcy50d2VlbihrZXksIG51bGwpO1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gdGhpcy50d2VlbihrZXksIChmdWxsbmFtZS5sb2NhbCA/IGF0dHJUd2Vlbk5TIDogYXR0clR3ZWVuKShmdWxsbmFtZSwgdmFsdWUpKTtcbn1cbiIsICJpbXBvcnQge2dldCwgaW5pdH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gZGVsYXlGdW5jdGlvbihpZCwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGluaXQodGhpcywgaWQpLmRlbGF5ID0gK3ZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlbGF5Q29uc3RhbnQoaWQsIHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9ICt2YWx1ZSwgZnVuY3Rpb24oKSB7XG4gICAgaW5pdCh0aGlzLCBpZCkuZGVsYXkgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIGlkID0gdGhpcy5faWQ7XG5cbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gZGVsYXlGdW5jdGlvblxuICAgICAgICAgIDogZGVsYXlDb25zdGFudCkoaWQsIHZhbHVlKSlcbiAgICAgIDogZ2V0KHRoaXMubm9kZSgpLCBpZCkuZGVsYXk7XG59XG4iLCAiaW1wb3J0IHtnZXQsIHNldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gZHVyYXRpb25GdW5jdGlvbihpZCwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHNldCh0aGlzLCBpZCkuZHVyYXRpb24gPSArdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZHVyYXRpb25Db25zdGFudChpZCwgdmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID0gK3ZhbHVlLCBmdW5jdGlvbigpIHtcbiAgICBzZXQodGhpcywgaWQpLmR1cmF0aW9uID0gdmFsdWU7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBpZCA9IHRoaXMuX2lkO1xuXG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGR1cmF0aW9uRnVuY3Rpb25cbiAgICAgICAgICA6IGR1cmF0aW9uQ29uc3RhbnQpKGlkLCB2YWx1ZSkpXG4gICAgICA6IGdldCh0aGlzLm5vZGUoKSwgaWQpLmR1cmF0aW9uO1xufVxuIiwgImltcG9ydCB7Z2V0LCBzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIGVhc2VDb25zdGFudChpZCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBzZXQodGhpcywgaWQpLmVhc2UgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIGlkID0gdGhpcy5faWQ7XG5cbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKGVhc2VDb25zdGFudChpZCwgdmFsdWUpKVxuICAgICAgOiBnZXQodGhpcy5ub2RlKCksIGlkKS5lYXNlO1xufVxuIiwgImltcG9ydCB7c2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiBlYXNlVmFyeWluZyhpZCwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodHlwZW9mIHYgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICAgIHNldCh0aGlzLCBpZCkuZWFzZSA9IHY7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICByZXR1cm4gdGhpcy5lYWNoKGVhc2VWYXJ5aW5nKHRoaXMuX2lkLCB2YWx1ZSkpO1xufVxuIiwgImltcG9ydCB7bWF0Y2hlcn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYXRjaCkge1xuICBpZiAodHlwZW9mIG1hdGNoICE9PSBcImZ1bmN0aW9uXCIpIG1hdGNoID0gbWF0Y2hlcihtYXRjaCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IFtdLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIG1hdGNoLmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSB7XG4gICAgICAgIHN1Ymdyb3VwLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cywgdGhpcy5fbmFtZSwgdGhpcy5faWQpO1xufVxuIiwgImltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICBpZiAodHJhbnNpdGlvbi5faWQgIT09IHRoaXMuX2lkKSB0aHJvdyBuZXcgRXJyb3I7XG5cbiAgZm9yICh2YXIgZ3JvdXBzMCA9IHRoaXMuX2dyb3VwcywgZ3JvdXBzMSA9IHRyYW5zaXRpb24uX2dyb3VwcywgbTAgPSBncm91cHMwLmxlbmd0aCwgbTEgPSBncm91cHMxLmxlbmd0aCwgbSA9IE1hdGgubWluKG0wLCBtMSksIG1lcmdlcyA9IG5ldyBBcnJheShtMCksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAwID0gZ3JvdXBzMFtqXSwgZ3JvdXAxID0gZ3JvdXBzMVtqXSwgbiA9IGdyb3VwMC5sZW5ndGgsIG1lcmdlID0gbWVyZ2VzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cDBbaV0gfHwgZ3JvdXAxW2ldKSB7XG4gICAgICAgIG1lcmdlW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKDsgaiA8IG0wOyArK2opIHtcbiAgICBtZXJnZXNbal0gPSBncm91cHMwW2pdO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cywgdGhpcy5fbmFtZSwgdGhpcy5faWQpO1xufVxuIiwgImltcG9ydCB7Z2V0LCBzZXQsIGluaXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIHN0YXJ0KG5hbWUpIHtcbiAgcmV0dXJuIChuYW1lICsgXCJcIikudHJpbSgpLnNwbGl0KC9efFxccysvKS5ldmVyeShmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiAhdCB8fCB0ID09PSBcInN0YXJ0XCI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvbkZ1bmN0aW9uKGlkLCBuYW1lLCBsaXN0ZW5lcikge1xuICB2YXIgb24wLCBvbjEsIHNpdCA9IHN0YXJ0KG5hbWUpID8gaW5pdCA6IHNldDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlZHVsZSA9IHNpdCh0aGlzLCBpZCksXG4gICAgICAgIG9uID0gc2NoZWR1bGUub247XG5cbiAgICAvLyBJZiB0aGlzIG5vZGUgc2hhcmVkIGEgZGlzcGF0Y2ggd2l0aCB0aGUgcHJldmlvdXMgbm9kZSxcbiAgICAvLyBqdXN0IGFzc2lnbiB0aGUgdXBkYXRlZCBzaGFyZWQgZGlzcGF0Y2ggYW5kIHdlXHUyMDE5cmUgZG9uZSFcbiAgICAvLyBPdGhlcndpc2UsIGNvcHktb24td3JpdGUuXG4gICAgaWYgKG9uICE9PSBvbjApIChvbjEgPSAob24wID0gb24pLmNvcHkoKSkub24obmFtZSwgbGlzdGVuZXIpO1xuXG4gICAgc2NoZWR1bGUub24gPSBvbjE7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKSB7XG4gIHZhciBpZCA9IHRoaXMuX2lkO1xuXG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMlxuICAgICAgPyBnZXQodGhpcy5ub2RlKCksIGlkKS5vbi5vbihuYW1lKVxuICAgICAgOiB0aGlzLmVhY2gob25GdW5jdGlvbihpZCwgbmFtZSwgbGlzdGVuZXIpKTtcbn1cbiIsICJmdW5jdGlvbiByZW1vdmVGdW5jdGlvbihpZCkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50Tm9kZTtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMuX190cmFuc2l0aW9uKSBpZiAoK2kgIT09IGlkKSByZXR1cm47XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub24oXCJlbmQucmVtb3ZlXCIsIHJlbW92ZUZ1bmN0aW9uKHRoaXMuX2lkKSk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3Rvcn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNjaGVkdWxlLCB7Z2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3QpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLl9uYW1lLFxuICAgICAgaWQgPSB0aGlzLl9pZDtcblxuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvcihzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIHN1Ym5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpKSB7XG4gICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIHN1Ymdyb3VwW2ldID0gc3Vibm9kZTtcbiAgICAgICAgc2NoZWR1bGUoc3ViZ3JvdXBbaV0sIG5hbWUsIGlkLCBpLCBzdWJncm91cCwgZ2V0KG5vZGUsIGlkKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cywgbmFtZSwgaWQpO1xufVxuIiwgImltcG9ydCB7c2VsZWN0b3JBbGx9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzY2hlZHVsZSwge2dldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIHZhciBuYW1lID0gdGhpcy5fbmFtZSxcbiAgICAgIGlkID0gdGhpcy5faWQ7XG5cbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBmb3IgKHZhciBjaGlsZHJlbiA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSwgY2hpbGQsIGluaGVyaXQgPSBnZXQobm9kZSwgaWQpLCBrID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgayA8IGw7ICsraykge1xuICAgICAgICAgIGlmIChjaGlsZCA9IGNoaWxkcmVuW2tdKSB7XG4gICAgICAgICAgICBzY2hlZHVsZShjaGlsZCwgbmFtZSwgaWQsIGssIGNoaWxkcmVuLCBpbmhlcml0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goY2hpbGRyZW4pO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKHN1Ymdyb3VwcywgcGFyZW50cywgbmFtZSwgaWQpO1xufVxuIiwgImltcG9ydCB7c2VsZWN0aW9ufSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5cbnZhciBTZWxlY3Rpb24gPSBzZWxlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24odGhpcy5fZ3JvdXBzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJpbXBvcnQge2ludGVycG9sYXRlVHJhbnNmb3JtQ3NzIGFzIGludGVycG9sYXRlVHJhbnNmb3JtfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7c3R5bGV9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7c2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuaW1wb3J0IHt0d2VlblZhbHVlfSBmcm9tIFwiLi90d2Vlbi5qc1wiO1xuaW1wb3J0IGludGVycG9sYXRlIGZyb20gXCIuL2ludGVycG9sYXRlLmpzXCI7XG5cbmZ1bmN0aW9uIHN0eWxlTnVsbChuYW1lLCBpbnRlcnBvbGF0ZSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxMCxcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwID0gc3R5bGUodGhpcywgbmFtZSksXG4gICAgICAgIHN0cmluZzEgPSAodGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKSwgc3R5bGUodGhpcywgbmFtZSkpO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwICYmIHN0cmluZzEgPT09IHN0cmluZzEwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCBzdHJpbmcxMCA9IHN0cmluZzEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZTEpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCIsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCA9IHN0eWxlKHRoaXMsIG5hbWUpO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxMCxcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwID0gc3R5bGUodGhpcywgbmFtZSksXG4gICAgICAgIHZhbHVlMSA9IHZhbHVlKHRoaXMpLFxuICAgICAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIjtcbiAgICBpZiAodmFsdWUxID09IG51bGwpIHN0cmluZzEgPSB2YWx1ZTEgPSAodGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKSwgc3R5bGUodGhpcywgbmFtZSkpO1xuICAgIHJldHVybiBzdHJpbmcwID09PSBzdHJpbmcxID8gbnVsbFxuICAgICAgICA6IHN0cmluZzAgPT09IHN0cmluZzAwICYmIHN0cmluZzEgPT09IHN0cmluZzEwID8gaW50ZXJwb2xhdGUwXG4gICAgICAgIDogKHN0cmluZzEwID0gc3RyaW5nMSwgaW50ZXJwb2xhdGUwID0gaW50ZXJwb2xhdGUoc3RyaW5nMDAgPSBzdHJpbmcwLCB2YWx1ZTEpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVNYXliZVJlbW92ZShpZCwgbmFtZSkge1xuICB2YXIgb24wLCBvbjEsIGxpc3RlbmVyMCwga2V5ID0gXCJzdHlsZS5cIiArIG5hbWUsIGV2ZW50ID0gXCJlbmQuXCIgKyBrZXksIHJlbW92ZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlZHVsZSA9IHNldCh0aGlzLCBpZCksXG4gICAgICAgIG9uID0gc2NoZWR1bGUub24sXG4gICAgICAgIGxpc3RlbmVyID0gc2NoZWR1bGUudmFsdWVba2V5XSA9PSBudWxsID8gcmVtb3ZlIHx8IChyZW1vdmUgPSBzdHlsZVJlbW92ZShuYW1lKSkgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBJZiB0aGlzIG5vZGUgc2hhcmVkIGEgZGlzcGF0Y2ggd2l0aCB0aGUgcHJldmlvdXMgbm9kZSxcbiAgICAvLyBqdXN0IGFzc2lnbiB0aGUgdXBkYXRlZCBzaGFyZWQgZGlzcGF0Y2ggYW5kIHdlXHUyMDE5cmUgZG9uZSFcbiAgICAvLyBPdGhlcndpc2UsIGNvcHktb24td3JpdGUuXG4gICAgaWYgKG9uICE9PSBvbjAgfHwgbGlzdGVuZXIwICE9PSBsaXN0ZW5lcikgKG9uMSA9IChvbjAgPSBvbikuY29weSgpKS5vbihldmVudCwgbGlzdGVuZXIwID0gbGlzdGVuZXIpO1xuXG4gICAgc2NoZWR1bGUub24gPSBvbjE7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICB2YXIgaSA9IChuYW1lICs9IFwiXCIpID09PSBcInRyYW5zZm9ybVwiID8gaW50ZXJwb2xhdGVUcmFuc2Zvcm0gOiBpbnRlcnBvbGF0ZTtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyB0aGlzXG4gICAgICAuc3R5bGVUd2VlbihuYW1lLCBzdHlsZU51bGwobmFtZSwgaSkpXG4gICAgICAub24oXCJlbmQuc3R5bGUuXCIgKyBuYW1lLCBzdHlsZVJlbW92ZShuYW1lKSlcbiAgICA6IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gdGhpc1xuICAgICAgLnN0eWxlVHdlZW4obmFtZSwgc3R5bGVGdW5jdGlvbihuYW1lLCBpLCB0d2VlblZhbHVlKHRoaXMsIFwic3R5bGUuXCIgKyBuYW1lLCB2YWx1ZSkpKVxuICAgICAgLmVhY2goc3R5bGVNYXliZVJlbW92ZSh0aGlzLl9pZCwgbmFtZSkpXG4gICAgOiB0aGlzXG4gICAgICAuc3R5bGVUd2VlbihuYW1lLCBzdHlsZUNvbnN0YW50KG5hbWUsIGksIHZhbHVlKSwgcHJpb3JpdHkpXG4gICAgICAub24oXCJlbmQuc3R5bGUuXCIgKyBuYW1lLCBudWxsKTtcbn1cbiIsICJmdW5jdGlvbiBzdHlsZUludGVycG9sYXRlKG5hbWUsIGksIHByaW9yaXR5KSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCBpLmNhbGwodGhpcywgdCksIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVUd2VlbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIHQsIGkwO1xuICBmdW5jdGlvbiB0d2VlbigpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGkgIT09IGkwKSB0ID0gKGkwID0gaSkgJiYgc3R5bGVJbnRlcnBvbGF0ZShuYW1lLCBpLCBwcmlvcml0eSk7XG4gICAgcmV0dXJuIHQ7XG4gIH1cbiAgdHdlZW4uX3ZhbHVlID0gdmFsdWU7XG4gIHJldHVybiB0d2Vlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciBrZXkgPSBcInN0eWxlLlwiICsgKG5hbWUgKz0gXCJcIik7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgcmV0dXJuIChrZXkgPSB0aGlzLnR3ZWVuKGtleSkpICYmIGtleS5fdmFsdWU7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdGhpcy50d2VlbihrZXksIG51bGwpO1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCBzdHlsZVR3ZWVuKG5hbWUsIHZhbHVlLCBwcmlvcml0eSA9PSBudWxsID8gXCJcIiA6IHByaW9yaXR5KSk7XG59XG4iLCAiaW1wb3J0IHt0d2VlblZhbHVlfSBmcm9tIFwiLi90d2Vlbi5qc1wiO1xuXG5mdW5jdGlvbiB0ZXh0Q29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUxID0gdmFsdWUodGhpcyk7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IHZhbHVlMSA9PSBudWxsID8gXCJcIiA6IHZhbHVlMTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMudHdlZW4oXCJ0ZXh0XCIsIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IHRleHRGdW5jdGlvbih0d2VlblZhbHVlKHRoaXMsIFwidGV4dFwiLCB2YWx1ZSkpXG4gICAgICA6IHRleHRDb25zdGFudCh2YWx1ZSA9PSBudWxsID8gXCJcIiA6IHZhbHVlICsgXCJcIikpO1xufVxuIiwgImZ1bmN0aW9uIHRleHRJbnRlcnBvbGF0ZShpKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdGhpcy50ZXh0Q29udGVudCA9IGkuY2FsbCh0aGlzLCB0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dFR3ZWVuKHZhbHVlKSB7XG4gIHZhciB0MCwgaTA7XG4gIGZ1bmN0aW9uIHR3ZWVuKCkge1xuICAgIHZhciBpID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoaSAhPT0gaTApIHQwID0gKGkwID0gaSkgJiYgdGV4dEludGVycG9sYXRlKGkpO1xuICAgIHJldHVybiB0MDtcbiAgfVxuICB0d2Vlbi5fdmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHR3ZWVuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIga2V5ID0gXCJ0ZXh0XCI7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgcmV0dXJuIChrZXkgPSB0aGlzLnR3ZWVuKGtleSkpICYmIGtleS5fdmFsdWU7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gdGhpcy50d2VlbihrZXksIG51bGwpO1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCB0ZXh0VHdlZW4odmFsdWUpKTtcbn1cbiIsICJpbXBvcnQge1RyYW5zaXRpb24sIG5ld0lkfSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHNjaGVkdWxlLCB7Z2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIG5hbWUgPSB0aGlzLl9uYW1lLFxuICAgICAgaWQwID0gdGhpcy5faWQsXG4gICAgICBpZDEgPSBuZXdJZCgpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICAgIHZhciBpbmhlcml0ID0gZ2V0KG5vZGUsIGlkMCk7XG4gICAgICAgIHNjaGVkdWxlKG5vZGUsIG5hbWUsIGlkMSwgaSwgZ3JvdXAsIHtcbiAgICAgICAgICB0aW1lOiBpbmhlcml0LnRpbWUgKyBpbmhlcml0LmRlbGF5ICsgaW5oZXJpdC5kdXJhdGlvbixcbiAgICAgICAgICBkZWxheTogMCxcbiAgICAgICAgICBkdXJhdGlvbjogaW5oZXJpdC5kdXJhdGlvbixcbiAgICAgICAgICBlYXNlOiBpbmhlcml0LmVhc2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKGdyb3VwcywgdGhpcy5fcGFyZW50cywgbmFtZSwgaWQxKTtcbn1cbiIsICJpbXBvcnQge3NldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBvbjAsIG9uMSwgdGhhdCA9IHRoaXMsIGlkID0gdGhhdC5faWQsIHNpemUgPSB0aGF0LnNpemUoKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciBjYW5jZWwgPSB7dmFsdWU6IHJlamVjdH0sXG4gICAgICAgIGVuZCA9IHt2YWx1ZTogZnVuY3Rpb24oKSB7IGlmICgtLXNpemUgPT09IDApIHJlc29sdmUoKTsgfX07XG5cbiAgICB0aGF0LmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2NoZWR1bGUgPSBzZXQodGhpcywgaWQpLFxuICAgICAgICAgIG9uID0gc2NoZWR1bGUub247XG5cbiAgICAgIC8vIElmIHRoaXMgbm9kZSBzaGFyZWQgYSBkaXNwYXRjaCB3aXRoIHRoZSBwcmV2aW91cyBub2RlLFxuICAgICAgLy8ganVzdCBhc3NpZ24gdGhlIHVwZGF0ZWQgc2hhcmVkIGRpc3BhdGNoIGFuZCB3ZVx1MjAxOXJlIGRvbmUhXG4gICAgICAvLyBPdGhlcndpc2UsIGNvcHktb24td3JpdGUuXG4gICAgICBpZiAob24gIT09IG9uMCkge1xuICAgICAgICBvbjEgPSAob24wID0gb24pLmNvcHkoKTtcbiAgICAgICAgb24xLl8uY2FuY2VsLnB1c2goY2FuY2VsKTtcbiAgICAgICAgb24xLl8uaW50ZXJydXB0LnB1c2goY2FuY2VsKTtcbiAgICAgICAgb24xLl8uZW5kLnB1c2goZW5kKTtcbiAgICAgIH1cblxuICAgICAgc2NoZWR1bGUub24gPSBvbjE7XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgc2VsZWN0aW9uIHdhcyBlbXB0eSwgcmVzb2x2ZSBlbmQgaW1tZWRpYXRlbHlcbiAgICBpZiAoc2l6ZSA9PT0gMCkgcmVzb2x2ZSgpO1xuICB9KTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdGlvbn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHRyYW5zaXRpb25fYXR0ciBmcm9tIFwiLi9hdHRyLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9hdHRyVHdlZW4gZnJvbSBcIi4vYXR0clR3ZWVuLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9kZWxheSBmcm9tIFwiLi9kZWxheS5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZHVyYXRpb24gZnJvbSBcIi4vZHVyYXRpb24uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2Vhc2UgZnJvbSBcIi4vZWFzZS5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZWFzZVZhcnlpbmcgZnJvbSBcIi4vZWFzZVZhcnlpbmcuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2ZpbHRlciBmcm9tIFwiLi9maWx0ZXIuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX21lcmdlIGZyb20gXCIuL21lcmdlLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9vbiBmcm9tIFwiLi9vbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fcmVtb3ZlIGZyb20gXCIuL3JlbW92ZS5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fc2VsZWN0IGZyb20gXCIuL3NlbGVjdC5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fc2VsZWN0QWxsIGZyb20gXCIuL3NlbGVjdEFsbC5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fc2VsZWN0aW9uIGZyb20gXCIuL3NlbGVjdGlvbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fc3R5bGUgZnJvbSBcIi4vc3R5bGUuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3N0eWxlVHdlZW4gZnJvbSBcIi4vc3R5bGVUd2Vlbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fdGV4dCBmcm9tIFwiLi90ZXh0LmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl90ZXh0VHdlZW4gZnJvbSBcIi4vdGV4dFR3ZWVuLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl90cmFuc2l0aW9uIGZyb20gXCIuL3RyYW5zaXRpb24uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3R3ZWVuIGZyb20gXCIuL3R3ZWVuLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9lbmQgZnJvbSBcIi4vZW5kLmpzXCI7XG5cbnZhciBpZCA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBUcmFuc2l0aW9uKGdyb3VwcywgcGFyZW50cywgbmFtZSwgaWQpIHtcbiAgdGhpcy5fZ3JvdXBzID0gZ3JvdXBzO1xuICB0aGlzLl9wYXJlbnRzID0gcGFyZW50cztcbiAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIHRoaXMuX2lkID0gaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYW5zaXRpb24obmFtZSkge1xuICByZXR1cm4gc2VsZWN0aW9uKCkudHJhbnNpdGlvbihuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5ld0lkKCkge1xuICByZXR1cm4gKytpZDtcbn1cblxudmFyIHNlbGVjdGlvbl9wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlO1xuXG5UcmFuc2l0aW9uLnByb3RvdHlwZSA9IHRyYW5zaXRpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogVHJhbnNpdGlvbixcbiAgc2VsZWN0OiB0cmFuc2l0aW9uX3NlbGVjdCxcbiAgc2VsZWN0QWxsOiB0cmFuc2l0aW9uX3NlbGVjdEFsbCxcbiAgc2VsZWN0Q2hpbGQ6IHNlbGVjdGlvbl9wcm90b3R5cGUuc2VsZWN0Q2hpbGQsXG4gIHNlbGVjdENoaWxkcmVuOiBzZWxlY3Rpb25fcHJvdG90eXBlLnNlbGVjdENoaWxkcmVuLFxuICBmaWx0ZXI6IHRyYW5zaXRpb25fZmlsdGVyLFxuICBtZXJnZTogdHJhbnNpdGlvbl9tZXJnZSxcbiAgc2VsZWN0aW9uOiB0cmFuc2l0aW9uX3NlbGVjdGlvbixcbiAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbl90cmFuc2l0aW9uLFxuICBjYWxsOiBzZWxlY3Rpb25fcHJvdG90eXBlLmNhbGwsXG4gIG5vZGVzOiBzZWxlY3Rpb25fcHJvdG90eXBlLm5vZGVzLFxuICBub2RlOiBzZWxlY3Rpb25fcHJvdG90eXBlLm5vZGUsXG4gIHNpemU6IHNlbGVjdGlvbl9wcm90b3R5cGUuc2l6ZSxcbiAgZW1wdHk6IHNlbGVjdGlvbl9wcm90b3R5cGUuZW1wdHksXG4gIGVhY2g6IHNlbGVjdGlvbl9wcm90b3R5cGUuZWFjaCxcbiAgb246IHRyYW5zaXRpb25fb24sXG4gIGF0dHI6IHRyYW5zaXRpb25fYXR0cixcbiAgYXR0clR3ZWVuOiB0cmFuc2l0aW9uX2F0dHJUd2VlbixcbiAgc3R5bGU6IHRyYW5zaXRpb25fc3R5bGUsXG4gIHN0eWxlVHdlZW46IHRyYW5zaXRpb25fc3R5bGVUd2VlbixcbiAgdGV4dDogdHJhbnNpdGlvbl90ZXh0LFxuICB0ZXh0VHdlZW46IHRyYW5zaXRpb25fdGV4dFR3ZWVuLFxuICByZW1vdmU6IHRyYW5zaXRpb25fcmVtb3ZlLFxuICB0d2VlbjogdHJhbnNpdGlvbl90d2VlbixcbiAgZGVsYXk6IHRyYW5zaXRpb25fZGVsYXksXG4gIGR1cmF0aW9uOiB0cmFuc2l0aW9uX2R1cmF0aW9uLFxuICBlYXNlOiB0cmFuc2l0aW9uX2Vhc2UsXG4gIGVhc2VWYXJ5aW5nOiB0cmFuc2l0aW9uX2Vhc2VWYXJ5aW5nLFxuICBlbmQ6IHRyYW5zaXRpb25fZW5kLFxuICBbU3ltYm9sLml0ZXJhdG9yXTogc2VsZWN0aW9uX3Byb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdXG59O1xuIiwgImV4cG9ydCBmdW5jdGlvbiBjdWJpY0luKHQpIHtcbiAgcmV0dXJuIHQgKiB0ICogdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN1YmljT3V0KHQpIHtcbiAgcmV0dXJuIC0tdCAqIHQgKiB0ICsgMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN1YmljSW5PdXQodCkge1xuICByZXR1cm4gKCh0ICo9IDIpIDw9IDEgPyB0ICogdCAqIHQgOiAodCAtPSAyKSAqIHQgKiB0ICsgMikgLyAyO1xufVxuIiwgImltcG9ydCB7VHJhbnNpdGlvbiwgbmV3SWR9IGZyb20gXCIuLi90cmFuc2l0aW9uL2luZGV4LmpzXCI7XG5pbXBvcnQgc2NoZWR1bGUgZnJvbSBcIi4uL3RyYW5zaXRpb24vc2NoZWR1bGUuanNcIjtcbmltcG9ydCB7ZWFzZUN1YmljSW5PdXR9IGZyb20gXCJkMy1lYXNlXCI7XG5pbXBvcnQge25vd30gZnJvbSBcImQzLXRpbWVyXCI7XG5cbnZhciBkZWZhdWx0VGltaW5nID0ge1xuICB0aW1lOiBudWxsLCAvLyBTZXQgb24gdXNlLlxuICBkZWxheTogMCxcbiAgZHVyYXRpb246IDI1MCxcbiAgZWFzZTogZWFzZUN1YmljSW5PdXRcbn07XG5cbmZ1bmN0aW9uIGluaGVyaXQobm9kZSwgaWQpIHtcbiAgdmFyIHRpbWluZztcbiAgd2hpbGUgKCEodGltaW5nID0gbm9kZS5fX3RyYW5zaXRpb24pIHx8ICEodGltaW5nID0gdGltaW5nW2lkXSkpIHtcbiAgICBpZiAoIShub2RlID0gbm9kZS5wYXJlbnROb2RlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGB0cmFuc2l0aW9uICR7aWR9IG5vdCBmb3VuZGApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGltaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBpZCxcbiAgICAgIHRpbWluZztcblxuICBpZiAobmFtZSBpbnN0YW5jZW9mIFRyYW5zaXRpb24pIHtcbiAgICBpZCA9IG5hbWUuX2lkLCBuYW1lID0gbmFtZS5fbmFtZTtcbiAgfSBlbHNlIHtcbiAgICBpZCA9IG5ld0lkKCksICh0aW1pbmcgPSBkZWZhdWx0VGltaW5nKS50aW1lID0gbm93KCksIG5hbWUgPSBuYW1lID09IG51bGwgPyBudWxsIDogbmFtZSArIFwiXCI7XG4gIH1cblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzY2hlZHVsZShub2RlLCBuYW1lLCBpZCwgaSwgZ3JvdXAsIHRpbWluZyB8fCBpbmhlcml0KG5vZGUsIGlkKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBUcmFuc2l0aW9uKGdyb3VwcywgdGhpcy5fcGFyZW50cywgbmFtZSwgaWQpO1xufVxuIiwgImltcG9ydCB7c2VsZWN0aW9ufSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2ludGVycnVwdCBmcm9tIFwiLi9pbnRlcnJ1cHQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fdHJhbnNpdGlvbiBmcm9tIFwiLi90cmFuc2l0aW9uLmpzXCI7XG5cbnNlbGVjdGlvbi5wcm90b3R5cGUuaW50ZXJydXB0ID0gc2VsZWN0aW9uX2ludGVycnVwdDtcbnNlbGVjdGlvbi5wcm90b3R5cGUudHJhbnNpdGlvbiA9IHNlbGVjdGlvbl90cmFuc2l0aW9uO1xuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHtkcmFnRGlzYWJsZSwgZHJhZ0VuYWJsZX0gZnJvbSBcImQzLWRyYWdcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGV9IGZyb20gXCJkMy1pbnRlcnBvbGF0ZVwiO1xuaW1wb3J0IHtwb2ludGVyLCBzZWxlY3R9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7aW50ZXJydXB0fSBmcm9tIFwiZDMtdHJhbnNpdGlvblwiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgQnJ1c2hFdmVudCBmcm9tIFwiLi9ldmVudC5qc1wiO1xuaW1wb3J0IG5vZXZlbnQsIHtub3Byb3BhZ2F0aW9ufSBmcm9tIFwiLi9ub2V2ZW50LmpzXCI7XG5cbnZhciBNT0RFX0RSQUcgPSB7bmFtZTogXCJkcmFnXCJ9LFxuICAgIE1PREVfU1BBQ0UgPSB7bmFtZTogXCJzcGFjZVwifSxcbiAgICBNT0RFX0hBTkRMRSA9IHtuYW1lOiBcImhhbmRsZVwifSxcbiAgICBNT0RFX0NFTlRFUiA9IHtuYW1lOiBcImNlbnRlclwifTtcblxuY29uc3Qge2FicywgbWF4LCBtaW59ID0gTWF0aDtcblxuZnVuY3Rpb24gbnVtYmVyMShlKSB7XG4gIHJldHVybiBbK2VbMF0sICtlWzFdXTtcbn1cblxuZnVuY3Rpb24gbnVtYmVyMihlKSB7XG4gIHJldHVybiBbbnVtYmVyMShlWzBdKSwgbnVtYmVyMShlWzFdKV07XG59XG5cbnZhciBYID0ge1xuICBuYW1lOiBcInhcIixcbiAgaGFuZGxlczogW1wid1wiLCBcImVcIl0ubWFwKHR5cGUpLFxuICBpbnB1dDogZnVuY3Rpb24oeCwgZSkgeyByZXR1cm4geCA9PSBudWxsID8gbnVsbCA6IFtbK3hbMF0sIGVbMF1bMV1dLCBbK3hbMV0sIGVbMV1bMV1dXTsgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbih4eSkgeyByZXR1cm4geHkgJiYgW3h5WzBdWzBdLCB4eVsxXVswXV07IH1cbn07XG5cbnZhciBZID0ge1xuICBuYW1lOiBcInlcIixcbiAgaGFuZGxlczogW1wiblwiLCBcInNcIl0ubWFwKHR5cGUpLFxuICBpbnB1dDogZnVuY3Rpb24oeSwgZSkgeyByZXR1cm4geSA9PSBudWxsID8gbnVsbCA6IFtbZVswXVswXSwgK3lbMF1dLCBbZVsxXVswXSwgK3lbMV1dXTsgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbih4eSkgeyByZXR1cm4geHkgJiYgW3h5WzBdWzFdLCB4eVsxXVsxXV07IH1cbn07XG5cbnZhciBYWSA9IHtcbiAgbmFtZTogXCJ4eVwiLFxuICBoYW5kbGVzOiBbXCJuXCIsIFwid1wiLCBcImVcIiwgXCJzXCIsIFwibndcIiwgXCJuZVwiLCBcInN3XCIsIFwic2VcIl0ubWFwKHR5cGUpLFxuICBpbnB1dDogZnVuY3Rpb24oeHkpIHsgcmV0dXJuIHh5ID09IG51bGwgPyBudWxsIDogbnVtYmVyMih4eSk7IH0sXG4gIG91dHB1dDogZnVuY3Rpb24oeHkpIHsgcmV0dXJuIHh5OyB9XG59O1xuXG52YXIgY3Vyc29ycyA9IHtcbiAgb3ZlcmxheTogXCJjcm9zc2hhaXJcIixcbiAgc2VsZWN0aW9uOiBcIm1vdmVcIixcbiAgbjogXCJucy1yZXNpemVcIixcbiAgZTogXCJldy1yZXNpemVcIixcbiAgczogXCJucy1yZXNpemVcIixcbiAgdzogXCJldy1yZXNpemVcIixcbiAgbnc6IFwibndzZS1yZXNpemVcIixcbiAgbmU6IFwibmVzdy1yZXNpemVcIixcbiAgc2U6IFwibndzZS1yZXNpemVcIixcbiAgc3c6IFwibmVzdy1yZXNpemVcIlxufTtcblxudmFyIGZsaXBYID0ge1xuICBlOiBcIndcIixcbiAgdzogXCJlXCIsXG4gIG53OiBcIm5lXCIsXG4gIG5lOiBcIm53XCIsXG4gIHNlOiBcInN3XCIsXG4gIHN3OiBcInNlXCJcbn07XG5cbnZhciBmbGlwWSA9IHtcbiAgbjogXCJzXCIsXG4gIHM6IFwiblwiLFxuICBudzogXCJzd1wiLFxuICBuZTogXCJzZVwiLFxuICBzZTogXCJuZVwiLFxuICBzdzogXCJud1wiXG59O1xuXG52YXIgc2lnbnNYID0ge1xuICBvdmVybGF5OiArMSxcbiAgc2VsZWN0aW9uOiArMSxcbiAgbjogbnVsbCxcbiAgZTogKzEsXG4gIHM6IG51bGwsXG4gIHc6IC0xLFxuICBudzogLTEsXG4gIG5lOiArMSxcbiAgc2U6ICsxLFxuICBzdzogLTFcbn07XG5cbnZhciBzaWduc1kgPSB7XG4gIG92ZXJsYXk6ICsxLFxuICBzZWxlY3Rpb246ICsxLFxuICBuOiAtMSxcbiAgZTogbnVsbCxcbiAgczogKzEsXG4gIHc6IG51bGwsXG4gIG53OiAtMSxcbiAgbmU6IC0xLFxuICBzZTogKzEsXG4gIHN3OiArMVxufTtcblxuZnVuY3Rpb24gdHlwZSh0KSB7XG4gIHJldHVybiB7dHlwZTogdH07XG59XG5cbi8vIElnbm9yZSByaWdodC1jbGljaywgc2luY2UgdGhhdCBzaG91bGQgb3BlbiB0aGUgY29udGV4dCBtZW51LlxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlcihldmVudCkge1xuICByZXR1cm4gIWV2ZW50LmN0cmxLZXkgJiYgIWV2ZW50LmJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEV4dGVudCgpIHtcbiAgdmFyIHN2ZyA9IHRoaXMub3duZXJTVkdFbGVtZW50IHx8IHRoaXM7XG4gIGlmIChzdmcuaGFzQXR0cmlidXRlKFwidmlld0JveFwiKSkge1xuICAgIHN2ZyA9IHN2Zy52aWV3Qm94LmJhc2VWYWw7XG4gICAgcmV0dXJuIFtbc3ZnLngsIHN2Zy55XSwgW3N2Zy54ICsgc3ZnLndpZHRoLCBzdmcueSArIHN2Zy5oZWlnaHRdXTtcbiAgfVxuICByZXR1cm4gW1swLCAwXSwgW3N2Zy53aWR0aC5iYXNlVmFsLnZhbHVlLCBzdmcuaGVpZ2h0LmJhc2VWYWwudmFsdWVdXTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRvdWNoYWJsZSgpIHtcbiAgcmV0dXJuIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyB8fCAoXCJvbnRvdWNoc3RhcnRcIiBpbiB0aGlzKTtcbn1cblxuLy8gTGlrZSBkMy5sb2NhbCwgYnV0IHdpdGggdGhlIG5hbWUgXHUyMDFDX19icnVzaFx1MjAxRCByYXRoZXIgdGhhbiBhdXRvLWdlbmVyYXRlZC5cbmZ1bmN0aW9uIGxvY2FsKG5vZGUpIHtcbiAgd2hpbGUgKCFub2RlLl9fYnJ1c2gpIGlmICghKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpKSByZXR1cm47XG4gIHJldHVybiBub2RlLl9fYnJ1c2g7XG59XG5cbmZ1bmN0aW9uIGVtcHR5KGV4dGVudCkge1xuICByZXR1cm4gZXh0ZW50WzBdWzBdID09PSBleHRlbnRbMV1bMF1cbiAgICAgIHx8IGV4dGVudFswXVsxXSA9PT0gZXh0ZW50WzFdWzFdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJ1c2hTZWxlY3Rpb24obm9kZSkge1xuICB2YXIgc3RhdGUgPSBub2RlLl9fYnJ1c2g7XG4gIHJldHVybiBzdGF0ZSA/IHN0YXRlLmRpbS5vdXRwdXQoc3RhdGUuc2VsZWN0aW9uKSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBicnVzaFgoKSB7XG4gIHJldHVybiBicnVzaChYKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJydXNoWSgpIHtcbiAgcmV0dXJuIGJydXNoKFkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGJydXNoKFhZKTtcbn1cblxuZnVuY3Rpb24gYnJ1c2goZGltKSB7XG4gIHZhciBleHRlbnQgPSBkZWZhdWx0RXh0ZW50LFxuICAgICAgZmlsdGVyID0gZGVmYXVsdEZpbHRlcixcbiAgICAgIHRvdWNoYWJsZSA9IGRlZmF1bHRUb3VjaGFibGUsXG4gICAgICBrZXlzID0gdHJ1ZSxcbiAgICAgIGxpc3RlbmVycyA9IGRpc3BhdGNoKFwic3RhcnRcIiwgXCJicnVzaFwiLCBcImVuZFwiKSxcbiAgICAgIGhhbmRsZVNpemUgPSA2LFxuICAgICAgdG91Y2hlbmRpbmc7XG5cbiAgZnVuY3Rpb24gYnJ1c2goZ3JvdXApIHtcbiAgICB2YXIgb3ZlcmxheSA9IGdyb3VwXG4gICAgICAgIC5wcm9wZXJ0eShcIl9fYnJ1c2hcIiwgaW5pdGlhbGl6ZSlcbiAgICAgIC5zZWxlY3RBbGwoXCIub3ZlcmxheVwiKVxuICAgICAgLmRhdGEoW3R5cGUoXCJvdmVybGF5XCIpXSk7XG5cbiAgICBvdmVybGF5LmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwib3ZlcmxheVwiKVxuICAgICAgICAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpXG4gICAgICAgIC5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnMub3ZlcmxheSlcbiAgICAgIC5tZXJnZShvdmVybGF5KVxuICAgICAgICAuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXh0ZW50ID0gbG9jYWwodGhpcykuZXh0ZW50O1xuICAgICAgICAgIHNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAuYXR0cihcInhcIiwgZXh0ZW50WzBdWzBdKVxuICAgICAgICAgICAgICAuYXR0cihcInlcIiwgZXh0ZW50WzBdWzFdKVxuICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGV4dGVudFsxXVswXSAtIGV4dGVudFswXVswXSlcbiAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZXh0ZW50WzFdWzFdIC0gZXh0ZW50WzBdWzFdKTtcbiAgICAgICAgfSk7XG5cbiAgICBncm91cC5zZWxlY3RBbGwoXCIuc2VsZWN0aW9uXCIpXG4gICAgICAuZGF0YShbdHlwZShcInNlbGVjdGlvblwiKV0pXG4gICAgICAuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJzZWxlY3Rpb25cIilcbiAgICAgICAgLmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29ycy5zZWxlY3Rpb24pXG4gICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIiM3NzdcIilcbiAgICAgICAgLmF0dHIoXCJmaWxsLW9wYWNpdHlcIiwgMC4zKVxuICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcIiNmZmZcIilcbiAgICAgICAgLmF0dHIoXCJzaGFwZS1yZW5kZXJpbmdcIiwgXCJjcmlzcEVkZ2VzXCIpO1xuXG4gICAgdmFyIGhhbmRsZSA9IGdyb3VwLnNlbGVjdEFsbChcIi5oYW5kbGVcIilcbiAgICAgIC5kYXRhKGRpbS5oYW5kbGVzLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGU7IH0pO1xuXG4gICAgaGFuZGxlLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIGhhbmRsZS5lbnRlcigpLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbihkKSB7IHJldHVybiBcImhhbmRsZSBoYW5kbGUtLVwiICsgZC50eXBlOyB9KVxuICAgICAgICAuYXR0cihcImN1cnNvclwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBjdXJzb3JzW2QudHlwZV07IH0pO1xuXG4gICAgZ3JvdXBcbiAgICAgICAgLmVhY2gocmVkcmF3KVxuICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgIC5hdHRyKFwicG9pbnRlci1ldmVudHNcIiwgXCJhbGxcIilcbiAgICAgICAgLm9uKFwibW91c2Vkb3duLmJydXNoXCIsIHN0YXJ0ZWQpXG4gICAgICAuZmlsdGVyKHRvdWNoYWJsZSlcbiAgICAgICAgLm9uKFwidG91Y2hzdGFydC5icnVzaFwiLCBzdGFydGVkKVxuICAgICAgICAub24oXCJ0b3VjaG1vdmUuYnJ1c2hcIiwgdG91Y2htb3ZlZClcbiAgICAgICAgLm9uKFwidG91Y2hlbmQuYnJ1c2ggdG91Y2hjYW5jZWwuYnJ1c2hcIiwgdG91Y2hlbmRlZClcbiAgICAgICAgLnN0eWxlKFwidG91Y2gtYWN0aW9uXCIsIFwibm9uZVwiKVxuICAgICAgICAuc3R5bGUoXCItd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3JcIiwgXCJyZ2JhKDAsMCwwLDApXCIpO1xuICB9XG5cbiAgYnJ1c2gubW92ZSA9IGZ1bmN0aW9uKGdyb3VwLCBzZWxlY3Rpb24sIGV2ZW50KSB7XG4gICAgaWYgKGdyb3VwLnR3ZWVuKSB7XG4gICAgICBncm91cFxuICAgICAgICAgIC5vbihcInN0YXJ0LmJydXNoXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IGVtaXR0ZXIodGhpcywgYXJndW1lbnRzKS5iZWZvcmVzdGFydCgpLnN0YXJ0KGV2ZW50KTsgfSlcbiAgICAgICAgICAub24oXCJpbnRlcnJ1cHQuYnJ1c2ggZW5kLmJydXNoXCIsIGZ1bmN0aW9uKGV2ZW50KSB7IGVtaXR0ZXIodGhpcywgYXJndW1lbnRzKS5lbmQoZXZlbnQpOyB9KVxuICAgICAgICAgIC50d2VlbihcImJydXNoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIHN0YXRlID0gdGhhdC5fX2JydXNoLFxuICAgICAgICAgICAgICAgIGVtaXQgPSBlbWl0dGVyKHRoYXQsIGFyZ3VtZW50cyksXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uMCA9IHN0YXRlLnNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24xID0gZGltLmlucHV0KHR5cGVvZiBzZWxlY3Rpb24gPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogc2VsZWN0aW9uLCBzdGF0ZS5leHRlbnQpLFxuICAgICAgICAgICAgICAgIGkgPSBpbnRlcnBvbGF0ZShzZWxlY3Rpb24wLCBzZWxlY3Rpb24xKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdHdlZW4odCkge1xuICAgICAgICAgICAgICBzdGF0ZS5zZWxlY3Rpb24gPSB0ID09PSAxICYmIHNlbGVjdGlvbjEgPT09IG51bGwgPyBudWxsIDogaSh0KTtcbiAgICAgICAgICAgICAgcmVkcmF3LmNhbGwodGhhdCk7XG4gICAgICAgICAgICAgIGVtaXQuYnJ1c2goKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGlvbjAgIT09IG51bGwgJiYgc2VsZWN0aW9uMSAhPT0gbnVsbCA/IHR3ZWVuIDogdHdlZW4oMSk7XG4gICAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyb3VwXG4gICAgICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHRoYXQuX19icnVzaCxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24xID0gZGltLmlucHV0KHR5cGVvZiBzZWxlY3Rpb24gPT09IFwiZnVuY3Rpb25cIiA/IHNlbGVjdGlvbi5hcHBseSh0aGF0LCBhcmdzKSA6IHNlbGVjdGlvbiwgc3RhdGUuZXh0ZW50KSxcbiAgICAgICAgICAgICAgICBlbWl0ID0gZW1pdHRlcih0aGF0LCBhcmdzKS5iZWZvcmVzdGFydCgpO1xuXG4gICAgICAgICAgICBpbnRlcnJ1cHQodGhhdCk7XG4gICAgICAgICAgICBzdGF0ZS5zZWxlY3Rpb24gPSBzZWxlY3Rpb24xID09PSBudWxsID8gbnVsbCA6IHNlbGVjdGlvbjE7XG4gICAgICAgICAgICByZWRyYXcuY2FsbCh0aGF0KTtcbiAgICAgICAgICAgIGVtaXQuc3RhcnQoZXZlbnQpLmJydXNoKGV2ZW50KS5lbmQoZXZlbnQpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBicnVzaC5jbGVhciA9IGZ1bmN0aW9uKGdyb3VwLCBldmVudCkge1xuICAgIGJydXNoLm1vdmUoZ3JvdXAsIG51bGwsIGV2ZW50KTtcbiAgfTtcblxuICBmdW5jdGlvbiByZWRyYXcoKSB7XG4gICAgdmFyIGdyb3VwID0gc2VsZWN0KHRoaXMpLFxuICAgICAgICBzZWxlY3Rpb24gPSBsb2NhbCh0aGlzKS5zZWxlY3Rpb247XG5cbiAgICBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICBncm91cC5zZWxlY3RBbGwoXCIuc2VsZWN0aW9uXCIpXG4gICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCBzZWxlY3Rpb25bMF1bMF0pXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIHNlbGVjdGlvblswXVsxXSlcbiAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHNlbGVjdGlvblsxXVswXSAtIHNlbGVjdGlvblswXVswXSlcbiAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBzZWxlY3Rpb25bMV1bMV0gLSBzZWxlY3Rpb25bMF1bMV0pO1xuXG4gICAgICBncm91cC5zZWxlY3RBbGwoXCIuaGFuZGxlXCIpXG4gICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBudWxsKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGVbZC50eXBlLmxlbmd0aCAtIDFdID09PSBcImVcIiA/IHNlbGVjdGlvblsxXVswXSAtIGhhbmRsZVNpemUgLyAyIDogc2VsZWN0aW9uWzBdWzBdIC0gaGFuZGxlU2l6ZSAvIDI7IH0pXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZVswXSA9PT0gXCJzXCIgPyBzZWxlY3Rpb25bMV1bMV0gLSBoYW5kbGVTaXplIC8gMiA6IHNlbGVjdGlvblswXVsxXSAtIGhhbmRsZVNpemUgLyAyOyB9KVxuICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlID09PSBcIm5cIiB8fCBkLnR5cGUgPT09IFwic1wiID8gc2VsZWN0aW9uWzFdWzBdIC0gc2VsZWN0aW9uWzBdWzBdICsgaGFuZGxlU2l6ZSA6IGhhbmRsZVNpemU7IH0pXG4gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlID09PSBcImVcIiB8fCBkLnR5cGUgPT09IFwid1wiID8gc2VsZWN0aW9uWzFdWzFdIC0gc2VsZWN0aW9uWzBdWzFdICsgaGFuZGxlU2l6ZSA6IGhhbmRsZVNpemU7IH0pO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgZ3JvdXAuc2VsZWN0QWxsKFwiLnNlbGVjdGlvbiwuaGFuZGxlXCIpXG4gICAgICAgICAgLnN0eWxlKFwiZGlzcGxheVwiLCBcIm5vbmVcIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgbnVsbClcbiAgICAgICAgICAuYXR0cihcInlcIiwgbnVsbClcbiAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIG51bGwpXG4gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdHRlcih0aGF0LCBhcmdzLCBjbGVhbikge1xuICAgIHZhciBlbWl0ID0gdGhhdC5fX2JydXNoLmVtaXR0ZXI7XG4gICAgcmV0dXJuIGVtaXQgJiYgKCFjbGVhbiB8fCAhZW1pdC5jbGVhbikgPyBlbWl0IDogbmV3IEVtaXR0ZXIodGhhdCwgYXJncywgY2xlYW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gRW1pdHRlcih0aGF0LCBhcmdzLCBjbGVhbikge1xuICAgIHRoaXMudGhhdCA9IHRoYXQ7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB0aGlzLnN0YXRlID0gdGhhdC5fX2JydXNoO1xuICAgIHRoaXMuYWN0aXZlID0gMDtcbiAgICB0aGlzLmNsZWFuID0gY2xlYW47XG4gIH1cblxuICBFbWl0dGVyLnByb3RvdHlwZSA9IHtcbiAgICBiZWZvcmVzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoKyt0aGlzLmFjdGl2ZSA9PT0gMSkgdGhpcy5zdGF0ZS5lbWl0dGVyID0gdGhpcywgdGhpcy5zdGFydGluZyA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgbW9kZSkge1xuICAgICAgaWYgKHRoaXMuc3RhcnRpbmcpIHRoaXMuc3RhcnRpbmcgPSBmYWxzZSwgdGhpcy5lbWl0KFwic3RhcnRcIiwgZXZlbnQsIG1vZGUpO1xuICAgICAgZWxzZSB0aGlzLmVtaXQoXCJicnVzaFwiLCBldmVudCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGJydXNoOiBmdW5jdGlvbihldmVudCwgbW9kZSkge1xuICAgICAgdGhpcy5lbWl0KFwiYnJ1c2hcIiwgZXZlbnQsIG1vZGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKGV2ZW50LCBtb2RlKSB7XG4gICAgICBpZiAoLS10aGlzLmFjdGl2ZSA9PT0gMCkgZGVsZXRlIHRoaXMuc3RhdGUuZW1pdHRlciwgdGhpcy5lbWl0KFwiZW5kXCIsIGV2ZW50LCBtb2RlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW1pdDogZnVuY3Rpb24odHlwZSwgZXZlbnQsIG1vZGUpIHtcbiAgICAgIHZhciBkID0gc2VsZWN0KHRoaXMudGhhdCkuZGF0dW0oKTtcbiAgICAgIGxpc3RlbmVycy5jYWxsKFxuICAgICAgICB0eXBlLFxuICAgICAgICB0aGlzLnRoYXQsXG4gICAgICAgIG5ldyBCcnVzaEV2ZW50KHR5cGUsIHtcbiAgICAgICAgICBzb3VyY2VFdmVudDogZXZlbnQsXG4gICAgICAgICAgdGFyZ2V0OiBicnVzaCxcbiAgICAgICAgICBzZWxlY3Rpb246IGRpbS5vdXRwdXQodGhpcy5zdGF0ZS5zZWxlY3Rpb24pLFxuICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgZGlzcGF0Y2g6IGxpc3RlbmVyc1xuICAgICAgICB9KSxcbiAgICAgICAgZFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gc3RhcnRlZChldmVudCkge1xuICAgIGlmICh0b3VjaGVuZGluZyAmJiAhZXZlbnQudG91Y2hlcykgcmV0dXJuO1xuICAgIGlmICghZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybjtcblxuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgdHlwZSA9IGV2ZW50LnRhcmdldC5fX2RhdGFfXy50eXBlLFxuICAgICAgICBtb2RlID0gKGtleXMgJiYgZXZlbnQubWV0YUtleSA/IHR5cGUgPSBcIm92ZXJsYXlcIiA6IHR5cGUpID09PSBcInNlbGVjdGlvblwiID8gTU9ERV9EUkFHIDogKGtleXMgJiYgZXZlbnQuYWx0S2V5ID8gTU9ERV9DRU5URVIgOiBNT0RFX0hBTkRMRSksXG4gICAgICAgIHNpZ25YID0gZGltID09PSBZID8gbnVsbCA6IHNpZ25zWFt0eXBlXSxcbiAgICAgICAgc2lnblkgPSBkaW0gPT09IFggPyBudWxsIDogc2lnbnNZW3R5cGVdLFxuICAgICAgICBzdGF0ZSA9IGxvY2FsKHRoYXQpLFxuICAgICAgICBleHRlbnQgPSBzdGF0ZS5leHRlbnQsXG4gICAgICAgIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbixcbiAgICAgICAgVyA9IGV4dGVudFswXVswXSwgdzAsIHcxLFxuICAgICAgICBOID0gZXh0ZW50WzBdWzFdLCBuMCwgbjEsXG4gICAgICAgIEUgPSBleHRlbnRbMV1bMF0sIGUwLCBlMSxcbiAgICAgICAgUyA9IGV4dGVudFsxXVsxXSwgczAsIHMxLFxuICAgICAgICBkeCA9IDAsXG4gICAgICAgIGR5ID0gMCxcbiAgICAgICAgbW92aW5nLFxuICAgICAgICBzaGlmdGluZyA9IHNpZ25YICYmIHNpZ25ZICYmIGtleXMgJiYgZXZlbnQuc2hpZnRLZXksXG4gICAgICAgIGxvY2tYLFxuICAgICAgICBsb2NrWSxcbiAgICAgICAgcG9pbnRzID0gQXJyYXkuZnJvbShldmVudC50b3VjaGVzIHx8IFtldmVudF0sIHQgPT4ge1xuICAgICAgICAgIGNvbnN0IGkgPSB0LmlkZW50aWZpZXI7XG4gICAgICAgICAgdCA9IHBvaW50ZXIodCwgdGhhdCk7XG4gICAgICAgICAgdC5wb2ludDAgPSB0LnNsaWNlKCk7XG4gICAgICAgICAgdC5pZGVudGlmaWVyID0gaTtcbiAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgfSk7XG5cbiAgICBpbnRlcnJ1cHQodGhhdCk7XG4gICAgdmFyIGVtaXQgPSBlbWl0dGVyKHRoYXQsIGFyZ3VtZW50cywgdHJ1ZSkuYmVmb3Jlc3RhcnQoKTtcblxuICAgIGlmICh0eXBlID09PSBcIm92ZXJsYXlcIikge1xuICAgICAgaWYgKHNlbGVjdGlvbikgbW92aW5nID0gdHJ1ZTtcbiAgICAgIGNvbnN0IHB0cyA9IFtwb2ludHNbMF0sIHBvaW50c1sxXSB8fCBwb2ludHNbMF1dO1xuICAgICAgc3RhdGUuc2VsZWN0aW9uID0gc2VsZWN0aW9uID0gW1tcbiAgICAgICAgICB3MCA9IGRpbSA9PT0gWSA/IFcgOiBtaW4ocHRzWzBdWzBdLCBwdHNbMV1bMF0pLFxuICAgICAgICAgIG4wID0gZGltID09PSBYID8gTiA6IG1pbihwdHNbMF1bMV0sIHB0c1sxXVsxXSlcbiAgICAgICAgXSwgW1xuICAgICAgICAgIGUwID0gZGltID09PSBZID8gRSA6IG1heChwdHNbMF1bMF0sIHB0c1sxXVswXSksXG4gICAgICAgICAgczAgPSBkaW0gPT09IFggPyBTIDogbWF4KHB0c1swXVsxXSwgcHRzWzFdWzFdKVxuICAgICAgICBdXTtcbiAgICAgIGlmIChwb2ludHMubGVuZ3RoID4gMSkgbW92ZShldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHcwID0gc2VsZWN0aW9uWzBdWzBdO1xuICAgICAgbjAgPSBzZWxlY3Rpb25bMF1bMV07XG4gICAgICBlMCA9IHNlbGVjdGlvblsxXVswXTtcbiAgICAgIHMwID0gc2VsZWN0aW9uWzFdWzFdO1xuICAgIH1cblxuICAgIHcxID0gdzA7XG4gICAgbjEgPSBuMDtcbiAgICBlMSA9IGUwO1xuICAgIHMxID0gczA7XG5cbiAgICB2YXIgZ3JvdXAgPSBzZWxlY3QodGhhdClcbiAgICAgICAgLmF0dHIoXCJwb2ludGVyLWV2ZW50c1wiLCBcIm5vbmVcIik7XG5cbiAgICB2YXIgb3ZlcmxheSA9IGdyb3VwLnNlbGVjdEFsbChcIi5vdmVybGF5XCIpXG4gICAgICAgIC5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnNbdHlwZV0pO1xuXG4gICAgaWYgKGV2ZW50LnRvdWNoZXMpIHtcbiAgICAgIGVtaXQubW92ZWQgPSBtb3ZlZDtcbiAgICAgIGVtaXQuZW5kZWQgPSBlbmRlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpZXcgPSBzZWxlY3QoZXZlbnQudmlldylcbiAgICAgICAgICAub24oXCJtb3VzZW1vdmUuYnJ1c2hcIiwgbW92ZWQsIHRydWUpXG4gICAgICAgICAgLm9uKFwibW91c2V1cC5icnVzaFwiLCBlbmRlZCwgdHJ1ZSk7XG4gICAgICBpZiAoa2V5cykgdmlld1xuICAgICAgICAgIC5vbihcImtleWRvd24uYnJ1c2hcIiwga2V5ZG93bmVkLCB0cnVlKVxuICAgICAgICAgIC5vbihcImtleXVwLmJydXNoXCIsIGtleXVwcGVkLCB0cnVlKVxuXG4gICAgICBkcmFnRGlzYWJsZShldmVudC52aWV3KTtcbiAgICB9XG5cbiAgICByZWRyYXcuY2FsbCh0aGF0KTtcbiAgICBlbWl0LnN0YXJ0KGV2ZW50LCBtb2RlLm5hbWUpO1xuXG4gICAgZnVuY3Rpb24gbW92ZWQoZXZlbnQpIHtcbiAgICAgIGZvciAoY29uc3QgcCBvZiBldmVudC5jaGFuZ2VkVG91Y2hlcyB8fCBbZXZlbnRdKSB7XG4gICAgICAgIGZvciAoY29uc3QgZCBvZiBwb2ludHMpXG4gICAgICAgICAgaWYgKGQuaWRlbnRpZmllciA9PT0gcC5pZGVudGlmaWVyKSBkLmN1ciA9IHBvaW50ZXIocCwgdGhhdCk7XG4gICAgICB9XG4gICAgICBpZiAoc2hpZnRpbmcgJiYgIWxvY2tYICYmICFsb2NrWSAmJiBwb2ludHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzWzBdO1xuICAgICAgICBpZiAoYWJzKHBvaW50LmN1clswXSAtIHBvaW50WzBdKSA+IGFicyhwb2ludC5jdXJbMV0gLSBwb2ludFsxXSkpXG4gICAgICAgICAgbG9ja1kgPSB0cnVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgbG9ja1ggPSB0cnVlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpXG4gICAgICAgIGlmIChwb2ludC5jdXIpIHBvaW50WzBdID0gcG9pbnQuY3VyWzBdLCBwb2ludFsxXSA9IHBvaW50LmN1clsxXTtcbiAgICAgIG1vdmluZyA9IHRydWU7XG4gICAgICBub2V2ZW50KGV2ZW50KTtcbiAgICAgIG1vdmUoZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdmUoZXZlbnQpIHtcbiAgICAgIGNvbnN0IHBvaW50ID0gcG9pbnRzWzBdLCBwb2ludDAgPSBwb2ludC5wb2ludDA7XG4gICAgICB2YXIgdDtcblxuICAgICAgZHggPSBwb2ludFswXSAtIHBvaW50MFswXTtcbiAgICAgIGR5ID0gcG9pbnRbMV0gLSBwb2ludDBbMV07XG5cbiAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICBjYXNlIE1PREVfU1BBQ0U6XG4gICAgICAgIGNhc2UgTU9ERV9EUkFHOiB7XG4gICAgICAgICAgaWYgKHNpZ25YKSBkeCA9IG1heChXIC0gdzAsIG1pbihFIC0gZTAsIGR4KSksIHcxID0gdzAgKyBkeCwgZTEgPSBlMCArIGR4O1xuICAgICAgICAgIGlmIChzaWduWSkgZHkgPSBtYXgoTiAtIG4wLCBtaW4oUyAtIHMwLCBkeSkpLCBuMSA9IG4wICsgZHksIHMxID0gczAgKyBkeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIE1PREVfSEFORExFOiB7XG4gICAgICAgICAgaWYgKHBvaW50c1sxXSkge1xuICAgICAgICAgICAgaWYgKHNpZ25YKSB3MSA9IG1heChXLCBtaW4oRSwgcG9pbnRzWzBdWzBdKSksIGUxID0gbWF4KFcsIG1pbihFLCBwb2ludHNbMV1bMF0pKSwgc2lnblggPSAxO1xuICAgICAgICAgICAgaWYgKHNpZ25ZKSBuMSA9IG1heChOLCBtaW4oUywgcG9pbnRzWzBdWzFdKSksIHMxID0gbWF4KE4sIG1pbihTLCBwb2ludHNbMV1bMV0pKSwgc2lnblkgPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2lnblggPCAwKSBkeCA9IG1heChXIC0gdzAsIG1pbihFIC0gdzAsIGR4KSksIHcxID0gdzAgKyBkeCwgZTEgPSBlMDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHNpZ25YID4gMCkgZHggPSBtYXgoVyAtIGUwLCBtaW4oRSAtIGUwLCBkeCkpLCB3MSA9IHcwLCBlMSA9IGUwICsgZHg7XG4gICAgICAgICAgICBpZiAoc2lnblkgPCAwKSBkeSA9IG1heChOIC0gbjAsIG1pbihTIC0gbjAsIGR5KSksIG4xID0gbjAgKyBkeSwgczEgPSBzMDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHNpZ25ZID4gMCkgZHkgPSBtYXgoTiAtIHMwLCBtaW4oUyAtIHMwLCBkeSkpLCBuMSA9IG4wLCBzMSA9IHMwICsgZHk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgTU9ERV9DRU5URVI6IHtcbiAgICAgICAgICBpZiAoc2lnblgpIHcxID0gbWF4KFcsIG1pbihFLCB3MCAtIGR4ICogc2lnblgpKSwgZTEgPSBtYXgoVywgbWluKEUsIGUwICsgZHggKiBzaWduWCkpO1xuICAgICAgICAgIGlmIChzaWduWSkgbjEgPSBtYXgoTiwgbWluKFMsIG4wIC0gZHkgKiBzaWduWSkpLCBzMSA9IG1heChOLCBtaW4oUywgczAgKyBkeSAqIHNpZ25ZKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGUxIDwgdzEpIHtcbiAgICAgICAgc2lnblggKj0gLTE7XG4gICAgICAgIHQgPSB3MCwgdzAgPSBlMCwgZTAgPSB0O1xuICAgICAgICB0ID0gdzEsIHcxID0gZTEsIGUxID0gdDtcbiAgICAgICAgaWYgKHR5cGUgaW4gZmxpcFgpIG92ZXJsYXkuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzW3R5cGUgPSBmbGlwWFt0eXBlXV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoczEgPCBuMSkge1xuICAgICAgICBzaWduWSAqPSAtMTtcbiAgICAgICAgdCA9IG4wLCBuMCA9IHMwLCBzMCA9IHQ7XG4gICAgICAgIHQgPSBuMSwgbjEgPSBzMSwgczEgPSB0O1xuICAgICAgICBpZiAodHlwZSBpbiBmbGlwWSkgb3ZlcmxheS5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnNbdHlwZSA9IGZsaXBZW3R5cGVdXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5zZWxlY3Rpb24pIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbjsgLy8gTWF5IGJlIHNldCBieSBicnVzaC5tb3ZlIVxuICAgICAgaWYgKGxvY2tYKSB3MSA9IHNlbGVjdGlvblswXVswXSwgZTEgPSBzZWxlY3Rpb25bMV1bMF07XG4gICAgICBpZiAobG9ja1kpIG4xID0gc2VsZWN0aW9uWzBdWzFdLCBzMSA9IHNlbGVjdGlvblsxXVsxXTtcblxuICAgICAgaWYgKHNlbGVjdGlvblswXVswXSAhPT0gdzFcbiAgICAgICAgICB8fCBzZWxlY3Rpb25bMF1bMV0gIT09IG4xXG4gICAgICAgICAgfHwgc2VsZWN0aW9uWzFdWzBdICE9PSBlMVxuICAgICAgICAgIHx8IHNlbGVjdGlvblsxXVsxXSAhPT0gczEpIHtcbiAgICAgICAgc3RhdGUuc2VsZWN0aW9uID0gW1t3MSwgbjFdLCBbZTEsIHMxXV07XG4gICAgICAgIHJlZHJhdy5jYWxsKHRoYXQpO1xuICAgICAgICBlbWl0LmJydXNoKGV2ZW50LCBtb2RlLm5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZGVkKGV2ZW50KSB7XG4gICAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICAgIGlmIChldmVudC50b3VjaGVzKSB7XG4gICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICBpZiAodG91Y2hlbmRpbmcpIGNsZWFyVGltZW91dCh0b3VjaGVuZGluZyk7XG4gICAgICAgIHRvdWNoZW5kaW5nID0gc2V0VGltZW91dChmdW5jdGlvbigpIHsgdG91Y2hlbmRpbmcgPSBudWxsOyB9LCA1MDApOyAvLyBHaG9zdCBjbGlja3MgYXJlIGRlbGF5ZWQhXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcmFnRW5hYmxlKGV2ZW50LnZpZXcsIG1vdmluZyk7XG4gICAgICAgIHZpZXcub24oXCJrZXlkb3duLmJydXNoIGtleXVwLmJydXNoIG1vdXNlbW92ZS5icnVzaCBtb3VzZXVwLmJydXNoXCIsIG51bGwpO1xuICAgICAgfVxuICAgICAgZ3JvdXAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpO1xuICAgICAgb3ZlcmxheS5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnMub3ZlcmxheSk7XG4gICAgICBpZiAoc3RhdGUuc2VsZWN0aW9uKSBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb247IC8vIE1heSBiZSBzZXQgYnkgYnJ1c2gubW92ZSAob24gc3RhcnQpIVxuICAgICAgaWYgKGVtcHR5KHNlbGVjdGlvbikpIHN0YXRlLnNlbGVjdGlvbiA9IG51bGwsIHJlZHJhdy5jYWxsKHRoYXQpO1xuICAgICAgZW1pdC5lbmQoZXZlbnQsIG1vZGUubmFtZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5ZG93bmVkKGV2ZW50KSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAxNjogeyAvLyBTSElGVFxuICAgICAgICAgIHNoaWZ0aW5nID0gc2lnblggJiYgc2lnblk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAxODogeyAvLyBBTFRcbiAgICAgICAgICBpZiAobW9kZSA9PT0gTU9ERV9IQU5ETEUpIHtcbiAgICAgICAgICAgIGlmIChzaWduWCkgZTAgPSBlMSAtIGR4ICogc2lnblgsIHcwID0gdzEgKyBkeCAqIHNpZ25YO1xuICAgICAgICAgICAgaWYgKHNpZ25ZKSBzMCA9IHMxIC0gZHkgKiBzaWduWSwgbjAgPSBuMSArIGR5ICogc2lnblk7XG4gICAgICAgICAgICBtb2RlID0gTU9ERV9DRU5URVI7XG4gICAgICAgICAgICBtb3ZlKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAzMjogeyAvLyBTUEFDRTsgdGFrZXMgcHJpb3JpdHkgb3ZlciBBTFRcbiAgICAgICAgICBpZiAobW9kZSA9PT0gTU9ERV9IQU5ETEUgfHwgbW9kZSA9PT0gTU9ERV9DRU5URVIpIHtcbiAgICAgICAgICAgIGlmIChzaWduWCA8IDApIGUwID0gZTEgLSBkeDsgZWxzZSBpZiAoc2lnblggPiAwKSB3MCA9IHcxIC0gZHg7XG4gICAgICAgICAgICBpZiAoc2lnblkgPCAwKSBzMCA9IHMxIC0gZHk7IGVsc2UgaWYgKHNpZ25ZID4gMCkgbjAgPSBuMSAtIGR5O1xuICAgICAgICAgICAgbW9kZSA9IE1PREVfU1BBQ0U7XG4gICAgICAgICAgICBvdmVybGF5LmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29ycy5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgbW92ZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleXVwcGVkKGV2ZW50KSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSAxNjogeyAvLyBTSElGVFxuICAgICAgICAgIGlmIChzaGlmdGluZykge1xuICAgICAgICAgICAgbG9ja1ggPSBsb2NrWSA9IHNoaWZ0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBtb3ZlKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAxODogeyAvLyBBTFRcbiAgICAgICAgICBpZiAobW9kZSA9PT0gTU9ERV9DRU5URVIpIHtcbiAgICAgICAgICAgIGlmIChzaWduWCA8IDApIGUwID0gZTE7IGVsc2UgaWYgKHNpZ25YID4gMCkgdzAgPSB3MTtcbiAgICAgICAgICAgIGlmIChzaWduWSA8IDApIHMwID0gczE7IGVsc2UgaWYgKHNpZ25ZID4gMCkgbjAgPSBuMTtcbiAgICAgICAgICAgIG1vZGUgPSBNT0RFX0hBTkRMRTtcbiAgICAgICAgICAgIG1vdmUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIDMyOiB7IC8vIFNQQUNFXG4gICAgICAgICAgaWYgKG1vZGUgPT09IE1PREVfU1BBQ0UpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5hbHRLZXkpIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25YKSBlMCA9IGUxIC0gZHggKiBzaWduWCwgdzAgPSB3MSArIGR4ICogc2lnblg7XG4gICAgICAgICAgICAgIGlmIChzaWduWSkgczAgPSBzMSAtIGR5ICogc2lnblksIG4wID0gbjEgKyBkeSAqIHNpZ25ZO1xuICAgICAgICAgICAgICBtb2RlID0gTU9ERV9DRU5URVI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoc2lnblggPCAwKSBlMCA9IGUxOyBlbHNlIGlmIChzaWduWCA+IDApIHcwID0gdzE7XG4gICAgICAgICAgICAgIGlmIChzaWduWSA8IDApIHMwID0gczE7IGVsc2UgaWYgKHNpZ25ZID4gMCkgbjAgPSBuMTtcbiAgICAgICAgICAgICAgbW9kZSA9IE1PREVfSEFORExFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3ZlcmxheS5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnNbdHlwZV0pO1xuICAgICAgICAgICAgbW92ZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNobW92ZWQoZXZlbnQpIHtcbiAgICBlbWl0dGVyKHRoaXMsIGFyZ3VtZW50cykubW92ZWQoZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hlbmRlZChldmVudCkge1xuICAgIGVtaXR0ZXIodGhpcywgYXJndW1lbnRzKS5lbmRlZChldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX19icnVzaCB8fCB7c2VsZWN0aW9uOiBudWxsfTtcbiAgICBzdGF0ZS5leHRlbnQgPSBudW1iZXIyKGV4dGVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICBzdGF0ZS5kaW0gPSBkaW07XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgYnJ1c2guZXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGV4dGVudCA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQobnVtYmVyMihfKSksIGJydXNoKSA6IGV4dGVudDtcbiAgfTtcblxuICBicnVzaC5maWx0ZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZmlsdGVyID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCBicnVzaCkgOiBmaWx0ZXI7XG4gIH07XG5cbiAgYnJ1c2gudG91Y2hhYmxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoYWJsZSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgYnJ1c2gpIDogdG91Y2hhYmxlO1xuICB9O1xuXG4gIGJydXNoLmhhbmRsZVNpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaGFuZGxlU2l6ZSA9ICtfLCBicnVzaCkgOiBoYW5kbGVTaXplO1xuICB9O1xuXG4gIGJydXNoLmtleU1vZGlmaWVycyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChrZXlzID0gISFfLCBicnVzaCkgOiBrZXlzO1xuICB9O1xuXG4gIGJydXNoLm9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gbGlzdGVuZXJzLm9uLmFwcGx5KGxpc3RlbmVycywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdmFsdWUgPT09IGxpc3RlbmVycyA/IGJydXNoIDogdmFsdWU7XG4gIH07XG5cbiAgcmV0dXJuIGJydXNoO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGQpIHtcbiAgY29uc3QgeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCksXG4gICAgICB5ID0gK3RoaXMuX3kuY2FsbChudWxsLCBkKTtcbiAgcmV0dXJuIGFkZCh0aGlzLmNvdmVyKHgsIHkpLCB4LCB5LCBkKTtcbn1cblxuZnVuY3Rpb24gYWRkKHRyZWUsIHgsIHksIGQpIHtcbiAgaWYgKGlzTmFOKHgpIHx8IGlzTmFOKHkpKSByZXR1cm4gdHJlZTsgLy8gaWdub3JlIGludmFsaWQgcG9pbnRzXG5cbiAgdmFyIHBhcmVudCxcbiAgICAgIG5vZGUgPSB0cmVlLl9yb290LFxuICAgICAgbGVhZiA9IHtkYXRhOiBkfSxcbiAgICAgIHgwID0gdHJlZS5feDAsXG4gICAgICB5MCA9IHRyZWUuX3kwLFxuICAgICAgeDEgPSB0cmVlLl94MSxcbiAgICAgIHkxID0gdHJlZS5feTEsXG4gICAgICB4bSxcbiAgICAgIHltLFxuICAgICAgeHAsXG4gICAgICB5cCxcbiAgICAgIHJpZ2h0LFxuICAgICAgYm90dG9tLFxuICAgICAgaSxcbiAgICAgIGo7XG5cbiAgLy8gSWYgdGhlIHRyZWUgaXMgZW1wdHksIGluaXRpYWxpemUgdGhlIHJvb3QgYXMgYSBsZWFmLlxuICBpZiAoIW5vZGUpIHJldHVybiB0cmVlLl9yb290ID0gbGVhZiwgdHJlZTtcblxuICAvLyBGaW5kIHRoZSBleGlzdGluZyBsZWFmIGZvciB0aGUgbmV3IHBvaW50LCBvciBhZGQgaXQuXG4gIHdoaWxlIChub2RlLmxlbmd0aCkge1xuICAgIGlmIChyaWdodCA9IHggPj0gKHhtID0gKHgwICsgeDEpIC8gMikpIHgwID0geG07IGVsc2UgeDEgPSB4bTtcbiAgICBpZiAoYm90dG9tID0geSA+PSAoeW0gPSAoeTAgKyB5MSkgLyAyKSkgeTAgPSB5bTsgZWxzZSB5MSA9IHltO1xuICAgIGlmIChwYXJlbnQgPSBub2RlLCAhKG5vZGUgPSBub2RlW2kgPSBib3R0b20gPDwgMSB8IHJpZ2h0XSkpIHJldHVybiBwYXJlbnRbaV0gPSBsZWFmLCB0cmVlO1xuICB9XG5cbiAgLy8gSXMgdGhlIG5ldyBwb2ludCBpcyBleGFjdGx5IGNvaW5jaWRlbnQgd2l0aCB0aGUgZXhpc3RpbmcgcG9pbnQ/XG4gIHhwID0gK3RyZWUuX3guY2FsbChudWxsLCBub2RlLmRhdGEpO1xuICB5cCA9ICt0cmVlLl95LmNhbGwobnVsbCwgbm9kZS5kYXRhKTtcbiAgaWYgKHggPT09IHhwICYmIHkgPT09IHlwKSByZXR1cm4gbGVhZi5uZXh0ID0gbm9kZSwgcGFyZW50ID8gcGFyZW50W2ldID0gbGVhZiA6IHRyZWUuX3Jvb3QgPSBsZWFmLCB0cmVlO1xuXG4gIC8vIE90aGVyd2lzZSwgc3BsaXQgdGhlIGxlYWYgbm9kZSB1bnRpbCB0aGUgb2xkIGFuZCBuZXcgcG9pbnQgYXJlIHNlcGFyYXRlZC5cbiAgZG8ge1xuICAgIHBhcmVudCA9IHBhcmVudCA/IHBhcmVudFtpXSA9IG5ldyBBcnJheSg0KSA6IHRyZWUuX3Jvb3QgPSBuZXcgQXJyYXkoNCk7XG4gICAgaWYgKHJpZ2h0ID0geCA+PSAoeG0gPSAoeDAgKyB4MSkgLyAyKSkgeDAgPSB4bTsgZWxzZSB4MSA9IHhtO1xuICAgIGlmIChib3R0b20gPSB5ID49ICh5bSA9ICh5MCArIHkxKSAvIDIpKSB5MCA9IHltOyBlbHNlIHkxID0geW07XG4gIH0gd2hpbGUgKChpID0gYm90dG9tIDw8IDEgfCByaWdodCkgPT09IChqID0gKHlwID49IHltKSA8PCAxIHwgKHhwID49IHhtKSkpO1xuICByZXR1cm4gcGFyZW50W2pdID0gbm9kZSwgcGFyZW50W2ldID0gbGVhZiwgdHJlZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFsbChkYXRhKSB7XG4gIHZhciBkLCBpLCBuID0gZGF0YS5sZW5ndGgsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHh6ID0gbmV3IEFycmF5KG4pLFxuICAgICAgeXogPSBuZXcgQXJyYXkobiksXG4gICAgICB4MCA9IEluZmluaXR5LFxuICAgICAgeTAgPSBJbmZpbml0eSxcbiAgICAgIHgxID0gLUluZmluaXR5LFxuICAgICAgeTEgPSAtSW5maW5pdHk7XG5cbiAgLy8gQ29tcHV0ZSB0aGUgcG9pbnRzIGFuZCB0aGVpciBleHRlbnQuXG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoaXNOYU4oeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCA9IGRhdGFbaV0pKSB8fCBpc05hTih5ID0gK3RoaXMuX3kuY2FsbChudWxsLCBkKSkpIGNvbnRpbnVlO1xuICAgIHh6W2ldID0geDtcbiAgICB5eltpXSA9IHk7XG4gICAgaWYgKHggPCB4MCkgeDAgPSB4O1xuICAgIGlmICh4ID4geDEpIHgxID0geDtcbiAgICBpZiAoeSA8IHkwKSB5MCA9IHk7XG4gICAgaWYgKHkgPiB5MSkgeTEgPSB5O1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgd2VyZSBubyAodmFsaWQpIHBvaW50cywgYWJvcnQuXG4gIGlmICh4MCA+IHgxIHx8IHkwID4geTEpIHJldHVybiB0aGlzO1xuXG4gIC8vIEV4cGFuZCB0aGUgdHJlZSB0byBjb3ZlciB0aGUgbmV3IHBvaW50cy5cbiAgdGhpcy5jb3Zlcih4MCwgeTApLmNvdmVyKHgxLCB5MSk7XG5cbiAgLy8gQWRkIHRoZSBuZXcgcG9pbnRzLlxuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgYWRkKHRoaXMsIHh6W2ldLCB5eltpXSwgZGF0YVtpXSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4LCB5KSB7XG4gIGlmIChpc05hTih4ID0gK3gpIHx8IGlzTmFOKHkgPSAreSkpIHJldHVybiB0aGlzOyAvLyBpZ25vcmUgaW52YWxpZCBwb2ludHNcblxuICB2YXIgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSA9IHRoaXMuX3gxLFxuICAgICAgeTEgPSB0aGlzLl95MTtcblxuICAvLyBJZiB0aGUgcXVhZHRyZWUgaGFzIG5vIGV4dGVudCwgaW5pdGlhbGl6ZSB0aGVtLlxuICAvLyBJbnRlZ2VyIGV4dGVudCBhcmUgbmVjZXNzYXJ5IHNvIHRoYXQgaWYgd2UgbGF0ZXIgZG91YmxlIHRoZSBleHRlbnQsXG4gIC8vIHRoZSBleGlzdGluZyBxdWFkcmFudCBib3VuZGFyaWVzIGRvblx1MjAxOXQgY2hhbmdlIGR1ZSB0byBmbG9hdGluZyBwb2ludCBlcnJvciFcbiAgaWYgKGlzTmFOKHgwKSkge1xuICAgIHgxID0gKHgwID0gTWF0aC5mbG9vcih4KSkgKyAxO1xuICAgIHkxID0gKHkwID0gTWF0aC5mbG9vcih5KSkgKyAxO1xuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCBkb3VibGUgcmVwZWF0ZWRseSB0byBjb3Zlci5cbiAgZWxzZSB7XG4gICAgdmFyIHogPSB4MSAtIHgwIHx8IDEsXG4gICAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGk7XG5cbiAgICB3aGlsZSAoeDAgPiB4IHx8IHggPj0geDEgfHwgeTAgPiB5IHx8IHkgPj0geTEpIHtcbiAgICAgIGkgPSAoeSA8IHkwKSA8PCAxIHwgKHggPCB4MCk7XG4gICAgICBwYXJlbnQgPSBuZXcgQXJyYXkoNCksIHBhcmVudFtpXSA9IG5vZGUsIG5vZGUgPSBwYXJlbnQsIHogKj0gMjtcbiAgICAgIHN3aXRjaCAoaSkge1xuICAgICAgICBjYXNlIDA6IHgxID0geDAgKyB6LCB5MSA9IHkwICsgejsgYnJlYWs7XG4gICAgICAgIGNhc2UgMTogeDAgPSB4MSAtIHosIHkxID0geTAgKyB6OyBicmVhaztcbiAgICAgICAgY2FzZSAyOiB4MSA9IHgwICsgeiwgeTAgPSB5MSAtIHo7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IHgwID0geDEgLSB6LCB5MCA9IHkxIC0gejsgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Jvb3QgJiYgdGhpcy5fcm9vdC5sZW5ndGgpIHRoaXMuX3Jvb3QgPSBub2RlO1xuICB9XG5cbiAgdGhpcy5feDAgPSB4MDtcbiAgdGhpcy5feTAgPSB5MDtcbiAgdGhpcy5feDEgPSB4MTtcbiAgdGhpcy5feTEgPSB5MTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhID0gW107XG4gIHRoaXMudmlzaXQoZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5sZW5ndGgpIGRvIGRhdGEucHVzaChub2RlLmRhdGEpOyB3aGlsZSAobm9kZSA9IG5vZGUubmV4dClcbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5jb3ZlcigrX1swXVswXSwgK19bMF1bMV0pLmNvdmVyKCtfWzFdWzBdLCArX1sxXVsxXSlcbiAgICAgIDogaXNOYU4odGhpcy5feDApID8gdW5kZWZpbmVkIDogW1t0aGlzLl94MCwgdGhpcy5feTBdLCBbdGhpcy5feDEsIHRoaXMuX3kxXV07XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdGhpcy5ub2RlID0gbm9kZTtcbiAgdGhpcy54MCA9IHgwO1xuICB0aGlzLnkwID0geTA7XG4gIHRoaXMueDEgPSB4MTtcbiAgdGhpcy55MSA9IHkxO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgeSwgcmFkaXVzKSB7XG4gIHZhciBkYXRhLFxuICAgICAgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSxcbiAgICAgIHkxLFxuICAgICAgeDIsXG4gICAgICB5MixcbiAgICAgIHgzID0gdGhpcy5feDEsXG4gICAgICB5MyA9IHRoaXMuX3kxLFxuICAgICAgcXVhZHMgPSBbXSxcbiAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgcSxcbiAgICAgIGk7XG5cbiAgaWYgKG5vZGUpIHF1YWRzLnB1c2gobmV3IFF1YWQobm9kZSwgeDAsIHkwLCB4MywgeTMpKTtcbiAgaWYgKHJhZGl1cyA9PSBudWxsKSByYWRpdXMgPSBJbmZpbml0eTtcbiAgZWxzZSB7XG4gICAgeDAgPSB4IC0gcmFkaXVzLCB5MCA9IHkgLSByYWRpdXM7XG4gICAgeDMgPSB4ICsgcmFkaXVzLCB5MyA9IHkgKyByYWRpdXM7XG4gICAgcmFkaXVzICo9IHJhZGl1cztcbiAgfVxuXG4gIHdoaWxlIChxID0gcXVhZHMucG9wKCkpIHtcblxuICAgIC8vIFN0b3Agc2VhcmNoaW5nIGlmIHRoaXMgcXVhZHJhbnQgY2FuXHUyMDE5dCBjb250YWluIGEgY2xvc2VyIG5vZGUuXG4gICAgaWYgKCEobm9kZSA9IHEubm9kZSlcbiAgICAgICAgfHwgKHgxID0gcS54MCkgPiB4M1xuICAgICAgICB8fCAoeTEgPSBxLnkwKSA+IHkzXG4gICAgICAgIHx8ICh4MiA9IHEueDEpIDwgeDBcbiAgICAgICAgfHwgKHkyID0gcS55MSkgPCB5MCkgY29udGludWU7XG5cbiAgICAvLyBCaXNlY3QgdGhlIGN1cnJlbnQgcXVhZHJhbnQuXG4gICAgaWYgKG5vZGUubGVuZ3RoKSB7XG4gICAgICB2YXIgeG0gPSAoeDEgKyB4MikgLyAyLFxuICAgICAgICAgIHltID0gKHkxICsgeTIpIC8gMjtcblxuICAgICAgcXVhZHMucHVzaChcbiAgICAgICAgbmV3IFF1YWQobm9kZVszXSwgeG0sIHltLCB4MiwgeTIpLFxuICAgICAgICBuZXcgUXVhZChub2RlWzJdLCB4MSwgeW0sIHhtLCB5MiksXG4gICAgICAgIG5ldyBRdWFkKG5vZGVbMV0sIHhtLCB5MSwgeDIsIHltKSxcbiAgICAgICAgbmV3IFF1YWQobm9kZVswXSwgeDEsIHkxLCB4bSwgeW0pXG4gICAgICApO1xuXG4gICAgICAvLyBWaXNpdCB0aGUgY2xvc2VzdCBxdWFkcmFudCBmaXJzdC5cbiAgICAgIGlmIChpID0gKHkgPj0geW0pIDw8IDEgfCAoeCA+PSB4bSkpIHtcbiAgICAgICAgcSA9IHF1YWRzW3F1YWRzLmxlbmd0aCAtIDFdO1xuICAgICAgICBxdWFkc1txdWFkcy5sZW5ndGggLSAxXSA9IHF1YWRzW3F1YWRzLmxlbmd0aCAtIDEgLSBpXTtcbiAgICAgICAgcXVhZHNbcXVhZHMubGVuZ3RoIC0gMSAtIGldID0gcTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWaXNpdCB0aGlzIHBvaW50LiAoVmlzaXRpbmcgY29pbmNpZGVudCBwb2ludHMgaXNuXHUyMDE5dCBuZWNlc3NhcnkhKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGR4ID0geCAtICt0aGlzLl94LmNhbGwobnVsbCwgbm9kZS5kYXRhKSxcbiAgICAgICAgICBkeSA9IHkgLSArdGhpcy5feS5jYWxsKG51bGwsIG5vZGUuZGF0YSksXG4gICAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgIGlmIChkMiA8IHJhZGl1cykge1xuICAgICAgICB2YXIgZCA9IE1hdGguc3FydChyYWRpdXMgPSBkMik7XG4gICAgICAgIHgwID0geCAtIGQsIHkwID0geSAtIGQ7XG4gICAgICAgIHgzID0geCArIGQsIHkzID0geSArIGQ7XG4gICAgICAgIGRhdGEgPSBub2RlLmRhdGE7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZCkge1xuICBpZiAoaXNOYU4oeCA9ICt0aGlzLl94LmNhbGwobnVsbCwgZCkpIHx8IGlzTmFOKHkgPSArdGhpcy5feS5jYWxsKG51bGwsIGQpKSkgcmV0dXJuIHRoaXM7IC8vIGlnbm9yZSBpbnZhbGlkIHBvaW50c1xuXG4gIHZhciBwYXJlbnQsXG4gICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgIHJldGFpbmVyLFxuICAgICAgcHJldmlvdXMsXG4gICAgICBuZXh0LFxuICAgICAgeDAgPSB0aGlzLl94MCxcbiAgICAgIHkwID0gdGhpcy5feTAsXG4gICAgICB4MSA9IHRoaXMuX3gxLFxuICAgICAgeTEgPSB0aGlzLl95MSxcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgeG0sXG4gICAgICB5bSxcbiAgICAgIHJpZ2h0LFxuICAgICAgYm90dG9tLFxuICAgICAgaSxcbiAgICAgIGo7XG5cbiAgLy8gSWYgdGhlIHRyZWUgaXMgZW1wdHksIGluaXRpYWxpemUgdGhlIHJvb3QgYXMgYSBsZWFmLlxuICBpZiAoIW5vZGUpIHJldHVybiB0aGlzO1xuXG4gIC8vIEZpbmQgdGhlIGxlYWYgbm9kZSBmb3IgdGhlIHBvaW50LlxuICAvLyBXaGlsZSBkZXNjZW5kaW5nLCBhbHNvIHJldGFpbiB0aGUgZGVlcGVzdCBwYXJlbnQgd2l0aCBhIG5vbi1yZW1vdmVkIHNpYmxpbmcuXG4gIGlmIChub2RlLmxlbmd0aCkgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAocmlnaHQgPSB4ID49ICh4bSA9ICh4MCArIHgxKSAvIDIpKSB4MCA9IHhtOyBlbHNlIHgxID0geG07XG4gICAgaWYgKGJvdHRvbSA9IHkgPj0gKHltID0gKHkwICsgeTEpIC8gMikpIHkwID0geW07IGVsc2UgeTEgPSB5bTtcbiAgICBpZiAoIShwYXJlbnQgPSBub2RlLCBub2RlID0gbm9kZVtpID0gYm90dG9tIDw8IDEgfCByaWdodF0pKSByZXR1cm4gdGhpcztcbiAgICBpZiAoIW5vZGUubGVuZ3RoKSBicmVhaztcbiAgICBpZiAocGFyZW50WyhpICsgMSkgJiAzXSB8fCBwYXJlbnRbKGkgKyAyKSAmIDNdIHx8IHBhcmVudFsoaSArIDMpICYgM10pIHJldGFpbmVyID0gcGFyZW50LCBqID0gaTtcbiAgfVxuXG4gIC8vIEZpbmQgdGhlIHBvaW50IHRvIHJlbW92ZS5cbiAgd2hpbGUgKG5vZGUuZGF0YSAhPT0gZCkgaWYgKCEocHJldmlvdXMgPSBub2RlLCBub2RlID0gbm9kZS5uZXh0KSkgcmV0dXJuIHRoaXM7XG4gIGlmIChuZXh0ID0gbm9kZS5uZXh0KSBkZWxldGUgbm9kZS5uZXh0O1xuXG4gIC8vIElmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb2luY2lkZW50IHBvaW50cywgcmVtb3ZlIGp1c3QgdGhlIHBvaW50LlxuICBpZiAocHJldmlvdXMpIHJldHVybiAobmV4dCA/IHByZXZpb3VzLm5leHQgPSBuZXh0IDogZGVsZXRlIHByZXZpb3VzLm5leHQpLCB0aGlzO1xuXG4gIC8vIElmIHRoaXMgaXMgdGhlIHJvb3QgcG9pbnQsIHJlbW92ZSBpdC5cbiAgaWYgKCFwYXJlbnQpIHJldHVybiB0aGlzLl9yb290ID0gbmV4dCwgdGhpcztcblxuICAvLyBSZW1vdmUgdGhpcyBsZWFmLlxuICBuZXh0ID8gcGFyZW50W2ldID0gbmV4dCA6IGRlbGV0ZSBwYXJlbnRbaV07XG5cbiAgLy8gSWYgdGhlIHBhcmVudCBub3cgY29udGFpbnMgZXhhY3RseSBvbmUgbGVhZiwgY29sbGFwc2Ugc3VwZXJmbHVvdXMgcGFyZW50cy5cbiAgaWYgKChub2RlID0gcGFyZW50WzBdIHx8IHBhcmVudFsxXSB8fCBwYXJlbnRbMl0gfHwgcGFyZW50WzNdKVxuICAgICAgJiYgbm9kZSA9PT0gKHBhcmVudFszXSB8fCBwYXJlbnRbMl0gfHwgcGFyZW50WzFdIHx8IHBhcmVudFswXSlcbiAgICAgICYmICFub2RlLmxlbmd0aCkge1xuICAgIGlmIChyZXRhaW5lcikgcmV0YWluZXJbal0gPSBub2RlO1xuICAgIGVsc2UgdGhpcy5fcm9vdCA9IG5vZGU7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFsbChkYXRhKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gZGF0YS5sZW5ndGg7IGkgPCBuOyArK2kpIHRoaXMucmVtb3ZlKGRhdGFbaV0pO1xuICByZXR1cm4gdGhpcztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBzaXplID0gMDtcbiAgdGhpcy52aXNpdChmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKCFub2RlLmxlbmd0aCkgZG8gKytzaXplOyB3aGlsZSAobm9kZSA9IG5vZGUubmV4dClcbiAgfSk7XG4gIHJldHVybiBzaXplO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHF1YWRzID0gW10sIHEsIG5vZGUgPSB0aGlzLl9yb290LCBjaGlsZCwgeDAsIHkwLCB4MSwgeTE7XG4gIGlmIChub2RlKSBxdWFkcy5wdXNoKG5ldyBRdWFkKG5vZGUsIHRoaXMuX3gwLCB0aGlzLl95MCwgdGhpcy5feDEsIHRoaXMuX3kxKSk7XG4gIHdoaWxlIChxID0gcXVhZHMucG9wKCkpIHtcbiAgICBpZiAoIWNhbGxiYWNrKG5vZGUgPSBxLm5vZGUsIHgwID0gcS54MCwgeTAgPSBxLnkwLCB4MSA9IHEueDEsIHkxID0gcS55MSkgJiYgbm9kZS5sZW5ndGgpIHtcbiAgICAgIHZhciB4bSA9ICh4MCArIHgxKSAvIDIsIHltID0gKHkwICsgeTEpIC8gMjtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbM10pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5bSwgeDEsIHkxKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzJdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeW0sIHhtLCB5MSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVsxXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeG0sIHkwLCB4MSwgeW0pKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMF0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHgwLCB5MCwgeG0sIHltKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCBRdWFkIGZyb20gXCIuL3F1YWQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHF1YWRzID0gW10sIG5leHQgPSBbXSwgcTtcbiAgaWYgKHRoaXMuX3Jvb3QpIHF1YWRzLnB1c2gobmV3IFF1YWQodGhpcy5fcm9vdCwgdGhpcy5feDAsIHRoaXMuX3kwLCB0aGlzLl94MSwgdGhpcy5feTEpKTtcbiAgd2hpbGUgKHEgPSBxdWFkcy5wb3AoKSkge1xuICAgIHZhciBub2RlID0gcS5ub2RlO1xuICAgIGlmIChub2RlLmxlbmd0aCkge1xuICAgICAgdmFyIGNoaWxkLCB4MCA9IHEueDAsIHkwID0gcS55MCwgeDEgPSBxLngxLCB5MSA9IHEueTEsIHhtID0gKHgwICsgeDEpIC8gMiwgeW0gPSAoeTAgKyB5MSkgLyAyO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVswXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeDAsIHkwLCB4bSwgeW0pKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMV0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5MCwgeDEsIHltKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzJdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeW0sIHhtLCB5MSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVszXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeG0sIHltLCB4MSwgeTEpKTtcbiAgICB9XG4gICAgbmV4dC5wdXNoKHEpO1xuICB9XG4gIHdoaWxlIChxID0gbmV4dC5wb3AoKSkge1xuICAgIGNhbGxiYWNrKHEubm9kZSwgcS54MCwgcS55MCwgcS54MSwgcS55MSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRYKGQpIHtcbiAgcmV0dXJuIGRbMF07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGhpcy5feCA9IF8sIHRoaXMpIDogdGhpcy5feDtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gZGVmYXVsdFkoZCkge1xuICByZXR1cm4gZFsxXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXykge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0aGlzLl95ID0gXywgdGhpcykgOiB0aGlzLl95O1xufVxuIiwgImltcG9ydCB0cmVlX2FkZCwge2FkZEFsbCBhcyB0cmVlX2FkZEFsbH0gZnJvbSBcIi4vYWRkLmpzXCI7XG5pbXBvcnQgdHJlZV9jb3ZlciBmcm9tIFwiLi9jb3Zlci5qc1wiO1xuaW1wb3J0IHRyZWVfZGF0YSBmcm9tIFwiLi9kYXRhLmpzXCI7XG5pbXBvcnQgdHJlZV9leHRlbnQgZnJvbSBcIi4vZXh0ZW50LmpzXCI7XG5pbXBvcnQgdHJlZV9maW5kIGZyb20gXCIuL2ZpbmQuanNcIjtcbmltcG9ydCB0cmVlX3JlbW92ZSwge3JlbW92ZUFsbCBhcyB0cmVlX3JlbW92ZUFsbH0gZnJvbSBcIi4vcmVtb3ZlLmpzXCI7XG5pbXBvcnQgdHJlZV9yb290IGZyb20gXCIuL3Jvb3QuanNcIjtcbmltcG9ydCB0cmVlX3NpemUgZnJvbSBcIi4vc2l6ZS5qc1wiO1xuaW1wb3J0IHRyZWVfdmlzaXQgZnJvbSBcIi4vdmlzaXQuanNcIjtcbmltcG9ydCB0cmVlX3Zpc2l0QWZ0ZXIgZnJvbSBcIi4vdmlzaXRBZnRlci5qc1wiO1xuaW1wb3J0IHRyZWVfeCwge2RlZmF1bHRYfSBmcm9tIFwiLi94LmpzXCI7XG5pbXBvcnQgdHJlZV95LCB7ZGVmYXVsdFl9IGZyb20gXCIuL3kuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcXVhZHRyZWUobm9kZXMsIHgsIHkpIHtcbiAgdmFyIHRyZWUgPSBuZXcgUXVhZHRyZWUoeCA9PSBudWxsID8gZGVmYXVsdFggOiB4LCB5ID09IG51bGwgPyBkZWZhdWx0WSA6IHksIE5hTiwgTmFOLCBOYU4sIE5hTik7XG4gIHJldHVybiBub2RlcyA9PSBudWxsID8gdHJlZSA6IHRyZWUuYWRkQWxsKG5vZGVzKTtcbn1cblxuZnVuY3Rpb24gUXVhZHRyZWUoeCwgeSwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgdGhpcy5feCA9IHg7XG4gIHRoaXMuX3kgPSB5O1xuICB0aGlzLl94MCA9IHgwO1xuICB0aGlzLl95MCA9IHkwO1xuICB0aGlzLl94MSA9IHgxO1xuICB0aGlzLl95MSA9IHkxO1xuICB0aGlzLl9yb290ID0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBsZWFmX2NvcHkobGVhZikge1xuICB2YXIgY29weSA9IHtkYXRhOiBsZWFmLmRhdGF9LCBuZXh0ID0gY29weTtcbiAgd2hpbGUgKGxlYWYgPSBsZWFmLm5leHQpIG5leHQgPSBuZXh0Lm5leHQgPSB7ZGF0YTogbGVhZi5kYXRhfTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbnZhciB0cmVlUHJvdG8gPSBxdWFkdHJlZS5wcm90b3R5cGUgPSBRdWFkdHJlZS5wcm90b3R5cGU7XG5cbnRyZWVQcm90by5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb3B5ID0gbmV3IFF1YWR0cmVlKHRoaXMuX3gsIHRoaXMuX3ksIHRoaXMuX3gwLCB0aGlzLl95MCwgdGhpcy5feDEsIHRoaXMuX3kxKSxcbiAgICAgIG5vZGUgPSB0aGlzLl9yb290LFxuICAgICAgbm9kZXMsXG4gICAgICBjaGlsZDtcblxuICBpZiAoIW5vZGUpIHJldHVybiBjb3B5O1xuXG4gIGlmICghbm9kZS5sZW5ndGgpIHJldHVybiBjb3B5Ll9yb290ID0gbGVhZl9jb3B5KG5vZGUpLCBjb3B5O1xuXG4gIG5vZGVzID0gW3tzb3VyY2U6IG5vZGUsIHRhcmdldDogY29weS5fcm9vdCA9IG5ldyBBcnJheSg0KX1dO1xuICB3aGlsZSAobm9kZSA9IG5vZGVzLnBvcCgpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGUuc291cmNlW2ldKSB7XG4gICAgICAgIGlmIChjaGlsZC5sZW5ndGgpIG5vZGVzLnB1c2goe3NvdXJjZTogY2hpbGQsIHRhcmdldDogbm9kZS50YXJnZXRbaV0gPSBuZXcgQXJyYXkoNCl9KTtcbiAgICAgICAgZWxzZSBub2RlLnRhcmdldFtpXSA9IGxlYWZfY29weShjaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvcHk7XG59O1xuXG50cmVlUHJvdG8uYWRkID0gdHJlZV9hZGQ7XG50cmVlUHJvdG8uYWRkQWxsID0gdHJlZV9hZGRBbGw7XG50cmVlUHJvdG8uY292ZXIgPSB0cmVlX2NvdmVyO1xudHJlZVByb3RvLmRhdGEgPSB0cmVlX2RhdGE7XG50cmVlUHJvdG8uZXh0ZW50ID0gdHJlZV9leHRlbnQ7XG50cmVlUHJvdG8uZmluZCA9IHRyZWVfZmluZDtcbnRyZWVQcm90by5yZW1vdmUgPSB0cmVlX3JlbW92ZTtcbnRyZWVQcm90by5yZW1vdmVBbGwgPSB0cmVlX3JlbW92ZUFsbDtcbnRyZWVQcm90by5yb290ID0gdHJlZV9yb290O1xudHJlZVByb3RvLnNpemUgPSB0cmVlX3NpemU7XG50cmVlUHJvdG8udmlzaXQgPSB0cmVlX3Zpc2l0O1xudHJlZVByb3RvLnZpc2l0QWZ0ZXIgPSB0cmVlX3Zpc2l0QWZ0ZXI7XG50cmVlUHJvdG8ueCA9IHRyZWVfeDtcbnRyZWVQcm90by55ID0gdHJlZV95O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHJhbmRvbSkge1xuICByZXR1cm4gKHJhbmRvbSgpIC0gMC41KSAqIDFlLTY7XG59XG4iLCAiaW1wb3J0IHtxdWFkdHJlZX0gZnJvbSBcImQzLXF1YWR0cmVlXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBqaWdnbGUgZnJvbSBcIi4vamlnZ2xlLmpzXCI7XG5cbmZ1bmN0aW9uIHgoZCkge1xuICByZXR1cm4gZC54ICsgZC52eDtcbn1cblxuZnVuY3Rpb24geShkKSB7XG4gIHJldHVybiBkLnkgKyBkLnZ5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyYWRpdXMpIHtcbiAgdmFyIG5vZGVzLFxuICAgICAgcmFkaWksXG4gICAgICByYW5kb20sXG4gICAgICBzdHJlbmd0aCA9IDEsXG4gICAgICBpdGVyYXRpb25zID0gMTtcblxuICBpZiAodHlwZW9mIHJhZGl1cyAhPT0gXCJmdW5jdGlvblwiKSByYWRpdXMgPSBjb25zdGFudChyYWRpdXMgPT0gbnVsbCA/IDEgOiArcmFkaXVzKTtcblxuICBmdW5jdGlvbiBmb3JjZSgpIHtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgdHJlZSxcbiAgICAgICAgbm9kZSxcbiAgICAgICAgeGksXG4gICAgICAgIHlpLFxuICAgICAgICByaSxcbiAgICAgICAgcmkyO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBpdGVyYXRpb25zOyArK2spIHtcbiAgICAgIHRyZWUgPSBxdWFkdHJlZShub2RlcywgeCwgeSkudmlzaXRBZnRlcihwcmVwYXJlKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICByaSA9IHJhZGlpW25vZGUuaW5kZXhdLCByaTIgPSByaSAqIHJpO1xuICAgICAgICB4aSA9IG5vZGUueCArIG5vZGUudng7XG4gICAgICAgIHlpID0gbm9kZS55ICsgbm9kZS52eTtcbiAgICAgICAgdHJlZS52aXNpdChhcHBseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHkocXVhZCwgeDAsIHkwLCB4MSwgeTEpIHtcbiAgICAgIHZhciBkYXRhID0gcXVhZC5kYXRhLCByaiA9IHF1YWQuciwgciA9IHJpICsgcmo7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5pbmRleCA+IG5vZGUuaW5kZXgpIHtcbiAgICAgICAgICB2YXIgeCA9IHhpIC0gZGF0YS54IC0gZGF0YS52eCxcbiAgICAgICAgICAgICAgeSA9IHlpIC0gZGF0YS55IC0gZGF0YS52eSxcbiAgICAgICAgICAgICAgbCA9IHggKiB4ICsgeSAqIHk7XG4gICAgICAgICAgaWYgKGwgPCByICogcikge1xuICAgICAgICAgICAgaWYgKHggPT09IDApIHggPSBqaWdnbGUocmFuZG9tKSwgbCArPSB4ICogeDtcbiAgICAgICAgICAgIGlmICh5ID09PSAwKSB5ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geSAqIHk7XG4gICAgICAgICAgICBsID0gKHIgLSAobCA9IE1hdGguc3FydChsKSkpIC8gbCAqIHN0cmVuZ3RoO1xuICAgICAgICAgICAgbm9kZS52eCArPSAoeCAqPSBsKSAqIChyID0gKHJqICo9IHJqKSAvIChyaTIgKyByaikpO1xuICAgICAgICAgICAgbm9kZS52eSArPSAoeSAqPSBsKSAqIHI7XG4gICAgICAgICAgICBkYXRhLnZ4IC09IHggKiAociA9IDEgLSByKTtcbiAgICAgICAgICAgIGRhdGEudnkgLT0geSAqIHI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB4MCA+IHhpICsgciB8fCB4MSA8IHhpIC0gciB8fCB5MCA+IHlpICsgciB8fCB5MSA8IHlpIC0gcjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcmVwYXJlKHF1YWQpIHtcbiAgICBpZiAocXVhZC5kYXRhKSByZXR1cm4gcXVhZC5yID0gcmFkaWlbcXVhZC5kYXRhLmluZGV4XTtcbiAgICBmb3IgKHZhciBpID0gcXVhZC5yID0gMDsgaSA8IDQ7ICsraSkge1xuICAgICAgaWYgKHF1YWRbaV0gJiYgcXVhZFtpXS5yID4gcXVhZC5yKSB7XG4gICAgICAgIHF1YWQuciA9IHF1YWRbaV0ucjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcbiAgICByYWRpaSA9IG5ldyBBcnJheShuKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSBub2RlID0gbm9kZXNbaV0sIHJhZGlpW25vZGUuaW5kZXhdID0gK3JhZGl1cyhub2RlLCBpLCBub2Rlcyk7XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2UuaXRlcmF0aW9ucyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpdGVyYXRpb25zID0gK18sIGZvcmNlKSA6IGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSArXywgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UucmFkaXVzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHJhZGl1cyA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHJhZGl1cztcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgamlnZ2xlIGZyb20gXCIuL2ppZ2dsZS5qc1wiO1xuXG5mdW5jdGlvbiBpbmRleChkKSB7XG4gIHJldHVybiBkLmluZGV4O1xufVxuXG5mdW5jdGlvbiBmaW5kKG5vZGVCeUlkLCBub2RlSWQpIHtcbiAgdmFyIG5vZGUgPSBub2RlQnlJZC5nZXQobm9kZUlkKTtcbiAgaWYgKCFub2RlKSB0aHJvdyBuZXcgRXJyb3IoXCJub2RlIG5vdCBmb3VuZDogXCIgKyBub2RlSWQpO1xuICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obGlua3MpIHtcbiAgdmFyIGlkID0gaW5kZXgsXG4gICAgICBzdHJlbmd0aCA9IGRlZmF1bHRTdHJlbmd0aCxcbiAgICAgIHN0cmVuZ3RocyxcbiAgICAgIGRpc3RhbmNlID0gY29uc3RhbnQoMzApLFxuICAgICAgZGlzdGFuY2VzLFxuICAgICAgbm9kZXMsXG4gICAgICBjb3VudCxcbiAgICAgIGJpYXMsXG4gICAgICByYW5kb20sXG4gICAgICBpdGVyYXRpb25zID0gMTtcblxuICBpZiAobGlua3MgPT0gbnVsbCkgbGlua3MgPSBbXTtcblxuICBmdW5jdGlvbiBkZWZhdWx0U3RyZW5ndGgobGluaykge1xuICAgIHJldHVybiAxIC8gTWF0aC5taW4oY291bnRbbGluay5zb3VyY2UuaW5kZXhdLCBjb3VudFtsaW5rLnRhcmdldC5pbmRleF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9yY2UoYWxwaGEpIHtcbiAgICBmb3IgKHZhciBrID0gMCwgbiA9IGxpbmtzLmxlbmd0aDsgayA8IGl0ZXJhdGlvbnM7ICsraykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxpbmssIHNvdXJjZSwgdGFyZ2V0LCB4LCB5LCBsLCBiOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGxpbmsgPSBsaW5rc1tpXSwgc291cmNlID0gbGluay5zb3VyY2UsIHRhcmdldCA9IGxpbmsudGFyZ2V0O1xuICAgICAgICB4ID0gdGFyZ2V0LnggKyB0YXJnZXQudnggLSBzb3VyY2UueCAtIHNvdXJjZS52eCB8fCBqaWdnbGUocmFuZG9tKTtcbiAgICAgICAgeSA9IHRhcmdldC55ICsgdGFyZ2V0LnZ5IC0gc291cmNlLnkgLSBzb3VyY2UudnkgfHwgamlnZ2xlKHJhbmRvbSk7XG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgICAgIGwgPSAobCAtIGRpc3RhbmNlc1tpXSkgLyBsICogYWxwaGEgKiBzdHJlbmd0aHNbaV07XG4gICAgICAgIHggKj0gbCwgeSAqPSBsO1xuICAgICAgICB0YXJnZXQudnggLT0geCAqIChiID0gYmlhc1tpXSk7XG4gICAgICAgIHRhcmdldC52eSAtPSB5ICogYjtcbiAgICAgICAgc291cmNlLnZ4ICs9IHggKiAoYiA9IDEgLSBiKTtcbiAgICAgICAgc291cmNlLnZ5ICs9IHkgKiBiO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCFub2RlcykgcmV0dXJuO1xuXG4gICAgdmFyIGksXG4gICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgIG0gPSBsaW5rcy5sZW5ndGgsXG4gICAgICAgIG5vZGVCeUlkID0gbmV3IE1hcChub2Rlcy5tYXAoKGQsIGkpID0+IFtpZChkLCBpLCBub2RlcyksIGRdKSksXG4gICAgICAgIGxpbms7XG5cbiAgICBmb3IgKGkgPSAwLCBjb3VudCA9IG5ldyBBcnJheShuKTsgaSA8IG07ICsraSkge1xuICAgICAgbGluayA9IGxpbmtzW2ldLCBsaW5rLmluZGV4ID0gaTtcbiAgICAgIGlmICh0eXBlb2YgbGluay5zb3VyY2UgIT09IFwib2JqZWN0XCIpIGxpbmsuc291cmNlID0gZmluZChub2RlQnlJZCwgbGluay5zb3VyY2UpO1xuICAgICAgaWYgKHR5cGVvZiBsaW5rLnRhcmdldCAhPT0gXCJvYmplY3RcIikgbGluay50YXJnZXQgPSBmaW5kKG5vZGVCeUlkLCBsaW5rLnRhcmdldCk7XG4gICAgICBjb3VudFtsaW5rLnNvdXJjZS5pbmRleF0gPSAoY291bnRbbGluay5zb3VyY2UuaW5kZXhdIHx8IDApICsgMTtcbiAgICAgIGNvdW50W2xpbmsudGFyZ2V0LmluZGV4XSA9IChjb3VudFtsaW5rLnRhcmdldC5pbmRleF0gfHwgMCkgKyAxO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGJpYXMgPSBuZXcgQXJyYXkobSk7IGkgPCBtOyArK2kpIHtcbiAgICAgIGxpbmsgPSBsaW5rc1tpXSwgYmlhc1tpXSA9IGNvdW50W2xpbmsuc291cmNlLmluZGV4XSAvIChjb3VudFtsaW5rLnNvdXJjZS5pbmRleF0gKyBjb3VudFtsaW5rLnRhcmdldC5pbmRleF0pO1xuICAgIH1cblxuICAgIHN0cmVuZ3RocyA9IG5ldyBBcnJheShtKSwgaW5pdGlhbGl6ZVN0cmVuZ3RoKCk7XG4gICAgZGlzdGFuY2VzID0gbmV3IEFycmF5KG0pLCBpbml0aWFsaXplRGlzdGFuY2UoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVTdHJlbmd0aCgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxpbmtzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgc3RyZW5ndGhzW2ldID0gK3N0cmVuZ3RoKGxpbmtzW2ldLCBpLCBsaW5rcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZURpc3RhbmNlKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbGlua3MubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICBkaXN0YW5jZXNbaV0gPSArZGlzdGFuY2UobGlua3NbaV0sIGksIGxpbmtzKTtcbiAgICB9XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2UubGlua3MgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobGlua3MgPSBfLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IGxpbmtzO1xuICB9O1xuXG4gIGZvcmNlLmlkID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGlkID0gXywgZm9yY2UpIDogaWQ7XG4gIH07XG5cbiAgZm9yY2UuaXRlcmF0aW9ucyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpdGVyYXRpb25zID0gK18sIGZvcmNlKSA6IGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgaW5pdGlhbGl6ZVN0cmVuZ3RoKCksIGZvcmNlKSA6IHN0cmVuZ3RoO1xuICB9O1xuXG4gIGZvcmNlLmRpc3RhbmNlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRpc3RhbmNlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemVEaXN0YW5jZSgpLCBmb3JjZSkgOiBkaXN0YW5jZTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGluZWFyX2NvbmdydWVudGlhbF9nZW5lcmF0b3IjUGFyYW1ldGVyc19pbl9jb21tb25fdXNlXG5jb25zdCBhID0gMTY2NDUyNTtcbmNvbnN0IGMgPSAxMDEzOTA0MjIzO1xuY29uc3QgbSA9IDQyOTQ5NjcyOTY7IC8vIDJeMzJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIGxldCBzID0gMTtcbiAgcmV0dXJuICgpID0+IChzID0gKGEgKiBzICsgYykgJSBtKSAvIG07XG59XG4iLCAiaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5pbXBvcnQge3RpbWVyfSBmcm9tIFwiZDMtdGltZXJcIjtcbmltcG9ydCBsY2cgZnJvbSBcIi4vbGNnLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB4KGQpIHtcbiAgcmV0dXJuIGQueDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHkoZCkge1xuICByZXR1cm4gZC55O1xufVxuXG52YXIgaW5pdGlhbFJhZGl1cyA9IDEwLFxuICAgIGluaXRpYWxBbmdsZSA9IE1hdGguUEkgKiAoMyAtIE1hdGguc3FydCg1KSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGVzKSB7XG4gIHZhciBzaW11bGF0aW9uLFxuICAgICAgYWxwaGEgPSAxLFxuICAgICAgYWxwaGFNaW4gPSAwLjAwMSxcbiAgICAgIGFscGhhRGVjYXkgPSAxIC0gTWF0aC5wb3coYWxwaGFNaW4sIDEgLyAzMDApLFxuICAgICAgYWxwaGFUYXJnZXQgPSAwLFxuICAgICAgdmVsb2NpdHlEZWNheSA9IDAuNixcbiAgICAgIGZvcmNlcyA9IG5ldyBNYXAoKSxcbiAgICAgIHN0ZXBwZXIgPSB0aW1lcihzdGVwKSxcbiAgICAgIGV2ZW50ID0gZGlzcGF0Y2goXCJ0aWNrXCIsIFwiZW5kXCIpLFxuICAgICAgcmFuZG9tID0gbGNnKCk7XG5cbiAgaWYgKG5vZGVzID09IG51bGwpIG5vZGVzID0gW107XG5cbiAgZnVuY3Rpb24gc3RlcCgpIHtcbiAgICB0aWNrKCk7XG4gICAgZXZlbnQuY2FsbChcInRpY2tcIiwgc2ltdWxhdGlvbik7XG4gICAgaWYgKGFscGhhIDwgYWxwaGFNaW4pIHtcbiAgICAgIHN0ZXBwZXIuc3RvcCgpO1xuICAgICAgZXZlbnQuY2FsbChcImVuZFwiLCBzaW11bGF0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrKGl0ZXJhdGlvbnMpIHtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcblxuICAgIGlmIChpdGVyYXRpb25zID09PSB1bmRlZmluZWQpIGl0ZXJhdGlvbnMgPSAxO1xuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBpdGVyYXRpb25zOyArK2spIHtcbiAgICAgIGFscGhhICs9IChhbHBoYVRhcmdldCAtIGFscGhhKSAqIGFscGhhRGVjYXk7XG5cbiAgICAgIGZvcmNlcy5mb3JFYWNoKGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIGZvcmNlKGFscGhhKTtcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUuZnggPT0gbnVsbCkgbm9kZS54ICs9IG5vZGUudnggKj0gdmVsb2NpdHlEZWNheTtcbiAgICAgICAgZWxzZSBub2RlLnggPSBub2RlLmZ4LCBub2RlLnZ4ID0gMDtcbiAgICAgICAgaWYgKG5vZGUuZnkgPT0gbnVsbCkgbm9kZS55ICs9IG5vZGUudnkgKj0gdmVsb2NpdHlEZWNheTtcbiAgICAgICAgZWxzZSBub2RlLnkgPSBub2RlLmZ5LCBub2RlLnZ5ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2ltdWxhdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVOb2RlcygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgbm9kZSA9IG5vZGVzW2ldLCBub2RlLmluZGV4ID0gaTtcbiAgICAgIGlmIChub2RlLmZ4ICE9IG51bGwpIG5vZGUueCA9IG5vZGUuZng7XG4gICAgICBpZiAobm9kZS5meSAhPSBudWxsKSBub2RlLnkgPSBub2RlLmZ5O1xuICAgICAgaWYgKGlzTmFOKG5vZGUueCkgfHwgaXNOYU4obm9kZS55KSkge1xuICAgICAgICB2YXIgcmFkaXVzID0gaW5pdGlhbFJhZGl1cyAqIE1hdGguc3FydCgwLjUgKyBpKSwgYW5nbGUgPSBpICogaW5pdGlhbEFuZ2xlO1xuICAgICAgICBub2RlLnggPSByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIG5vZGUueSA9IHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hTihub2RlLnZ4KSB8fCBpc05hTihub2RlLnZ5KSkge1xuICAgICAgICBub2RlLnZ4ID0gbm9kZS52eSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZUZvcmNlKGZvcmNlKSB7XG4gICAgaWYgKGZvcmNlLmluaXRpYWxpemUpIGZvcmNlLmluaXRpYWxpemUobm9kZXMsIHJhbmRvbSk7XG4gICAgcmV0dXJuIGZvcmNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZU5vZGVzKCk7XG5cbiAgcmV0dXJuIHNpbXVsYXRpb24gPSB7XG4gICAgdGljazogdGljayxcblxuICAgIHJlc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN0ZXBwZXIucmVzdGFydChzdGVwKSwgc2ltdWxhdGlvbjtcbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3RlcHBlci5zdG9wKCksIHNpbXVsYXRpb247XG4gICAgfSxcblxuICAgIG5vZGVzOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChub2RlcyA9IF8sIGluaXRpYWxpemVOb2RlcygpLCBmb3JjZXMuZm9yRWFjaChpbml0aWFsaXplRm9yY2UpLCBzaW11bGF0aW9uKSA6IG5vZGVzO1xuICAgIH0sXG5cbiAgICBhbHBoYTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoYWxwaGEgPSArXywgc2ltdWxhdGlvbikgOiBhbHBoYTtcbiAgICB9LFxuXG4gICAgYWxwaGFNaW46IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhTWluID0gK18sIHNpbXVsYXRpb24pIDogYWxwaGFNaW47XG4gICAgfSxcblxuICAgIGFscGhhRGVjYXk6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhRGVjYXkgPSArXywgc2ltdWxhdGlvbikgOiArYWxwaGFEZWNheTtcbiAgICB9LFxuXG4gICAgYWxwaGFUYXJnZXQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhVGFyZ2V0ID0gK18sIHNpbXVsYXRpb24pIDogYWxwaGFUYXJnZXQ7XG4gICAgfSxcblxuICAgIHZlbG9jaXR5RGVjYXk6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHZlbG9jaXR5RGVjYXkgPSAxIC0gXywgc2ltdWxhdGlvbikgOiAxIC0gdmVsb2NpdHlEZWNheTtcbiAgICB9LFxuXG4gICAgcmFuZG9tU291cmNlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYW5kb20gPSBfLCBmb3JjZXMuZm9yRWFjaChpbml0aWFsaXplRm9yY2UpLCBzaW11bGF0aW9uKSA6IHJhbmRvbTtcbiAgICB9LFxuXG4gICAgZm9yY2U6IGZ1bmN0aW9uKG5hbWUsIF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMSA/ICgoXyA9PSBudWxsID8gZm9yY2VzLmRlbGV0ZShuYW1lKSA6IGZvcmNlcy5zZXQobmFtZSwgaW5pdGlhbGl6ZUZvcmNlKF8pKSksIHNpbXVsYXRpb24pIDogZm9yY2VzLmdldChuYW1lKTtcbiAgICB9LFxuXG4gICAgZmluZDogZnVuY3Rpb24oeCwgeSwgcmFkaXVzKSB7XG4gICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgbiA9IG5vZGVzLmxlbmd0aCxcbiAgICAgICAgICBkeCxcbiAgICAgICAgICBkeSxcbiAgICAgICAgICBkMixcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGNsb3Nlc3Q7XG5cbiAgICAgIGlmIChyYWRpdXMgPT0gbnVsbCkgcmFkaXVzID0gSW5maW5pdHk7XG4gICAgICBlbHNlIHJhZGl1cyAqPSByYWRpdXM7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBkeCA9IHggLSBub2RlLng7XG4gICAgICAgIGR5ID0geSAtIG5vZGUueTtcbiAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgaWYgKGQyIDwgcmFkaXVzKSBjbG9zZXN0ID0gbm9kZSwgcmFkaXVzID0gZDI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjbG9zZXN0O1xuICAgIH0sXG5cbiAgICBvbjogZnVuY3Rpb24obmFtZSwgXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gKGV2ZW50Lm9uKG5hbWUsIF8pLCBzaW11bGF0aW9uKSA6IGV2ZW50Lm9uKG5hbWUpO1xuICAgIH1cbiAgfTtcbn1cbiIsICJpbXBvcnQge3F1YWR0cmVlfSBmcm9tIFwiZDMtcXVhZHRyZWVcIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IGppZ2dsZSBmcm9tIFwiLi9qaWdnbGUuanNcIjtcbmltcG9ydCB7eCwgeX0gZnJvbSBcIi4vc2ltdWxhdGlvbi5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgdmFyIG5vZGVzLFxuICAgICAgbm9kZSxcbiAgICAgIHJhbmRvbSxcbiAgICAgIGFscGhhLFxuICAgICAgc3RyZW5ndGggPSBjb25zdGFudCgtMzApLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgZGlzdGFuY2VNaW4yID0gMSxcbiAgICAgIGRpc3RhbmNlTWF4MiA9IEluZmluaXR5LFxuICAgICAgdGhldGEyID0gMC44MTtcblxuICBmdW5jdGlvbiBmb3JjZShfKSB7XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsIHRyZWUgPSBxdWFkdHJlZShub2RlcywgeCwgeSkudmlzaXRBZnRlcihhY2N1bXVsYXRlKTtcbiAgICBmb3IgKGFscGhhID0gXywgaSA9IDA7IGkgPCBuOyArK2kpIG5vZGUgPSBub2Rlc1tpXSwgdHJlZS52aXNpdChhcHBseSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcbiAgICB2YXIgaSwgbiA9IG5vZGVzLmxlbmd0aCwgbm9kZTtcbiAgICBzdHJlbmd0aHMgPSBuZXcgQXJyYXkobik7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgbm9kZSA9IG5vZGVzW2ldLCBzdHJlbmd0aHNbbm9kZS5pbmRleF0gPSArc3RyZW5ndGgobm9kZSwgaSwgbm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWNjdW11bGF0ZShxdWFkKSB7XG4gICAgdmFyIHN0cmVuZ3RoID0gMCwgcSwgYywgd2VpZ2h0ID0gMCwgeCwgeSwgaTtcblxuICAgIC8vIEZvciBpbnRlcm5hbCBub2RlcywgYWNjdW11bGF0ZSBmb3JjZXMgZnJvbSBjaGlsZCBxdWFkcmFudHMuXG4gICAgaWYgKHF1YWQubGVuZ3RoKSB7XG4gICAgICBmb3IgKHggPSB5ID0gaSA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgICAgaWYgKChxID0gcXVhZFtpXSkgJiYgKGMgPSBNYXRoLmFicyhxLnZhbHVlKSkpIHtcbiAgICAgICAgICBzdHJlbmd0aCArPSBxLnZhbHVlLCB3ZWlnaHQgKz0gYywgeCArPSBjICogcS54LCB5ICs9IGMgKiBxLnk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHF1YWQueCA9IHggLyB3ZWlnaHQ7XG4gICAgICBxdWFkLnkgPSB5IC8gd2VpZ2h0O1xuICAgIH1cblxuICAgIC8vIEZvciBsZWFmIG5vZGVzLCBhY2N1bXVsYXRlIGZvcmNlcyBmcm9tIGNvaW5jaWRlbnQgcXVhZHJhbnRzLlxuICAgIGVsc2Uge1xuICAgICAgcSA9IHF1YWQ7XG4gICAgICBxLnggPSBxLmRhdGEueDtcbiAgICAgIHEueSA9IHEuZGF0YS55O1xuICAgICAgZG8gc3RyZW5ndGggKz0gc3RyZW5ndGhzW3EuZGF0YS5pbmRleF07XG4gICAgICB3aGlsZSAocSA9IHEubmV4dCk7XG4gICAgfVxuXG4gICAgcXVhZC52YWx1ZSA9IHN0cmVuZ3RoO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHkocXVhZCwgeDEsIF8sIHgyKSB7XG4gICAgaWYgKCFxdWFkLnZhbHVlKSByZXR1cm4gdHJ1ZTtcblxuICAgIHZhciB4ID0gcXVhZC54IC0gbm9kZS54LFxuICAgICAgICB5ID0gcXVhZC55IC0gbm9kZS55LFxuICAgICAgICB3ID0geDIgLSB4MSxcbiAgICAgICAgbCA9IHggKiB4ICsgeSAqIHk7XG5cbiAgICAvLyBBcHBseSB0aGUgQmFybmVzLUh1dCBhcHByb3hpbWF0aW9uIGlmIHBvc3NpYmxlLlxuICAgIC8vIExpbWl0IGZvcmNlcyBmb3IgdmVyeSBjbG9zZSBub2RlczsgcmFuZG9taXplIGRpcmVjdGlvbiBpZiBjb2luY2lkZW50LlxuICAgIGlmICh3ICogdyAvIHRoZXRhMiA8IGwpIHtcbiAgICAgIGlmIChsIDwgZGlzdGFuY2VNYXgyKSB7XG4gICAgICAgIGlmICh4ID09PSAwKSB4ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geCAqIHg7XG4gICAgICAgIGlmICh5ID09PSAwKSB5ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geSAqIHk7XG4gICAgICAgIGlmIChsIDwgZGlzdGFuY2VNaW4yKSBsID0gTWF0aC5zcXJ0KGRpc3RhbmNlTWluMiAqIGwpO1xuICAgICAgICBub2RlLnZ4ICs9IHggKiBxdWFkLnZhbHVlICogYWxwaGEgLyBsO1xuICAgICAgICBub2RlLnZ5ICs9IHkgKiBxdWFkLnZhbHVlICogYWxwaGEgLyBsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlLCBwcm9jZXNzIHBvaW50cyBkaXJlY3RseS5cbiAgICBlbHNlIGlmIChxdWFkLmxlbmd0aCB8fCBsID49IGRpc3RhbmNlTWF4MikgcmV0dXJuO1xuXG4gICAgLy8gTGltaXQgZm9yY2VzIGZvciB2ZXJ5IGNsb3NlIG5vZGVzOyByYW5kb21pemUgZGlyZWN0aW9uIGlmIGNvaW5jaWRlbnQuXG4gICAgaWYgKHF1YWQuZGF0YSAhPT0gbm9kZSB8fCBxdWFkLm5leHQpIHtcbiAgICAgIGlmICh4ID09PSAwKSB4ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geCAqIHg7XG4gICAgICBpZiAoeSA9PT0gMCkgeSA9IGppZ2dsZShyYW5kb20pLCBsICs9IHkgKiB5O1xuICAgICAgaWYgKGwgPCBkaXN0YW5jZU1pbjIpIGwgPSBNYXRoLnNxcnQoZGlzdGFuY2VNaW4yICogbCk7XG4gICAgfVxuXG4gICAgZG8gaWYgKHF1YWQuZGF0YSAhPT0gbm9kZSkge1xuICAgICAgdyA9IHN0cmVuZ3Roc1txdWFkLmRhdGEuaW5kZXhdICogYWxwaGEgLyBsO1xuICAgICAgbm9kZS52eCArPSB4ICogdztcbiAgICAgIG5vZGUudnkgKz0geSAqIHc7XG4gICAgfSB3aGlsZSAocXVhZCA9IHF1YWQubmV4dCk7XG4gIH1cblxuICBmb3JjZS5pbml0aWFsaXplID0gZnVuY3Rpb24oX25vZGVzLCBfcmFuZG9tKSB7XG4gICAgbm9kZXMgPSBfbm9kZXM7XG4gICAgcmFuZG9tID0gX3JhbmRvbTtcbiAgICBpbml0aWFsaXplKCk7XG4gIH07XG5cbiAgZm9yY2Uuc3RyZW5ndGggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc3RyZW5ndGggPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgaW5pdGlhbGl6ZSgpLCBmb3JjZSkgOiBzdHJlbmd0aDtcbiAgfTtcblxuICBmb3JjZS5kaXN0YW5jZU1pbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkaXN0YW5jZU1pbjIgPSBfICogXywgZm9yY2UpIDogTWF0aC5zcXJ0KGRpc3RhbmNlTWluMik7XG4gIH07XG5cbiAgZm9yY2UuZGlzdGFuY2VNYXggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZGlzdGFuY2VNYXgyID0gXyAqIF8sIGZvcmNlKSA6IE1hdGguc3FydChkaXN0YW5jZU1heDIpO1xuICB9O1xuXG4gIGZvcmNlLnRoZXRhID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRoZXRhMiA9IF8gKiBfLCBmb3JjZSkgOiBNYXRoLnNxcnQodGhldGEyKTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgdmFyIHN0cmVuZ3RoID0gY29uc3RhbnQoMC4xKSxcbiAgICAgIG5vZGVzLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgeHo7XG5cbiAgaWYgKHR5cGVvZiB4ICE9PSBcImZ1bmN0aW9uXCIpIHggPSBjb25zdGFudCh4ID09IG51bGwgPyAwIDogK3gpO1xuXG4gIGZ1bmN0aW9uIGZvcmNlKGFscGhhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tpXSwgbm9kZS52eCArPSAoeHpbaV0gLSBub2RlLngpICogc3RyZW5ndGhzW2ldICogYWxwaGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGg7XG4gICAgc3RyZW5ndGhzID0gbmV3IEFycmF5KG4pO1xuICAgIHh6ID0gbmV3IEFycmF5KG4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN0cmVuZ3Roc1tpXSA9IGlzTmFOKHh6W2ldID0gK3gobm9kZXNbaV0sIGksIG5vZGVzKSkgPyAwIDogK3N0cmVuZ3RoKG5vZGVzW2ldLCBpLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBub2RlcyA9IF87XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UueCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh4ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogeDtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHkpIHtcbiAgdmFyIHN0cmVuZ3RoID0gY29uc3RhbnQoMC4xKSxcbiAgICAgIG5vZGVzLFxuICAgICAgc3RyZW5ndGhzLFxuICAgICAgeXo7XG5cbiAgaWYgKHR5cGVvZiB5ICE9PSBcImZ1bmN0aW9uXCIpIHkgPSBjb25zdGFudCh5ID09IG51bGwgPyAwIDogK3kpO1xuXG4gIGZ1bmN0aW9uIGZvcmNlKGFscGhhKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tpXSwgbm9kZS52eSArPSAoeXpbaV0gLSBub2RlLnkpICogc3RyZW5ndGhzW2ldICogYWxwaGE7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGg7XG4gICAgc3RyZW5ndGhzID0gbmV3IEFycmF5KG4pO1xuICAgIHl6ID0gbmV3IEFycmF5KG4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN0cmVuZ3Roc1tpXSA9IGlzTmFOKHl6W2ldID0gK3kobm9kZXNbaV0sIGksIG5vZGVzKSkgPyAwIDogK3N0cmVuZ3RoKG5vZGVzW2ldLCBpLCBub2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICBub2RlcyA9IF87XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UueSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh5ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogeTtcbiAgfTtcblxuICByZXR1cm4gZm9yY2U7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGluaXRSYW5nZShkb21haW4sIHJhbmdlKSB7XG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogYnJlYWs7XG4gICAgY2FzZSAxOiB0aGlzLnJhbmdlKGRvbWFpbik7IGJyZWFrO1xuICAgIGRlZmF1bHQ6IHRoaXMucmFuZ2UocmFuZ2UpLmRvbWFpbihkb21haW4pOyBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRJbnRlcnBvbGF0b3IoZG9tYWluLCBpbnRlcnBvbGF0b3IpIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiBicmVhaztcbiAgICBjYXNlIDE6IHtcbiAgICAgIGlmICh0eXBlb2YgZG9tYWluID09PSBcImZ1bmN0aW9uXCIpIHRoaXMuaW50ZXJwb2xhdG9yKGRvbWFpbik7XG4gICAgICBlbHNlIHRoaXMucmFuZ2UoZG9tYWluKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICB0aGlzLmRvbWFpbihkb21haW4pO1xuICAgICAgaWYgKHR5cGVvZiBpbnRlcnBvbGF0b3IgPT09IFwiZnVuY3Rpb25cIikgdGhpcy5pbnRlcnBvbGF0b3IoaW50ZXJwb2xhdG9yKTtcbiAgICAgIGVsc2UgdGhpcy5yYW5nZShpbnRlcnBvbGF0b3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImltcG9ydCB7SW50ZXJuTWFwfSBmcm9tIFwiZDMtYXJyYXlcIjtcbmltcG9ydCB7aW5pdFJhbmdlfSBmcm9tIFwiLi9pbml0LmpzXCI7XG5cbmV4cG9ydCBjb25zdCBpbXBsaWNpdCA9IFN5bWJvbChcImltcGxpY2l0XCIpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcmRpbmFsKCkge1xuICB2YXIgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCksXG4gICAgICBkb21haW4gPSBbXSxcbiAgICAgIHJhbmdlID0gW10sXG4gICAgICB1bmtub3duID0gaW1wbGljaXQ7XG5cbiAgZnVuY3Rpb24gc2NhbGUoZCkge1xuICAgIGxldCBpID0gaW5kZXguZ2V0KGQpO1xuICAgIGlmIChpID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh1bmtub3duICE9PSBpbXBsaWNpdCkgcmV0dXJuIHVua25vd247XG4gICAgICBpbmRleC5zZXQoZCwgaSA9IGRvbWFpbi5wdXNoKGQpIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVtpICUgcmFuZ2UubGVuZ3RoXTtcbiAgfVxuXG4gIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICBkb21haW4gPSBbXSwgaW5kZXggPSBuZXcgSW50ZXJuTWFwKCk7XG4gICAgZm9yIChjb25zdCB2YWx1ZSBvZiBfKSB7XG4gICAgICBpZiAoaW5kZXguaGFzKHZhbHVlKSkgY29udGludWU7XG4gICAgICBpbmRleC5zZXQodmFsdWUsIGRvbWFpbi5wdXNoKHZhbHVlKSAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGU7XG4gIH07XG5cbiAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZ2UgPSBBcnJheS5mcm9tKF8pLCBzY2FsZSkgOiByYW5nZS5zbGljZSgpO1xuICB9O1xuXG4gIHNjYWxlLnVua25vd24gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodW5rbm93biA9IF8sIHNjYWxlKSA6IHVua25vd247XG4gIH07XG5cbiAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBvcmRpbmFsKGRvbWFpbiwgcmFuZ2UpLnVua25vd24odW5rbm93bik7XG4gIH07XG5cbiAgaW5pdFJhbmdlLmFwcGx5KHNjYWxlLCBhcmd1bWVudHMpO1xuXG4gIHJldHVybiBzY2FsZTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzcGVjaWZpZXIpIHtcbiAgdmFyIG4gPSBzcGVjaWZpZXIubGVuZ3RoIC8gNiB8IDAsIGNvbG9ycyA9IG5ldyBBcnJheShuKSwgaSA9IDA7XG4gIHdoaWxlIChpIDwgbikgY29sb3JzW2ldID0gXCIjXCIgKyBzcGVjaWZpZXIuc2xpY2UoaSAqIDYsICsraSAqIDYpO1xuICByZXR1cm4gY29sb3JzO1xufVxuIiwgImltcG9ydCBjb2xvcnMgZnJvbSBcIi4uL2NvbG9ycy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnMoXCI0ZTc5YTdmMjhlMmNlMTU3NTk3NmI3YjI1OWExNGZlZGM5NDlhZjdhYTFmZjlkYTc5Yzc1NWZiYWIwYWJcIik7XG4iLCAiZXhwb3J0IGRlZmF1bHQgeCA9PiAoKSA9PiB4O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFpvb21FdmVudCh0eXBlLCB7XG4gIHNvdXJjZUV2ZW50LFxuICB0YXJnZXQsXG4gIHRyYW5zZm9ybSxcbiAgZGlzcGF0Y2hcbn0pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcywge1xuICAgIHR5cGU6IHt2YWx1ZTogdHlwZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBzb3VyY2VFdmVudDoge3ZhbHVlOiBzb3VyY2VFdmVudCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB0YXJnZXQ6IHt2YWx1ZTogdGFyZ2V0LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHRyYW5zZm9ybToge3ZhbHVlOiB0cmFuc2Zvcm0sIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgXzoge3ZhbHVlOiBkaXNwYXRjaH1cbiAgfSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIFRyYW5zZm9ybShrLCB4LCB5KSB7XG4gIHRoaXMuayA9IGs7XG4gIHRoaXMueCA9IHg7XG4gIHRoaXMueSA9IHk7XG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBUcmFuc2Zvcm0sXG4gIHNjYWxlOiBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIGsgPT09IDEgPyB0aGlzIDogbmV3IFRyYW5zZm9ybSh0aGlzLmsgKiBrLCB0aGlzLngsIHRoaXMueSk7XG4gIH0sXG4gIHRyYW5zbGF0ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgIHJldHVybiB4ID09PSAwICYgeSA9PT0gMCA/IHRoaXMgOiBuZXcgVHJhbnNmb3JtKHRoaXMuaywgdGhpcy54ICsgdGhpcy5rICogeCwgdGhpcy55ICsgdGhpcy5rICogeSk7XG4gIH0sXG4gIGFwcGx5OiBmdW5jdGlvbihwb2ludCkge1xuICAgIHJldHVybiBbcG9pbnRbMF0gKiB0aGlzLmsgKyB0aGlzLngsIHBvaW50WzFdICogdGhpcy5rICsgdGhpcy55XTtcbiAgfSxcbiAgYXBwbHlYOiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHggKiB0aGlzLmsgKyB0aGlzLng7XG4gIH0sXG4gIGFwcGx5WTogZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiB5ICogdGhpcy5rICsgdGhpcy55O1xuICB9LFxuICBpbnZlcnQ6IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIFsobG9jYXRpb25bMF0gLSB0aGlzLngpIC8gdGhpcy5rLCAobG9jYXRpb25bMV0gLSB0aGlzLnkpIC8gdGhpcy5rXTtcbiAgfSxcbiAgaW52ZXJ0WDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiAoeCAtIHRoaXMueCkgLyB0aGlzLms7XG4gIH0sXG4gIGludmVydFk6IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4gKHkgLSB0aGlzLnkpIC8gdGhpcy5rO1xuICB9LFxuICByZXNjYWxlWDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4LmNvcHkoKS5kb21haW4oeC5yYW5nZSgpLm1hcCh0aGlzLmludmVydFgsIHRoaXMpLm1hcCh4LmludmVydCwgeCkpO1xuICB9LFxuICByZXNjYWxlWTogZnVuY3Rpb24oeSkge1xuICAgIHJldHVybiB5LmNvcHkoKS5kb21haW4oeS5yYW5nZSgpLm1hcCh0aGlzLmludmVydFksIHRoaXMpLm1hcCh5LmludmVydCwgeSkpO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgdGhpcy54ICsgXCIsXCIgKyB0aGlzLnkgKyBcIikgc2NhbGUoXCIgKyB0aGlzLmsgKyBcIilcIjtcbiAgfVxufTtcblxuZXhwb3J0IHZhciBpZGVudGl0eSA9IG5ldyBUcmFuc2Zvcm0oMSwgMCwgMCk7XG5cbnRyYW5zZm9ybS5wcm90b3R5cGUgPSBUcmFuc2Zvcm0ucHJvdG90eXBlO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2Zvcm0obm9kZSkge1xuICB3aGlsZSAoIW5vZGUuX196b29tKSBpZiAoIShub2RlID0gbm9kZS5wYXJlbnROb2RlKSkgcmV0dXJuIGlkZW50aXR5O1xuICByZXR1cm4gbm9kZS5fX3pvb207XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG5vcHJvcGFnYXRpb24oZXZlbnQpIHtcbiAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHtkcmFnRGlzYWJsZSwgZHJhZ0VuYWJsZX0gZnJvbSBcImQzLWRyYWdcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGVab29tfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7c2VsZWN0LCBwb2ludGVyfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge2ludGVycnVwdH0gZnJvbSBcImQzLXRyYW5zaXRpb25cIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IFpvb21FdmVudCBmcm9tIFwiLi9ldmVudC5qc1wiO1xuaW1wb3J0IHtUcmFuc2Zvcm0sIGlkZW50aXR5fSBmcm9tIFwiLi90cmFuc2Zvcm0uanNcIjtcbmltcG9ydCBub2V2ZW50LCB7bm9wcm9wYWdhdGlvbn0gZnJvbSBcIi4vbm9ldmVudC5qc1wiO1xuXG4vLyBJZ25vcmUgcmlnaHQtY2xpY2ssIHNpbmNlIHRoYXQgc2hvdWxkIG9wZW4gdGhlIGNvbnRleHQgbWVudS5cbi8vIGV4Y2VwdCBmb3IgcGluY2gtdG8tem9vbSwgd2hpY2ggaXMgc2VudCBhcyBhIHdoZWVsK2N0cmxLZXkgZXZlbnRcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXIoZXZlbnQpIHtcbiAgcmV0dXJuICghZXZlbnQuY3RybEtleSB8fCBldmVudC50eXBlID09PSAnd2hlZWwnKSAmJiAhZXZlbnQuYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0RXh0ZW50KCkge1xuICB2YXIgZSA9IHRoaXM7XG4gIGlmIChlIGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgIGUgPSBlLm93bmVyU1ZHRWxlbWVudCB8fCBlO1xuICAgIGlmIChlLmhhc0F0dHJpYnV0ZShcInZpZXdCb3hcIikpIHtcbiAgICAgIGUgPSBlLnZpZXdCb3guYmFzZVZhbDtcbiAgICAgIHJldHVybiBbW2UueCwgZS55XSwgW2UueCArIGUud2lkdGgsIGUueSArIGUuaGVpZ2h0XV07XG4gICAgfVxuICAgIHJldHVybiBbWzAsIDBdLCBbZS53aWR0aC5iYXNlVmFsLnZhbHVlLCBlLmhlaWdodC5iYXNlVmFsLnZhbHVlXV07XG4gIH1cbiAgcmV0dXJuIFtbMCwgMF0sIFtlLmNsaWVudFdpZHRoLCBlLmNsaWVudEhlaWdodF1dO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VHJhbnNmb3JtKCkge1xuICByZXR1cm4gdGhpcy5fX3pvb20gfHwgaWRlbnRpdHk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRXaGVlbERlbHRhKGV2ZW50KSB7XG4gIHJldHVybiAtZXZlbnQuZGVsdGFZICogKGV2ZW50LmRlbHRhTW9kZSA9PT0gMSA/IDAuMDUgOiBldmVudC5kZWx0YU1vZGUgPyAxIDogMC4wMDIpICogKGV2ZW50LmN0cmxLZXkgPyAxMCA6IDEpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0VG91Y2hhYmxlKCkge1xuICByZXR1cm4gbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IChcIm9udG91Y2hzdGFydFwiIGluIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29uc3RyYWluKHRyYW5zZm9ybSwgZXh0ZW50LCB0cmFuc2xhdGVFeHRlbnQpIHtcbiAgdmFyIGR4MCA9IHRyYW5zZm9ybS5pbnZlcnRYKGV4dGVudFswXVswXSkgLSB0cmFuc2xhdGVFeHRlbnRbMF1bMF0sXG4gICAgICBkeDEgPSB0cmFuc2Zvcm0uaW52ZXJ0WChleHRlbnRbMV1bMF0pIC0gdHJhbnNsYXRlRXh0ZW50WzFdWzBdLFxuICAgICAgZHkwID0gdHJhbnNmb3JtLmludmVydFkoZXh0ZW50WzBdWzFdKSAtIHRyYW5zbGF0ZUV4dGVudFswXVsxXSxcbiAgICAgIGR5MSA9IHRyYW5zZm9ybS5pbnZlcnRZKGV4dGVudFsxXVsxXSkgLSB0cmFuc2xhdGVFeHRlbnRbMV1bMV07XG4gIHJldHVybiB0cmFuc2Zvcm0udHJhbnNsYXRlKFxuICAgIGR4MSA+IGR4MCA/IChkeDAgKyBkeDEpIC8gMiA6IE1hdGgubWluKDAsIGR4MCkgfHwgTWF0aC5tYXgoMCwgZHgxKSxcbiAgICBkeTEgPiBkeTAgPyAoZHkwICsgZHkxKSAvIDIgOiBNYXRoLm1pbigwLCBkeTApIHx8IE1hdGgubWF4KDAsIGR5MSlcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBmaWx0ZXIgPSBkZWZhdWx0RmlsdGVyLFxuICAgICAgZXh0ZW50ID0gZGVmYXVsdEV4dGVudCxcbiAgICAgIGNvbnN0cmFpbiA9IGRlZmF1bHRDb25zdHJhaW4sXG4gICAgICB3aGVlbERlbHRhID0gZGVmYXVsdFdoZWVsRGVsdGEsXG4gICAgICB0b3VjaGFibGUgPSBkZWZhdWx0VG91Y2hhYmxlLFxuICAgICAgc2NhbGVFeHRlbnQgPSBbMCwgSW5maW5pdHldLFxuICAgICAgdHJhbnNsYXRlRXh0ZW50ID0gW1stSW5maW5pdHksIC1JbmZpbml0eV0sIFtJbmZpbml0eSwgSW5maW5pdHldXSxcbiAgICAgIGR1cmF0aW9uID0gMjUwLFxuICAgICAgaW50ZXJwb2xhdGUgPSBpbnRlcnBvbGF0ZVpvb20sXG4gICAgICBsaXN0ZW5lcnMgPSBkaXNwYXRjaChcInN0YXJ0XCIsIFwiem9vbVwiLCBcImVuZFwiKSxcbiAgICAgIHRvdWNoc3RhcnRpbmcsXG4gICAgICB0b3VjaGZpcnN0LFxuICAgICAgdG91Y2hlbmRpbmcsXG4gICAgICB0b3VjaERlbGF5ID0gNTAwLFxuICAgICAgd2hlZWxEZWxheSA9IDE1MCxcbiAgICAgIGNsaWNrRGlzdGFuY2UyID0gMCxcbiAgICAgIHRhcERpc3RhbmNlID0gMTA7XG5cbiAgZnVuY3Rpb24gem9vbShzZWxlY3Rpb24pIHtcbiAgICBzZWxlY3Rpb25cbiAgICAgICAgLnByb3BlcnR5KFwiX196b29tXCIsIGRlZmF1bHRUcmFuc2Zvcm0pXG4gICAgICAgIC5vbihcIndoZWVsLnpvb21cIiwgd2hlZWxlZCwge3Bhc3NpdmU6IGZhbHNlfSlcbiAgICAgICAgLm9uKFwibW91c2Vkb3duLnpvb21cIiwgbW91c2Vkb3duZWQpXG4gICAgICAgIC5vbihcImRibGNsaWNrLnpvb21cIiwgZGJsY2xpY2tlZClcbiAgICAgIC5maWx0ZXIodG91Y2hhYmxlKVxuICAgICAgICAub24oXCJ0b3VjaHN0YXJ0Lnpvb21cIiwgdG91Y2hzdGFydGVkKVxuICAgICAgICAub24oXCJ0b3VjaG1vdmUuem9vbVwiLCB0b3VjaG1vdmVkKVxuICAgICAgICAub24oXCJ0b3VjaGVuZC56b29tIHRvdWNoY2FuY2VsLnpvb21cIiwgdG91Y2hlbmRlZClcbiAgICAgICAgLnN0eWxlKFwiLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yXCIsIFwicmdiYSgwLDAsMCwwKVwiKTtcbiAgfVxuXG4gIHpvb20udHJhbnNmb3JtID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gY29sbGVjdGlvbi5zZWxlY3Rpb24gPyBjb2xsZWN0aW9uLnNlbGVjdGlvbigpIDogY29sbGVjdGlvbjtcbiAgICBzZWxlY3Rpb24ucHJvcGVydHkoXCJfX3pvb21cIiwgZGVmYXVsdFRyYW5zZm9ybSk7XG4gICAgaWYgKGNvbGxlY3Rpb24gIT09IHNlbGVjdGlvbikge1xuICAgICAgc2NoZWR1bGUoY29sbGVjdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rpb24uaW50ZXJydXB0KCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VzdHVyZSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgLmV2ZW50KGV2ZW50KVxuICAgICAgICAgIC5zdGFydCgpXG4gICAgICAgICAgLnpvb20obnVsbCwgdHlwZW9mIHRyYW5zZm9ybSA9PT0gXCJmdW5jdGlvblwiID8gdHJhbnNmb3JtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB0cmFuc2Zvcm0pXG4gICAgICAgICAgLmVuZCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHpvb20uc2NhbGVCeSA9IGZ1bmN0aW9uKHNlbGVjdGlvbiwgaywgcCwgZXZlbnQpIHtcbiAgICB6b29tLnNjYWxlVG8oc2VsZWN0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrMCA9IHRoaXMuX196b29tLmssXG4gICAgICAgICAgazEgPSB0eXBlb2YgayA9PT0gXCJmdW5jdGlvblwiID8gay5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogaztcbiAgICAgIHJldHVybiBrMCAqIGsxO1xuICAgIH0sIHAsIGV2ZW50KTtcbiAgfTtcblxuICB6b29tLnNjYWxlVG8gPSBmdW5jdGlvbihzZWxlY3Rpb24sIGssIHAsIGV2ZW50KSB7XG4gICAgem9vbS50cmFuc2Zvcm0oc2VsZWN0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlID0gZXh0ZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksXG4gICAgICAgICAgdDAgPSB0aGlzLl9fem9vbSxcbiAgICAgICAgICBwMCA9IHAgPT0gbnVsbCA/IGNlbnRyb2lkKGUpIDogdHlwZW9mIHAgPT09IFwiZnVuY3Rpb25cIiA/IHAuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHAsXG4gICAgICAgICAgcDEgPSB0MC5pbnZlcnQocDApLFxuICAgICAgICAgIGsxID0gdHlwZW9mIGsgPT09IFwiZnVuY3Rpb25cIiA/IGsuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGs7XG4gICAgICByZXR1cm4gY29uc3RyYWluKHRyYW5zbGF0ZShzY2FsZSh0MCwgazEpLCBwMCwgcDEpLCBlLCB0cmFuc2xhdGVFeHRlbnQpO1xuICAgIH0sIHAsIGV2ZW50KTtcbiAgfTtcblxuICB6b29tLnRyYW5zbGF0ZUJ5ID0gZnVuY3Rpb24oc2VsZWN0aW9uLCB4LCB5LCBldmVudCkge1xuICAgIHpvb20udHJhbnNmb3JtKHNlbGVjdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc3RyYWluKHRoaXMuX196b29tLnRyYW5zbGF0ZShcbiAgICAgICAgdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IHguYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHgsXG4gICAgICAgIHR5cGVvZiB5ID09PSBcImZ1bmN0aW9uXCIgPyB5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB5XG4gICAgICApLCBleHRlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgdHJhbnNsYXRlRXh0ZW50KTtcbiAgICB9LCBudWxsLCBldmVudCk7XG4gIH07XG5cbiAgem9vbS50cmFuc2xhdGVUbyA9IGZ1bmN0aW9uKHNlbGVjdGlvbiwgeCwgeSwgcCwgZXZlbnQpIHtcbiAgICB6b29tLnRyYW5zZm9ybShzZWxlY3Rpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUgPSBleHRlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgICB0ID0gdGhpcy5fX3pvb20sXG4gICAgICAgICAgcDAgPSBwID09IG51bGwgPyBjZW50cm9pZChlKSA6IHR5cGVvZiBwID09PSBcImZ1bmN0aW9uXCIgPyBwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBwO1xuICAgICAgcmV0dXJuIGNvbnN0cmFpbihpZGVudGl0eS50cmFuc2xhdGUocDBbMF0sIHAwWzFdKS5zY2FsZSh0LmspLnRyYW5zbGF0ZShcbiAgICAgICAgdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIiA/IC14LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiAteCxcbiAgICAgICAgdHlwZW9mIHkgPT09IFwiZnVuY3Rpb25cIiA/IC15LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiAteVxuICAgICAgKSwgZSwgdHJhbnNsYXRlRXh0ZW50KTtcbiAgICB9LCBwLCBldmVudCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gc2NhbGUodHJhbnNmb3JtLCBrKSB7XG4gICAgayA9IE1hdGgubWF4KHNjYWxlRXh0ZW50WzBdLCBNYXRoLm1pbihzY2FsZUV4dGVudFsxXSwgaykpO1xuICAgIHJldHVybiBrID09PSB0cmFuc2Zvcm0uayA/IHRyYW5zZm9ybSA6IG5ldyBUcmFuc2Zvcm0oaywgdHJhbnNmb3JtLngsIHRyYW5zZm9ybS55KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYW5zbGF0ZSh0cmFuc2Zvcm0sIHAwLCBwMSkge1xuICAgIHZhciB4ID0gcDBbMF0gLSBwMVswXSAqIHRyYW5zZm9ybS5rLCB5ID0gcDBbMV0gLSBwMVsxXSAqIHRyYW5zZm9ybS5rO1xuICAgIHJldHVybiB4ID09PSB0cmFuc2Zvcm0ueCAmJiB5ID09PSB0cmFuc2Zvcm0ueSA/IHRyYW5zZm9ybSA6IG5ldyBUcmFuc2Zvcm0odHJhbnNmb3JtLmssIHgsIHkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2VudHJvaWQoZXh0ZW50KSB7XG4gICAgcmV0dXJuIFsoK2V4dGVudFswXVswXSArICtleHRlbnRbMV1bMF0pIC8gMiwgKCtleHRlbnRbMF1bMV0gKyArZXh0ZW50WzFdWzFdKSAvIDJdO1xuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGUodHJhbnNpdGlvbiwgdHJhbnNmb3JtLCBwb2ludCwgZXZlbnQpIHtcbiAgICB0cmFuc2l0aW9uXG4gICAgICAgIC5vbihcInN0YXJ0Lnpvb21cIiwgZnVuY3Rpb24oKSB7IGdlc3R1cmUodGhpcywgYXJndW1lbnRzKS5ldmVudChldmVudCkuc3RhcnQoKTsgfSlcbiAgICAgICAgLm9uKFwiaW50ZXJydXB0Lnpvb20gZW5kLnpvb21cIiwgZnVuY3Rpb24oKSB7IGdlc3R1cmUodGhpcywgYXJndW1lbnRzKS5ldmVudChldmVudCkuZW5kKCk7IH0pXG4gICAgICAgIC50d2VlbihcInpvb21cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICBnID0gZ2VzdHVyZSh0aGF0LCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgICAgICAgIGUgPSBleHRlbnQuYXBwbHkodGhhdCwgYXJncyksXG4gICAgICAgICAgICAgIHAgPSBwb2ludCA9PSBudWxsID8gY2VudHJvaWQoZSkgOiB0eXBlb2YgcG9pbnQgPT09IFwiZnVuY3Rpb25cIiA/IHBvaW50LmFwcGx5KHRoYXQsIGFyZ3MpIDogcG9pbnQsXG4gICAgICAgICAgICAgIHcgPSBNYXRoLm1heChlWzFdWzBdIC0gZVswXVswXSwgZVsxXVsxXSAtIGVbMF1bMV0pLFxuICAgICAgICAgICAgICBhID0gdGhhdC5fX3pvb20sXG4gICAgICAgICAgICAgIGIgPSB0eXBlb2YgdHJhbnNmb3JtID09PSBcImZ1bmN0aW9uXCIgPyB0cmFuc2Zvcm0uYXBwbHkodGhhdCwgYXJncykgOiB0cmFuc2Zvcm0sXG4gICAgICAgICAgICAgIGkgPSBpbnRlcnBvbGF0ZShhLmludmVydChwKS5jb25jYXQodyAvIGEuayksIGIuaW52ZXJ0KHApLmNvbmNhdCh3IC8gYi5rKSk7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIGlmICh0ID09PSAxKSB0ID0gYjsgLy8gQXZvaWQgcm91bmRpbmcgZXJyb3Igb24gZW5kLlxuICAgICAgICAgICAgZWxzZSB7IHZhciBsID0gaSh0KSwgayA9IHcgLyBsWzJdOyB0ID0gbmV3IFRyYW5zZm9ybShrLCBwWzBdIC0gbFswXSAqIGssIHBbMV0gLSBsWzFdICogayk7IH1cbiAgICAgICAgICAgIGcuem9vbShudWxsLCB0KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlc3R1cmUodGhhdCwgYXJncywgY2xlYW4pIHtcbiAgICByZXR1cm4gKCFjbGVhbiAmJiB0aGF0Ll9fem9vbWluZykgfHwgbmV3IEdlc3R1cmUodGhhdCwgYXJncyk7XG4gIH1cblxuICBmdW5jdGlvbiBHZXN0dXJlKHRoYXQsIGFyZ3MpIHtcbiAgICB0aGlzLnRoYXQgPSB0aGF0O1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgdGhpcy5hY3RpdmUgPSAwO1xuICAgIHRoaXMuc291cmNlRXZlbnQgPSBudWxsO1xuICAgIHRoaXMuZXh0ZW50ID0gZXh0ZW50LmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgIHRoaXMudGFwcyA9IDA7XG4gIH1cblxuICBHZXN0dXJlLnByb3RvdHlwZSA9IHtcbiAgICBldmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmIChldmVudCkgdGhpcy5zb3VyY2VFdmVudCA9IGV2ZW50O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoKyt0aGlzLmFjdGl2ZSA9PT0gMSkge1xuICAgICAgICB0aGlzLnRoYXQuX196b29taW5nID0gdGhpcztcbiAgICAgICAgdGhpcy5lbWl0KFwic3RhcnRcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHpvb206IGZ1bmN0aW9uKGtleSwgdHJhbnNmb3JtKSB7XG4gICAgICBpZiAodGhpcy5tb3VzZSAmJiBrZXkgIT09IFwibW91c2VcIikgdGhpcy5tb3VzZVsxXSA9IHRyYW5zZm9ybS5pbnZlcnQodGhpcy5tb3VzZVswXSk7XG4gICAgICBpZiAodGhpcy50b3VjaDAgJiYga2V5ICE9PSBcInRvdWNoXCIpIHRoaXMudG91Y2gwWzFdID0gdHJhbnNmb3JtLmludmVydCh0aGlzLnRvdWNoMFswXSk7XG4gICAgICBpZiAodGhpcy50b3VjaDEgJiYga2V5ICE9PSBcInRvdWNoXCIpIHRoaXMudG91Y2gxWzFdID0gdHJhbnNmb3JtLmludmVydCh0aGlzLnRvdWNoMVswXSk7XG4gICAgICB0aGlzLnRoYXQuX196b29tID0gdHJhbnNmb3JtO1xuICAgICAgdGhpcy5lbWl0KFwiem9vbVwiKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnRoYXQuX196b29taW5nO1xuICAgICAgICB0aGlzLmVtaXQoXCJlbmRcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHZhciBkID0gc2VsZWN0KHRoaXMudGhhdCkuZGF0dW0oKTtcbiAgICAgIGxpc3RlbmVycy5jYWxsKFxuICAgICAgICB0eXBlLFxuICAgICAgICB0aGlzLnRoYXQsXG4gICAgICAgIG5ldyBab29tRXZlbnQodHlwZSwge1xuICAgICAgICAgIHNvdXJjZUV2ZW50OiB0aGlzLnNvdXJjZUV2ZW50LFxuICAgICAgICAgIHRhcmdldDogem9vbSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIHRyYW5zZm9ybTogdGhpcy50aGF0Ll9fem9vbSxcbiAgICAgICAgICBkaXNwYXRjaDogbGlzdGVuZXJzXG4gICAgICAgIH0pLFxuICAgICAgICBkXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiB3aGVlbGVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgIHQgPSB0aGlzLl9fem9vbSxcbiAgICAgICAgayA9IE1hdGgubWF4KHNjYWxlRXh0ZW50WzBdLCBNYXRoLm1pbihzY2FsZUV4dGVudFsxXSwgdC5rICogTWF0aC5wb3coMiwgd2hlZWxEZWx0YS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSkpLFxuICAgICAgICBwID0gcG9pbnRlcihldmVudCk7XG5cbiAgICAvLyBJZiB0aGUgbW91c2UgaXMgaW4gdGhlIHNhbWUgbG9jYXRpb24gYXMgYmVmb3JlLCByZXVzZSBpdC5cbiAgICAvLyBJZiB0aGVyZSB3ZXJlIHJlY2VudCB3aGVlbCBldmVudHMsIHJlc2V0IHRoZSB3aGVlbCBpZGxlIHRpbWVvdXQuXG4gICAgaWYgKGcud2hlZWwpIHtcbiAgICAgIGlmIChnLm1vdXNlWzBdWzBdICE9PSBwWzBdIHx8IGcubW91c2VbMF1bMV0gIT09IHBbMV0pIHtcbiAgICAgICAgZy5tb3VzZVsxXSA9IHQuaW52ZXJ0KGcubW91c2VbMF0gPSBwKTtcbiAgICAgIH1cbiAgICAgIGNsZWFyVGltZW91dChnLndoZWVsKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIHdoZWVsIGV2ZW50IHdvblx1MjAxOXQgdHJpZ2dlciBhIHRyYW5zZm9ybSBjaGFuZ2UsIGlnbm9yZSBpdC5cbiAgICBlbHNlIGlmICh0LmsgPT09IGspIHJldHVybjtcblxuICAgIC8vIE90aGVyd2lzZSwgY2FwdHVyZSB0aGUgbW91c2UgcG9pbnQgYW5kIGxvY2F0aW9uIGF0IHRoZSBzdGFydC5cbiAgICBlbHNlIHtcbiAgICAgIGcubW91c2UgPSBbcCwgdC5pbnZlcnQocCldO1xuICAgICAgaW50ZXJydXB0KHRoaXMpO1xuICAgICAgZy5zdGFydCgpO1xuICAgIH1cblxuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGcud2hlZWwgPSBzZXRUaW1lb3V0KHdoZWVsaWRsZWQsIHdoZWVsRGVsYXkpO1xuICAgIGcuem9vbShcIm1vdXNlXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUoc2NhbGUodCwgayksIGcubW91c2VbMF0sIGcubW91c2VbMV0pLCBnLmV4dGVudCwgdHJhbnNsYXRlRXh0ZW50KSk7XG5cbiAgICBmdW5jdGlvbiB3aGVlbGlkbGVkKCkge1xuICAgICAgZy53aGVlbCA9IG51bGw7XG4gICAgICBnLmVuZCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdXNlZG93bmVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKHRvdWNoZW5kaW5nIHx8ICFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGFyZ2V0ID0gZXZlbnQuY3VycmVudFRhcmdldCxcbiAgICAgICAgZyA9IGdlc3R1cmUodGhpcywgYXJncywgdHJ1ZSkuZXZlbnQoZXZlbnQpLFxuICAgICAgICB2ID0gc2VsZWN0KGV2ZW50LnZpZXcpLm9uKFwibW91c2Vtb3ZlLnpvb21cIiwgbW91c2Vtb3ZlZCwgdHJ1ZSkub24oXCJtb3VzZXVwLnpvb21cIiwgbW91c2V1cHBlZCwgdHJ1ZSksXG4gICAgICAgIHAgPSBwb2ludGVyKGV2ZW50LCBjdXJyZW50VGFyZ2V0KSxcbiAgICAgICAgeDAgPSBldmVudC5jbGllbnRYLFxuICAgICAgICB5MCA9IGV2ZW50LmNsaWVudFk7XG5cbiAgICBkcmFnRGlzYWJsZShldmVudC52aWV3KTtcbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBnLm1vdXNlID0gW3AsIHRoaXMuX196b29tLmludmVydChwKV07XG4gICAgaW50ZXJydXB0KHRoaXMpO1xuICAgIGcuc3RhcnQoKTtcblxuICAgIGZ1bmN0aW9uIG1vdXNlbW92ZWQoZXZlbnQpIHtcbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgICAgaWYgKCFnLm1vdmVkKSB7XG4gICAgICAgIHZhciBkeCA9IGV2ZW50LmNsaWVudFggLSB4MCwgZHkgPSBldmVudC5jbGllbnRZIC0geTA7XG4gICAgICAgIGcubW92ZWQgPSBkeCAqIGR4ICsgZHkgKiBkeSA+IGNsaWNrRGlzdGFuY2UyO1xuICAgICAgfVxuICAgICAgZy5ldmVudChldmVudClcbiAgICAgICAuem9vbShcIm1vdXNlXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUoZy50aGF0Ll9fem9vbSwgZy5tb3VzZVswXSA9IHBvaW50ZXIoZXZlbnQsIGN1cnJlbnRUYXJnZXQpLCBnLm1vdXNlWzFdKSwgZy5leHRlbnQsIHRyYW5zbGF0ZUV4dGVudCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNldXBwZWQoZXZlbnQpIHtcbiAgICAgIHYub24oXCJtb3VzZW1vdmUuem9vbSBtb3VzZXVwLnpvb21cIiwgbnVsbCk7XG4gICAgICBkcmFnRW5hYmxlKGV2ZW50LnZpZXcsIGcubW92ZWQpO1xuICAgICAgbm9ldmVudChldmVudCk7XG4gICAgICBnLmV2ZW50KGV2ZW50KS5lbmQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkYmxjbGlja2VkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciB0MCA9IHRoaXMuX196b29tLFxuICAgICAgICBwMCA9IHBvaW50ZXIoZXZlbnQuY2hhbmdlZFRvdWNoZXMgPyBldmVudC5jaGFuZ2VkVG91Y2hlc1swXSA6IGV2ZW50LCB0aGlzKSxcbiAgICAgICAgcDEgPSB0MC5pbnZlcnQocDApLFxuICAgICAgICBrMSA9IHQwLmsgKiAoZXZlbnQuc2hpZnRLZXkgPyAwLjUgOiAyKSxcbiAgICAgICAgdDEgPSBjb25zdHJhaW4odHJhbnNsYXRlKHNjYWxlKHQwLCBrMSksIHAwLCBwMSksIGV4dGVudC5hcHBseSh0aGlzLCBhcmdzKSwgdHJhbnNsYXRlRXh0ZW50KTtcblxuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGlmIChkdXJhdGlvbiA+IDApIHNlbGVjdCh0aGlzKS50cmFuc2l0aW9uKCkuZHVyYXRpb24oZHVyYXRpb24pLmNhbGwoc2NoZWR1bGUsIHQxLCBwMCwgZXZlbnQpO1xuICAgIGVsc2Ugc2VsZWN0KHRoaXMpLmNhbGwoem9vbS50cmFuc2Zvcm0sIHQxLCBwMCwgZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2hzdGFydGVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCFmaWx0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSkgcmV0dXJuO1xuICAgIHZhciB0b3VjaGVzID0gZXZlbnQudG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLFxuICAgICAgICBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzLCBldmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGggPT09IG4pLmV2ZW50KGV2ZW50KSxcbiAgICAgICAgc3RhcnRlZCwgaSwgdCwgcDtcblxuICAgIG5vcHJvcGFnYXRpb24oZXZlbnQpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHQgPSB0b3VjaGVzW2ldLCBwID0gcG9pbnRlcih0LCB0aGlzKTtcbiAgICAgIHAgPSBbcCwgdGhpcy5fX3pvb20uaW52ZXJ0KHApLCB0LmlkZW50aWZpZXJdO1xuICAgICAgaWYgKCFnLnRvdWNoMCkgZy50b3VjaDAgPSBwLCBzdGFydGVkID0gdHJ1ZSwgZy50YXBzID0gMSArICEhdG91Y2hzdGFydGluZztcbiAgICAgIGVsc2UgaWYgKCFnLnRvdWNoMSAmJiBnLnRvdWNoMFsyXSAhPT0gcFsyXSkgZy50b3VjaDEgPSBwLCBnLnRhcHMgPSAwO1xuICAgIH1cblxuICAgIGlmICh0b3VjaHN0YXJ0aW5nKSB0b3VjaHN0YXJ0aW5nID0gY2xlYXJUaW1lb3V0KHRvdWNoc3RhcnRpbmcpO1xuXG4gICAgaWYgKHN0YXJ0ZWQpIHtcbiAgICAgIGlmIChnLnRhcHMgPCAyKSB0b3VjaGZpcnN0ID0gcFswXSwgdG91Y2hzdGFydGluZyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRvdWNoc3RhcnRpbmcgPSBudWxsOyB9LCB0b3VjaERlbGF5KTtcbiAgICAgIGludGVycnVwdCh0aGlzKTtcbiAgICAgIGcuc3RhcnQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaG1vdmVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLl9fem9vbWluZykgcmV0dXJuO1xuICAgIHZhciBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCB0LCBwLCBsO1xuXG4gICAgbm9ldmVudChldmVudCk7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgdCA9IHRvdWNoZXNbaV0sIHAgPSBwb2ludGVyKHQsIHRoaXMpO1xuICAgICAgaWYgKGcudG91Y2gwICYmIGcudG91Y2gwWzJdID09PSB0LmlkZW50aWZpZXIpIGcudG91Y2gwWzBdID0gcDtcbiAgICAgIGVsc2UgaWYgKGcudG91Y2gxICYmIGcudG91Y2gxWzJdID09PSB0LmlkZW50aWZpZXIpIGcudG91Y2gxWzBdID0gcDtcbiAgICB9XG4gICAgdCA9IGcudGhhdC5fX3pvb207XG4gICAgaWYgKGcudG91Y2gxKSB7XG4gICAgICB2YXIgcDAgPSBnLnRvdWNoMFswXSwgbDAgPSBnLnRvdWNoMFsxXSxcbiAgICAgICAgICBwMSA9IGcudG91Y2gxWzBdLCBsMSA9IGcudG91Y2gxWzFdLFxuICAgICAgICAgIGRwID0gKGRwID0gcDFbMF0gLSBwMFswXSkgKiBkcCArIChkcCA9IHAxWzFdIC0gcDBbMV0pICogZHAsXG4gICAgICAgICAgZGwgPSAoZGwgPSBsMVswXSAtIGwwWzBdKSAqIGRsICsgKGRsID0gbDFbMV0gLSBsMFsxXSkgKiBkbDtcbiAgICAgIHQgPSBzY2FsZSh0LCBNYXRoLnNxcnQoZHAgLyBkbCkpO1xuICAgICAgcCA9IFsocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyXTtcbiAgICAgIGwgPSBbKGwwWzBdICsgbDFbMF0pIC8gMiwgKGwwWzFdICsgbDFbMV0pIC8gMl07XG4gICAgfVxuICAgIGVsc2UgaWYgKGcudG91Y2gwKSBwID0gZy50b3VjaDBbMF0sIGwgPSBnLnRvdWNoMFsxXTtcbiAgICBlbHNlIHJldHVybjtcblxuICAgIGcuem9vbShcInRvdWNoXCIsIGNvbnN0cmFpbih0cmFuc2xhdGUodCwgcCwgbCksIGcuZXh0ZW50LCB0cmFuc2xhdGVFeHRlbnQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoZW5kZWQoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuX196b29taW5nKSByZXR1cm47XG4gICAgdmFyIGcgPSBnZXN0dXJlKHRoaXMsIGFyZ3MpLmV2ZW50KGV2ZW50KSxcbiAgICAgICAgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLFxuICAgICAgICBuID0gdG91Y2hlcy5sZW5ndGgsIGksIHQ7XG5cbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBpZiAodG91Y2hlbmRpbmcpIGNsZWFyVGltZW91dCh0b3VjaGVuZGluZyk7XG4gICAgdG91Y2hlbmRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0b3VjaGVuZGluZyA9IG51bGw7IH0sIHRvdWNoRGVsYXkpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHQgPSB0b3VjaGVzW2ldO1xuICAgICAgaWYgKGcudG91Y2gwICYmIGcudG91Y2gwWzJdID09PSB0LmlkZW50aWZpZXIpIGRlbGV0ZSBnLnRvdWNoMDtcbiAgICAgIGVsc2UgaWYgKGcudG91Y2gxICYmIGcudG91Y2gxWzJdID09PSB0LmlkZW50aWZpZXIpIGRlbGV0ZSBnLnRvdWNoMTtcbiAgICB9XG4gICAgaWYgKGcudG91Y2gxICYmICFnLnRvdWNoMCkgZy50b3VjaDAgPSBnLnRvdWNoMSwgZGVsZXRlIGcudG91Y2gxO1xuICAgIGlmIChnLnRvdWNoMCkgZy50b3VjaDBbMV0gPSB0aGlzLl9fem9vbS5pbnZlcnQoZy50b3VjaDBbMF0pO1xuICAgIGVsc2Uge1xuICAgICAgZy5lbmQoKTtcbiAgICAgIC8vIElmIHRoaXMgd2FzIGEgZGJsdGFwLCByZXJvdXRlIHRvIHRoZSAob3B0aW9uYWwpIGRibGNsaWNrLnpvb20gaGFuZGxlci5cbiAgICAgIGlmIChnLnRhcHMgPT09IDIpIHtcbiAgICAgICAgdCA9IHBvaW50ZXIodCwgdGhpcyk7XG4gICAgICAgIGlmIChNYXRoLmh5cG90KHRvdWNoZmlyc3RbMF0gLSB0WzBdLCB0b3VjaGZpcnN0WzFdIC0gdFsxXSkgPCB0YXBEaXN0YW5jZSkge1xuICAgICAgICAgIHZhciBwID0gc2VsZWN0KHRoaXMpLm9uKFwiZGJsY2xpY2suem9vbVwiKTtcbiAgICAgICAgICBpZiAocCkgcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgem9vbS53aGVlbERlbHRhID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHdoZWVsRGVsdGEgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgem9vbSkgOiB3aGVlbERlbHRhO1xuICB9O1xuXG4gIHpvb20uZmlsdGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZpbHRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgem9vbSkgOiBmaWx0ZXI7XG4gIH07XG5cbiAgem9vbS50b3VjaGFibGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hhYmxlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCB6b29tKSA6IHRvdWNoYWJsZTtcbiAgfTtcblxuICB6b29tLmV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleHRlbnQgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KFtbK19bMF1bMF0sICtfWzBdWzFdXSwgWytfWzFdWzBdLCArX1sxXVsxXV1dKSwgem9vbSkgOiBleHRlbnQ7XG4gIH07XG5cbiAgem9vbS5zY2FsZUV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzY2FsZUV4dGVudFswXSA9ICtfWzBdLCBzY2FsZUV4dGVudFsxXSA9ICtfWzFdLCB6b29tKSA6IFtzY2FsZUV4dGVudFswXSwgc2NhbGVFeHRlbnRbMV1dO1xuICB9O1xuXG4gIHpvb20udHJhbnNsYXRlRXh0ZW50ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRyYW5zbGF0ZUV4dGVudFswXVswXSA9ICtfWzBdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMV1bMF0gPSArX1sxXVswXSwgdHJhbnNsYXRlRXh0ZW50WzBdWzFdID0gK19bMF1bMV0sIHRyYW5zbGF0ZUV4dGVudFsxXVsxXSA9ICtfWzFdWzFdLCB6b29tKSA6IFtbdHJhbnNsYXRlRXh0ZW50WzBdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMF1bMV1dLCBbdHJhbnNsYXRlRXh0ZW50WzFdWzBdLCB0cmFuc2xhdGVFeHRlbnRbMV1bMV1dXTtcbiAgfTtcblxuICB6b29tLmNvbnN0cmFpbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjb25zdHJhaW4gPSBfLCB6b29tKSA6IGNvbnN0cmFpbjtcbiAgfTtcblxuICB6b29tLmR1cmF0aW9uID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGR1cmF0aW9uID0gK18sIHpvb20pIDogZHVyYXRpb247XG4gIH07XG5cbiAgem9vbS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpbnRlcnBvbGF0ZSA9IF8sIHpvb20pIDogaW50ZXJwb2xhdGU7XG4gIH07XG5cbiAgem9vbS5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGxpc3RlbmVycy5vbi5hcHBseShsaXN0ZW5lcnMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBsaXN0ZW5lcnMgPyB6b29tIDogdmFsdWU7XG4gIH07XG5cbiAgem9vbS5jbGlja0Rpc3RhbmNlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGNsaWNrRGlzdGFuY2UyID0gKF8gPSArXykgKiBfLCB6b29tKSA6IE1hdGguc3FydChjbGlja0Rpc3RhbmNlMik7XG4gIH07XG5cbiAgem9vbS50YXBEaXN0YW5jZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0YXBEaXN0YW5jZSA9ICtfLCB6b29tKSA6IHRhcERpc3RhbmNlO1xuICB9O1xuXG4gIHJldHVybiB6b29tO1xufVxuIiwgImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xyXG5cclxuLy8gLS0tLS0tLS0tLSBFZGdlIHR5cGVzICYgY29sb3JzIC0tLS0tLS0tLS1cclxuY29uc3QgRURHRV9UWVBFUyA9IFtcImNhbGxcIiwgXCJ1c2VcIiwgXCJtb2R1bGUtcHJvY2VkdXJlLW9mXCIsIFwiYmluZHMtdG9cIiwgXCJ1c2VzLXR5cGVcIl07XHJcbmNvbnN0IFRZUEVfQUxJQVMgPSBuZXcgTWFwKFtbXCJtb2R1bGVfcHJvY2VkdXJlX29mXCIsIFwibW9kdWxlLXByb2NlZHVyZS1vZlwiXV0pO1xyXG5jb25zdCBFREdFX0NPTE9SUyA9IHtcclxuICBcImNhbGxcIjogICAgICAgICAgICAgICBcIiM2YWEwZmZcIixcclxuICBcInVzZVwiOiAgICAgICAgICAgICAgICBcIiM3YmQzODlcIixcclxuICBcIm1vZHVsZS1wcm9jZWR1cmUtb2ZcIjpcIiNmNTllMGJcIixcclxuICBcImJpbmRzLXRvXCI6ICAgICAgICAgICBcIiNlZjQ0NDRcIixcclxuICBcInVzZXMtdHlwZVwiOiAgICAgICAgICBcIiNhNzhiZmFcIlxyXG59O1xyXG5cclxuLy8gYWN0aXZlIHR5cGVzIGZvciB0aGUgbGVnZW5kIChhbGwgb24gYnkgZGVmYXVsdClcclxuY29uc3QgYWN0aXZlVHlwZXMgPSBuZXcgU2V0KEVER0VfVFlQRVMpO1xyXG5cclxuLy8gLS0tLS0tLS0tLSBMb2FkIGRhdGEgLS0tLS0tLS0tLVxyXG5jb25zdCBkZXBzID0gYXdhaXQgZmV0Y2goXCIuL2RlcHMuanNvblwiKS50aGVuKHIgPT4gci5qc29uKCkpO1xyXG5cclxuLy8gLS0tLS0tLS0tLSBET00gcmVmcyAtLS0tLS0tLS0tXHJcbmNvbnN0IHN2ZyA9IGQzLnNlbGVjdChcIiN2aXpcIik7XHJcbmNvbnN0IGdNYWluICA9IHN2Zy5hcHBlbmQoXCJnXCIpO1xyXG5jb25zdCBnRGVmcyAgPSBzdmcuYXBwZW5kKFwiZGVmc1wiKTsgICAgICAgIC8vIGZvciBtYXJrZXJzXHJcbmNvbnN0IGdMaW5rcyA9IGdNYWluLmFwcGVuZChcImdcIik7XHJcbmNvbnN0IGdOb2RlcyA9IGdNYWluLmFwcGVuZChcImdcIik7XHJcbmNvbnN0IGdMYWJlbHM9IGdNYWluLmFwcGVuZChcImdcIik7XHJcblxyXG5jb25zdCBpbmZvICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2luZm9cIik7XHJcbmNvbnN0IGVkZ2VUeXBlU2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNlZGdlVHlwZVwiKTtcclxuY29uc3QgZmlsdGVySW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2ZpbHRlclwiKTtcclxuY29uc3QgbGFiZWxzVG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsYWJlbHNcIik7XHJcbmNvbnN0IGxlZ2VuZEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNsZWdlbmRcIik7XHJcblxyXG4vLyAtLS0tLS0tLS0tIEhlbHBlcnMgLS0tLS0tLS0tLVxyXG5jb25zdCBjb2xvckJ5VHlwZSA9ICh0KSA9PiBFREdFX0NPTE9SU1t0XSB8fCBcIiM5OTlcIjtcclxuY29uc3QgY29sb3JCeUtpbmQgPSBkMy5zY2FsZU9yZGluYWwoKVxyXG4gIC5kb21haW4oW1wibW9kdWxlXCIsXCJwcm9ncmFtXCIsXCJzdWJyb3V0aW5lXCIsXCJmdW5jdGlvblwiLFwiaW50ZXJmYWNlXCIsXCJnZW5lcmljXCIsXCJ0eXBlXCIsXCJ1bmtub3duXCJdKVxyXG4gIC5yYW5nZShkMy5zY2hlbWVUYWJsZWF1MTApO1xyXG5cclxuZnVuY3Rpb24gbm9ybVR5cGUodCkgeyByZXR1cm4gVFlQRV9BTElBUy5nZXQodCkgfHwgdDsgfVxyXG5mdW5jdGlvbiBub2RlS2V5KGQpeyByZXR1cm4gZC5pZDsgfVxyXG5cclxuZnVuY3Rpb24gZmlsdGVyTm9kZXMobm9kZXMsIHEpIHtcclxuICBpZiAoIXEpIHJldHVybiBub2RlcztcclxuICBjb25zdCB0ID0gcS50b0xvd2VyQ2FzZSgpO1xyXG4gIHJldHVybiBub2Rlcy5maWx0ZXIobiA9PlxyXG4gICAgKG4uaWR8fFwiXCIpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModCkgfHxcclxuICAgIChuLm5hbWV8fFwiXCIpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModCkgfHxcclxuICAgIChuLnNjb3BlfHxcIlwiKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHQpIHx8XHJcbiAgICAobi5raW5kfHxcIlwiKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHQpXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRHcmFwaChlZGdlVHlwZSwgcXVlcnkpIHtcclxuICBjb25zdCBub2Rlc0J5SWQgPSBuZXcgTWFwKGRlcHMubm9kZXMubWFwKG4gPT4gW24uaWQsIHsgLi4ubiB9XSkpO1xyXG5cclxuICAvLyBEZWNpZGUgd2hpY2ggbGluayB0eXBlcyB0byBpbmNsdWRlXHJcbiAgbGV0IHR5cGVzO1xyXG4gIGlmIChlZGdlVHlwZSA9PT0gXCJhbGxcIikge1xyXG4gICAgdHlwZXMgPSBbLi4uYWN0aXZlVHlwZXNdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0eXBlcyA9IFtlZGdlVHlwZV07XHJcbiAgfVxyXG5cclxuICAvLyBDb2xsZWN0IGxpbmtzIChhbGxvdyBwYXJhbGxlbCBlZGdlcyBvZiBkaWZmZXJlbnQgdHlwZXMpXHJcbiAgY29uc3QgdW5pcSA9IG5ldyBTZXQoKTtcclxuICBjb25zdCBsaW5rcyA9IFtdO1xyXG4gIGZvciAoY29uc3QgbCBvZiBkZXBzLmxpbmtzKSB7XHJcbiAgICBjb25zdCB0ID0gbm9ybVR5cGUobC50eXBlKTtcclxuICAgIGlmICghdHlwZXMuaW5jbHVkZXModCkpIGNvbnRpbnVlO1xyXG5cclxuICAgIGNvbnN0IHNJZCA9IHR5cGVvZiBsLnNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IGwuc291cmNlIDogbC5zb3VyY2U/LmlkO1xyXG4gICAgY29uc3QgdElkID0gdHlwZW9mIGwudGFyZ2V0ID09PSBcInN0cmluZ1wiID8gbC50YXJnZXQgOiBsLnRhcmdldD8uaWQ7XHJcbiAgICBpZiAoIW5vZGVzQnlJZC5oYXMoc0lkKSB8fCAhbm9kZXNCeUlkLmhhcyh0SWQpKSBjb250aW51ZTtcclxuXHJcbiAgICBjb25zdCBrZXkgPSBgJHtzSWR9XFx0JHt0SWR9XFx0JHt0fWA7XHJcbiAgICBpZiAodW5pcS5oYXMoa2V5KSkgY29udGludWU7XHJcbiAgICB1bmlxLmFkZChrZXkpO1xyXG4gICAgbGlua3MucHVzaCh7IHNvdXJjZTogbm9kZXNCeUlkLmdldChzSWQpLCB0YXJnZXQ6IG5vZGVzQnlJZC5nZXQodElkKSwgZXR5cGU6IHQgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBJbmR1Y2VkIHN1YmdyYXBoIGJ5IGZpbHRlciBxdWVyeVxyXG4gIGNvbnN0IGtlZXAgPSBuZXcgU2V0KGZpbHRlck5vZGVzKFsuLi5ub2Rlc0J5SWQudmFsdWVzKCldLCBxdWVyeSkubWFwKG4gPT4gbi5pZCkpO1xyXG4gIGNvbnN0IGZpbHRlcmVkID0gbGlua3MuZmlsdGVyKGwgPT4ga2VlcC5oYXMobC5zb3VyY2UuaWQpIHx8IGtlZXAuaGFzKGwudGFyZ2V0LmlkKSk7XHJcblxyXG4gIC8vIE5vZGVzIGFjdHVhbGx5IHVzZWRcclxuICBjb25zdCB1c2VkID0gbmV3IFNldCgpO1xyXG4gIGZvciAoY29uc3QgbCBvZiBmaWx0ZXJlZCkgeyB1c2VkLmFkZChsLnNvdXJjZS5pZCk7IHVzZWQuYWRkKGwudGFyZ2V0LmlkKTsgfVxyXG4gIGNvbnN0IG5vZGVzID0gWy4uLnVzZWRdLm1hcChpZCA9PiBub2Rlc0J5SWQuZ2V0KGlkKSk7XHJcblxyXG4gIC8vIERlZ3JlZSBmb3Igc2l6aW5nXHJcbiAgY29uc3QgZGVnID0gbmV3IE1hcChbLi4udXNlZF0ubWFwKGlkID0+IFtpZCwgMF0pKTtcclxuICBmb3IgKGNvbnN0IGwgb2YgZmlsdGVyZWQpIHtcclxuICAgIGRlZy5zZXQobC5zb3VyY2UuaWQsIChkZWcuZ2V0KGwuc291cmNlLmlkKXx8MCkrMSk7XHJcbiAgICBkZWcuc2V0KGwudGFyZ2V0LmlkLCAoZGVnLmdldChsLnRhcmdldC5pZCl8fDApKzEpO1xyXG4gIH1cclxuICBmb3IgKGNvbnN0IG4gb2Ygbm9kZXMpIG4uZGVncmVlID0gZGVnLmdldChuLmlkKSB8fCAwO1xyXG5cclxuICByZXR1cm4geyBub2RlcywgbGlua3M6IGZpbHRlcmVkIH07XHJcbn1cclxuXHJcbi8vIC0tLS0tLS0tLS0gTGVnZW5kIChjaGVja2JveCB0b2dnbGVzKSAtLS0tLS0tLS0tXHJcbmZ1bmN0aW9uIHJlbmRlckxlZ2VuZCgpIHtcclxuICBsZWdlbmRFbC5pbm5lckhUTUwgPSBcIlwiOyAvLyByZWJ1aWxkIGZyZXNoXHJcbiAgY29uc3QgaW5BbGxNb2RlID0gZWRnZVR5cGVTZWwudmFsdWUgPT09IFwiYWxsXCI7XHJcblxyXG4gIGZvciAoY29uc3QgdCBvZiBFREdFX1RZUEVTKSB7XHJcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcblxyXG4gICAgY29uc3QgY2IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBjYi50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgY2IuY2hlY2tlZCA9IGFjdGl2ZVR5cGVzLmhhcyh0KTtcclxuICAgIGNiLmRpc2FibGVkID0gIWluQWxsTW9kZTtcclxuICAgIGNiLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICBpZiAoY2IuY2hlY2tlZCkgYWN0aXZlVHlwZXMuYWRkKHQpOyBlbHNlIGFjdGl2ZVR5cGVzLmRlbGV0ZSh0KTtcclxuICAgICAgcnVuKGVkZ2VUeXBlU2VsLnZhbHVlLCBmaWx0ZXJJbnB1dC52YWx1ZSk7IC8vIGxpdmUgdXBkYXRlXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgIGlmICghaW5BbGxNb2RlKSBsYWJlbC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XHJcbiAgICBjb25zdCBzd2F0Y2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIHN3YXRjaC5jbGFzc05hbWUgPSBcInN3YXRjaFwiO1xyXG4gICAgc3dhdGNoLnN0eWxlLmJhY2tncm91bmQgPSBFREdFX0NPTE9SU1t0XTtcclxuICAgIGxhYmVsLmFwcGVuZENoaWxkKHN3YXRjaCk7XHJcbiAgICBsYWJlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0KSk7XHJcblxyXG4gICAgcm93LmFwcGVuZENoaWxkKGNiKTtcclxuICAgIHJvdy5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICBsZWdlbmRFbC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gLS0tLS0tLS0tLSBTVkcgYXJyb3cgbWFya2VycyAocGVyIGVkZ2UgdHlwZSksIHNjYWxlLXByb29mIC0tLS0tLS0tLS1cclxuY29uc3QgbWFya2VyQmFzZSA9IHsgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCByZWZYOiAxMiB9OyAvLyBsb2dpY2FsIGJhc2UgKGdyYXBoIHVuaXRzIHdpdGggdXNlclNwYWNlT25Vc2UpXHJcblxyXG5mdW5jdGlvbiBlbnN1cmVNYXJrZXJzKCkge1xyXG4gIGdEZWZzLnNlbGVjdEFsbChcIm1hcmtlclwiKS5yZW1vdmUoKTtcclxuICBmb3IgKGNvbnN0IHQgb2YgRURHRV9UWVBFUykge1xyXG4gICAgZ0RlZnMuYXBwZW5kKFwibWFya2VyXCIpXHJcbiAgICAgIC5hdHRyKFwiaWRcIiwgYGFycm93LSR7dH1gKVxyXG4gICAgICAuYXR0cihcIm1hcmtlclVuaXRzXCIsIFwidXNlclNwYWNlT25Vc2VcIikgLy8gc2l6ZSBpbiB1c2VyIHNwYWNlOyB3ZSB3aWxsIHJlc2NhbGUgb24gem9vbS4gTUROLiA6Y29udGVudFJlZmVyZW5jZVtvYWljaXRlOjBde2luZGV4PTB9XHJcbiAgICAgIC5hdHRyKFwidmlld0JveFwiLCBcIjAgLTQgOCA4XCIpXHJcbiAgICAgIC5hdHRyKFwicmVmWFwiLCBtYXJrZXJCYXNlLnJlZlgpXHJcbiAgICAgIC5hdHRyKFwicmVmWVwiLCAwKVxyXG4gICAgICAuYXR0cihcIm1hcmtlcldpZHRoXCIsIG1hcmtlckJhc2Uud2lkdGgpXHJcbiAgICAgIC5hdHRyKFwibWFya2VySGVpZ2h0XCIsIG1hcmtlckJhc2UuaGVpZ2h0KVxyXG4gICAgICAuYXR0cihcIm9yaWVudFwiLCBcImF1dG9cIilcclxuICAgICAgLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAuYXR0cihcImRcIiwgXCJNMCwtNCBMOCwwIEwwLDQgWlwiKVxyXG4gICAgICAgIC5hdHRyKFwiZmlsbFwiLCBFREdFX0NPTE9SU1t0XSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBVcGRhdGUgbWFya2VyIHNpemUgaW52ZXJzZWx5IHdpdGggem9vbS5rIHNvIGFycm93aGVhZHMgc3RheSBjb25zdGFudCBvbiBzY3JlZW4uXHJcbmZ1bmN0aW9uIHJlc2l6ZU1hcmtlcnNGb3Jab29tKGspIHtcclxuICAvLyBrZWVwIGEgbWluaW11bSB0byBhdm9pZCB6ZXJvIGF0IGV4dHJlbWUgem9vbXNcclxuICBjb25zdCB3ID0gbWFya2VyQmFzZS53aWR0aCAvIGs7XHJcbiAgY29uc3QgaCA9IG1hcmtlckJhc2UuaGVpZ2h0IC8gaztcclxuICBjb25zdCByeCA9IG1hcmtlckJhc2UucmVmWCAvIGs7XHJcbiAgZm9yIChjb25zdCB0IG9mIEVER0VfVFlQRVMpIHtcclxuICAgIGNvbnN0IG0gPSBnRGVmcy5zZWxlY3QoYCNhcnJvdy0ke3R9YCk7XHJcbiAgICBtLmF0dHIoXCJtYXJrZXJXaWR0aFwiLCB3KS5hdHRyKFwibWFya2VySGVpZ2h0XCIsIGgpLmF0dHIoXCJyZWZYXCIsIHJ4KTtcclxuICB9XHJcbn1cclxuXHJcbi8vIC0tLS0tLS0tLS0gWm9vbSAvIFBhbiAtLS0tLS0tLS0tXHJcbmNvbnN0IHpvb20gPSBkMy56b29tKCkub24oXCJ6b29tXCIsIChldikgPT4ge1xyXG4gIGdNYWluLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZXYudHJhbnNmb3JtKTtcclxuICByZXNpemVNYXJrZXJzRm9yWm9vbShldi50cmFuc2Zvcm0uayk7IC8vIGtlZXAgYXJyb3doZWFkcyBjb25zdGFudCBpbiBzY3JlZW4gc3BhY2VcclxufSk7XHJcbnN2Zy5jYWxsKHpvb20pOyAvLyBEMyB6b29tIEFQSS4gOmNvbnRlbnRSZWZlcmVuY2Vbb2FpY2l0ZToxXXtpbmRleD0xfVxyXG5cclxuLy8gLS0tLS0tLS0tLSBNYWluIHJlbmRlciAvIHNpbXVsYXRpb24gLS0tLS0tLS0tLVxyXG5mdW5jdGlvbiBydW4oZWRnZVR5cGUgPSBcImFsbFwiLCBxdWVyeSA9IFwiXCIpIHtcclxuICByZW5kZXJMZWdlbmQoKTtcclxuICBlbnN1cmVNYXJrZXJzKCk7XHJcbiAgcmVzaXplTWFya2Vyc0Zvclpvb20oZDMuem9vbVRyYW5zZm9ybShzdmcubm9kZSgpKS5rKTsgLy8gc2V0IGluaXRpYWwgbWFya2VyIHNpemUgdG8gY3VycmVudCB6b29tXHJcblxyXG4gIGNvbnN0IHsgbm9kZXMsIGxpbmtzIH0gPSBidWlsZEdyYXBoKGVkZ2VUeXBlLCBxdWVyeSk7XHJcblxyXG4gIGNvbnN0IHNpbSA9IGQzLmZvcmNlU2ltdWxhdGlvbihub2RlcylcclxuICAgIC5mb3JjZShcImNoYXJnZVwiLCBkMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoZCA9PiAoZC5raW5kID09PSBcIm1vZHVsZVwiID8gLTIyMCA6IC05MCkpKVxyXG4gICAgLmZvcmNlKFwibGlua1wiLCBkMy5mb3JjZUxpbmsobGlua3MpLmlkKG5vZGVLZXkpLmRpc3RhbmNlKGQgPT4gNDIgKyAyKk1hdGgubWluKGQuc291cmNlLmRlZ3JlZSxkLnRhcmdldC5kZWdyZWUpKS5zdHJlbmd0aCgwLjM1KSlcclxuICAgIC5mb3JjZShcImNvbGxpZGVcIiwgZDMuZm9yY2VDb2xsaWRlKCkucmFkaXVzKGQgPT4gNCArIE1hdGguc3FydCgyICsgZC5kZWdyZWUpKS5pdGVyYXRpb25zKDIpKVxyXG4gICAgLmZvcmNlKFwieFwiLCBkMy5mb3JjZVgoKS5zdHJlbmd0aCgwLjA2KSlcclxuICAgIC5mb3JjZShcInlcIiwgZDMuZm9yY2VZKCkuc3RyZW5ndGgoMC4wNikpO1xyXG5cclxuICAvLyAtLS0tLSBqb2lucyAtLS0tLVxyXG4gIGNvbnN0IGxpbmtTZWwgPSBnTGlua3Muc2VsZWN0QWxsKFwibGluZVwiKS5kYXRhKGxpbmtzLCBkID0+IGQuc291cmNlLmlkICsgXCJcdTIxOTJcIiArIGQudGFyZ2V0LmlkICsgXCI6XCIgKyBkLmV0eXBlKTtcclxuICBsaW5rU2VsLmV4aXQoKS5yZW1vdmUoKTtcclxuICBjb25zdCBsaW5rRW50ZXIgPSBsaW5rU2VsLmVudGVyKCkuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuMik7XHJcbiAgY29uc3QgbGluayA9IGxpbmtFbnRlci5tZXJnZShsaW5rU2VsKVxyXG4gICAgLmF0dHIoXCJzdHJva2VcIiwgZCA9PiBjb2xvckJ5VHlwZShkLmV0eXBlKSlcclxuICAgIC5hdHRyKFwibWFya2VyLWVuZFwiLCBkID0+IGB1cmwoI2Fycm93LSR7ZC5ldHlwZX0pYCk7XHJcblxyXG4gIGNvbnN0IG5vZGVTZWwgPSBnTm9kZXMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIG5vZGVLZXkpO1xyXG4gIG5vZGVTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IG5vZGVFbnRlciA9IG5vZGVTZWwuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAuYXR0cihcInJcIiwgZCA9PiAzICsgTWF0aC5zcXJ0KDEgKyBkLmRlZ3JlZSkpXHJcbiAgICAuYXR0cihcImZpbGxcIiwgZCA9PiBjb2xvckJ5S2luZChkLmtpbmQpKVxyXG4gICAgLmF0dHIoXCJzdHJva2VcIiwgXCIjMGIwZTEyXCIpXHJcbiAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjc1KVxyXG4gICAgLmNhbGwoXHJcbiAgICAgIGQzLmRyYWcoKVxyXG4gICAgICAgIC5vbihcInN0YXJ0XCIsIChldiwgZCkgPT4geyBpZiAoIWV2LmFjdGl2ZSkgc2ltLmFscGhhVGFyZ2V0KDAuMikucmVzdGFydCgpOyBkLmZ4ID0gZC54OyBkLmZ5ID0gZC55OyB9KVxyXG4gICAgICAgIC5vbihcImRyYWdcIiwgIChldiwgZCkgPT4geyBkLmZ4ID0gZXYueDsgZC5meSA9IGV2Lnk7IH0pXHJcbiAgICAgICAgLm9uKFwiZW5kXCIsICAgKGV2LCBkKSA9PiB7IGlmICghZXYuYWN0aXZlKSBzaW0uYWxwaGFUYXJnZXQoMCk7IGQuZnggPSBudWxsOyBkLmZ5ID0gbnVsbDsgfSlcclxuICAgIClcclxuICAgIC5vbihcIm1vdXNlZW50ZXJcIiwgKF8sIGQpID0+IHNob3dJbmZvKGQsIGxpbmtzKSlcclxuICAgIC5vbihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gY2xlYXJIaWdobGlnaHQoKSlcclxuICAgIC5vbihcIm1vdXNlbW92ZVwiLCAoZXYsIGQpID0+IG1heWJlSGlnaGxpZ2h0KGQpKTtcclxuXHJcbiAgY29uc3Qgbm9kZSA9IG5vZGVFbnRlci5tZXJnZShub2RlU2VsKTtcclxuXHJcbiAgY29uc3QgbGFiZWxTZWwgPSBnTGFiZWxzLnNlbGVjdEFsbChcInRleHRcIikuZGF0YShub2Rlcywgbm9kZUtleSk7XHJcbiAgbGFiZWxTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IGxhYmVsID0gbGFiZWxTZWwuZW50ZXIoKS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAuYXR0cihcImNsYXNzXCIsXCJsYWJlbFwiKVxyXG4gICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLFwibWlkZGxlXCIpXHJcbiAgICAuYXR0cihcImR5XCIsXCItMC43NWVtXCIpXHJcbiAgICAudGV4dChkID0+IGQubmFtZSB8fCBkLmlkKVxyXG4gICAgLm1lcmdlKGxhYmVsU2VsKTtcclxuXHJcbiAgLy8gLS0tLS0gbmVpZ2hib3IgaGlnaGxpZ2h0aW5nIC0tLS0tXHJcbiAgY29uc3QgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzTWFwKGxpbmtzKTtcclxuICBmdW5jdGlvbiBnZXROZWlnaGJvcnNNYXAobGlua3MpIHtcclxuICAgIGNvbnN0IG5iID0gbmV3IE1hcCgpO1xyXG4gICAgZm9yIChjb25zdCBsIG9mIGxpbmtzKSB7XHJcbiAgICAgIChuYi5nZXQobC5zb3VyY2UuaWQpIHx8IG5iLnNldChsLnNvdXJjZS5pZCwgbmV3IFNldCgpKS5nZXQobC5zb3VyY2UuaWQpKS5hZGQobC50YXJnZXQuaWQpO1xyXG4gICAgICAobmIuZ2V0KGwudGFyZ2V0LmlkKSB8fCBuYi5zZXQobC50YXJnZXQuaWQsIG5ldyBTZXQoKSkuZ2V0KGwudGFyZ2V0LmlkKSkuYWRkKGwuc291cmNlLmlkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuYjtcclxuICB9XHJcbiAgZnVuY3Rpb24gbWF5YmVIaWdobGlnaHQoZCkge1xyXG4gICAgY29uc3QgbmIgPSBuZWlnaGJvcnMuZ2V0KGQuaWQpIHx8IG5ldyBTZXQoKTtcclxuICAgIG5vZGUuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBuID0+IG4uaWQgPT09IGQuaWQgfHwgbmIuaGFzKG4uaWQpKVxyXG4gICAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCBuID0+IChuLmlkID09PSBkLmlkIHx8IG5iLmhhcyhuLmlkKSkgPyAxIDogMC4yKTtcclxuICAgIGxpbmsuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBsID0+IGwuc291cmNlLmlkID09PSBkLmlkIHx8IGwudGFyZ2V0LmlkID09PSBkLmlkKVxyXG4gICAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCBsID0+IChsLnNvdXJjZS5pZCA9PT0gZC5pZCB8fCBsLnRhcmdldC5pZCA9PT0gZC5pZCkgPyAwLjkgOiAwLjEyKVxyXG4gICAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIGwgPT4gKGwuc291cmNlLmlkID09PSBkLmlkIHx8IGwudGFyZ2V0LmlkID09PSBkLmlkKSA/IDIuMiA6IDEuMik7XHJcbiAgICBsYWJlbC5hdHRyKFwib3BhY2l0eVwiLCBuID0+IChsYWJlbHNUb2dnbGUuY2hlY2tlZCA/ICgobi5pZCA9PT0gZC5pZCB8fCBuYi5oYXMobi5pZCkpID8gMSA6IDAuMDUpIDogMCkpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjbGVhckhpZ2hsaWdodCgpIHtcclxuICAgIG5vZGUuY2xhc3NlZChcImhpZ2hsaWdodFwiLCBmYWxzZSkuYXR0cihcIm9wYWNpdHlcIiwgMSk7XHJcbiAgICBsaW5rLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgZmFsc2UpLmF0dHIoXCJvcGFjaXR5XCIsIDAuMjgpLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMS4yKTtcclxuICAgIGxhYmVsLmF0dHIoXCJvcGFjaXR5XCIsIGxhYmVsc1RvZ2dsZS5jaGVja2VkID8gMSA6IDApO1xyXG4gIH1cclxuXHJcbiAgLy8gLS0tLS0gc2lkZSBwYW5lbCBpbmZvIC0tLS0tXHJcbiAgZnVuY3Rpb24gc2hvd0luZm8oZCwgbGlua3MpIHtcclxuICAgIGNvbnN0IGluY29taW5nID0gbGlua3MuZmlsdGVyKGwgPT4gbC50YXJnZXQuaWQgPT09IGQuaWQpO1xyXG4gICAgY29uc3Qgb3V0Z29pbmcgPSBsaW5rcy5maWx0ZXIobCA9PiBsLnNvdXJjZS5pZCA9PT0gZC5pZCk7XHJcblxyXG4gICAgY29uc3QgZGV0YWlscyA9IHtcclxuICAgICAgaWQ6IGQuaWQsIG5hbWU6IGQubmFtZSwga2luZDogZC5raW5kLCBzY29wZTogZC5zY29wZSxcclxuICAgICAgZmlsZTogZC5maWxlLCBsaW5lOiBkLmxpbmUsIHZpc2liaWxpdHk6IGQudmlzaWJpbGl0eSxcclxuICAgICAgYXR0cnM6IGQuYXR0cnMsIHJlc3VsdDogZC5yZXN1bHQsIGR1bW1pZXM6IGQuZHVtbWllcyxcclxuICAgICAgaW5fZGVncmVlOiBpbmNvbWluZy5sZW5ndGgsIG91dF9kZWdyZWU6IG91dGdvaW5nLmxlbmd0aCxcclxuICAgICAgaW5fYnlfdHlwZTogIGNvdW50QnlUeXBlKGluY29taW5nKSxcclxuICAgICAgb3V0X2J5X3R5cGU6IGNvdW50QnlUeXBlKG91dGdvaW5nKVxyXG4gICAgfTtcclxuICAgIGluZm8uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8aDE+JHtkLm5hbWUgfHwgZC5pZH08L2gxPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibXV0ZWRcIj4ke2Qua2luZH0ke2Quc2NvcGUgPyBgIFx1MjAxNCBzY29wZTogJHtkLnNjb3BlfWAgOiBcIlwifTwvZGl2PlxyXG4gICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luOjhweCAwXCI+aW46IDxiPiR7aW5jb21pbmcubGVuZ3RofTwvYj4gXHUyMDIyIG91dDogPGI+JHtvdXRnb2luZy5sZW5ndGh9PC9iPjwvZGl2PlxyXG4gICAgICA8cHJlPiR7ZXNjYXBlSHRtbChKU09OLnN0cmluZ2lmeShkZXRhaWxzLCBudWxsLCAyKSl9PC9wcmU+XHJcbiAgICBgO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjb3VudEJ5VHlwZShhcnIpeyBjb25zdCBtID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgZm9yIChjb25zdCBsIG9mIGFycikgbVtsLmV0eXBlXT0obVtsLmV0eXBlXXx8MCkrMTsgcmV0dXJuIG07IH1cclxuICBmdW5jdGlvbiBlc2NhcGVIdG1sKHMpe3JldHVybiBzLnJlcGxhY2UoL1smPD5cIiddL2csIG0gPT4gKHsnJic6JyZhbXA7JywnPCc6JyZsdDsnLCc+JzonJmd0OycsJ1wiJzonJnF1b3Q7JyxcIidcIjonJiMzOTsnfVttXSkpfVxyXG5cclxuICAvLyAtLS0tLSB0aWNrcyAtLS0tLVxyXG4gIHNpbS5vbihcInRpY2tcIiwgKCkgPT4ge1xyXG4gICAgbGlua1xyXG4gICAgICAuYXR0cihcIngxXCIsIGQgPT4gZC5zb3VyY2UueCkuYXR0cihcInkxXCIsIGQgPT4gZC5zb3VyY2UueSlcclxuICAgICAgLmF0dHIoXCJ4MlwiLCBkID0+IGQudGFyZ2V0LngpLmF0dHIoXCJ5MlwiLCBkID0+IGQudGFyZ2V0LnkpO1xyXG5cclxuICAgIG5vZGUuYXR0cihcImN4XCIsIGQgPT4gZC54KS5hdHRyKFwiY3lcIiwgZCA9PiBkLnkpO1xyXG4gICAgbGFiZWwuYXR0cihcInhcIiwgZCA9PiBkLngpLmF0dHIoXCJ5XCIsIGQgPT4gZC55KTtcclxuICB9KTtcclxuXHJcbiAgbGFiZWwuYXR0cihcIm9wYWNpdHlcIiwgbGFiZWxzVG9nZ2xlLmNoZWNrZWQgPyAxIDogMCk7XHJcblxyXG4gIC8vIEZpdCB2aWV3IGFmdGVyIGEgYnJpZWYgc2V0dGxlOyByZXNpemUgbWFya2VycyB0byB0aGUgbmV3IHpvb20gYWZ0ZXJ3YXJkc1xyXG4gIGlmIChub2Rlcy5sZW5ndGgpIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zdCBbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0gPSBleHRlbnRYWShub2Rlcyk7XHJcbiAgICAgIGNvbnN0IHcgPSBtYXhYIC0gbWluWCwgaCA9IG1heFkgLSBtaW5ZO1xyXG4gICAgICBjb25zdCB2YiA9IFttaW5YIC0gNDAsIG1pblkgLSA0MCwgdyArIDgwLCBoICsgODBdO1xyXG4gICAgICBjb25zdCB7Y2xpZW50V2lkdGg6Q1csIGNsaWVudEhlaWdodDpDSH0gPSBzdmcubm9kZSgpO1xyXG4gICAgICBjb25zdCBrID0gTWF0aC5taW4oQ1cvdmJbMl0sIENIL3ZiWzNdKTtcclxuXHJcbiAgICAgIHN2Zy50cmFuc2l0aW9uKCkuZHVyYXRpb24oNDAwKVxyXG4gICAgICAgIC5jYWxsKHpvb20udHJhbnNmb3JtLCBkMy56b29tSWRlbnRpdHlcclxuICAgICAgICAgIC50cmFuc2xhdGUoQ1cvMiwgQ0gvMilcclxuICAgICAgICAgIC5zY2FsZShrKVxyXG4gICAgICAgICAgLnRyYW5zbGF0ZSgtKHZiWzBdK3ZiWzJdLzIpLCAtKHZiWzFdK3ZiWzNdLzIpKSlcclxuICAgICAgICAub24oXCJlbmRcIiwgKCkgPT4gcmVzaXplTWFya2Vyc0Zvclpvb20oZDMuem9vbVRyYW5zZm9ybShzdmcubm9kZSgpKS5rKSk7XHJcbiAgICB9LCAzMDApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZXh0ZW50WFkobm9kZXMpe1xyXG4gIGxldCBtaW5YPStJbmZpbml0eSxtaW5ZPStJbmZpbml0eSxtYXhYPS1JbmZpbml0eSxtYXhZPS1JbmZpbml0eTtcclxuICBmb3IgKGNvbnN0IG4gb2Ygbm9kZXMpeyBpZihuLng8bWluWCltaW5YPW4ueDsgaWYobi55PG1pblkpbWluWT1uLnk7IGlmKG4ueD5tYXhYKW1heFg9bi54OyBpZihuLnk+bWF4WSltYXhZPW4ueTsgfVxyXG4gIHJldHVybiBbbWluWCxtaW5ZLG1heFgsbWF4WV07XHJcbn1cclxuXHJcbi8vIC0tLS0tLS0tLS0gV2lyZSB1cCBjb250cm9scyAtLS0tLS0tLS0tXHJcbmVkZ2VUeXBlU2VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcnVuKGVkZ2VUeXBlU2VsLnZhbHVlLCBmaWx0ZXJJbnB1dC52YWx1ZSkpO1xyXG5maWx0ZXJJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZDMuZGVib3VuY2U/LigoKT0+cnVuKGVkZ2VUeXBlU2VsLnZhbHVlLCBmaWx0ZXJJbnB1dC52YWx1ZSksIDIwMCkgfHwgKCgpPT5ydW4oZWRnZVR5cGVTZWwudmFsdWUsIGZpbHRlcklucHV0LnZhbHVlKSkpO1xyXG5sYWJlbHNUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiBydW4oZWRnZVR5cGVTZWwudmFsdWUsIGZpbHRlcklucHV0LnZhbHVlKSk7XHJcblxyXG4vLyBCb290XHJcbnJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQU8sSUFBTSxZQUFOLGNBQXdCLElBQUk7QUFBQSxFQUNqQyxZQUFZLFNBQVMsTUFBTSxPQUFPO0FBQ2hDLFVBQU07QUFDTixXQUFPLGlCQUFpQixNQUFNLEVBQUMsU0FBUyxFQUFDLE9BQU8sb0JBQUksSUFBSSxFQUFDLEdBQUcsTUFBTSxFQUFDLE9BQU8sSUFBRyxFQUFDLENBQUM7QUFDL0UsUUFBSSxXQUFXLEtBQU0sWUFBVyxDQUFDQSxNQUFLLEtBQUssS0FBSyxRQUFTLE1BQUssSUFBSUEsTUFBSyxLQUFLO0FBQUEsRUFDOUU7QUFBQSxFQUNBLElBQUksS0FBSztBQUNQ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Q1AsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsZ0JBQWdCO0FBQUEsRUFDaEIsTUFBTTtBQUFBLEVBQ04sWUFBWTtBQUFBLEVBQ1osT0FBTztBQUFBLEVBQ1AsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsZ0JBQWdCO0FBQUEsRUFDaEIsVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUFBLEVBQ1QsTUFBTTtBQUFBLEVBQ04sVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsZUFBZTtBQUFBLEVBQ2YsVUFBVTtBQUFBLEVBQ1YsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsV0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsZ0JBQWdCO0FBQUEsRUFDaEIsWUFBWTtBQUFBLEVBQ1osWUFBWTtBQUFBLEVBQ1osU0FBUztBQUFBLEVBQ1QsWUFBWTtBQUFBLEVBQ1osY0FBYztBQUFBLEVBQ2QsZUFBZTtBQUFBLEVBQ2YsZUFBZTtBQUFBLEVBQ2YsZUFBZTtBQUFBLEVBQ2YsZUFBZTtBQUFBLEVBQ2YsWUFBWTtBQUFBLEVBQ1osVUFBVTtBQUFBLEVBQ1YsYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1QsU0FBUztBQUFBLEVBQ1QsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLEVBQ1AsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLEVBQ1AsVUFBVTtBQUFBLEVBQ1YsZUFBZTtBQUFBLEVBQ2YsV0FBVztBQUFBLEVBQ1gsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsc0JBQXNCO0FBQUEsRUFDdEIsV0FBVztBQUFBLEVBQ1gsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsZUFBZTtBQUFBLEVBQ2YsY0FBYztBQUFBLEVBQ2QsZ0JBQWdCO0FBQUEsRUFDaEIsZ0JBQWdCO0FBQUEsRUFDaEIsZ0JBQWdCO0FBQUEsRUFDaEIsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBQ1Isa0JBQWtCO0FBQUEsRUFDbEIsWUFBWTtBQUFBLEVBQ1osY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsZ0JBQWdCO0FBQUEsRUFDaEIsaUJBQWlCO0FBQUEsRUFDakIsbUJBQW1CO0FBQUEsRUFDbkIsaUJBQWlCO0FBQUEsRUFDakIsaUJBQWlCO0FBQUEsRUFDakIsY0FBYztBQUFBLEVBQ2QsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsYUFBYTtBQUFBLEVBQ2IsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLEVBQ1QsT0FBTztBQUFBLEVBQ1AsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsZUFBZTtBQUFBLEVBQ2YsV0FBVztBQUFBLEVBQ1gsZUFBZTtBQUFBLEVBQ2YsZUFBZTtBQUFBLEVBQ2YsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sWUFBWTtBQUFBLEVBQ1osUUFBUTtBQUFBLEVBQ1IsZUFBZTtBQUFBLEVBQ2YsS0FBSztBQUFBLEVBQ0wsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsYUFBYTtBQUFBLEVBQ2IsUUFBUTtBQUFBLEVBQ1IsWUFBWTtBQUFBLEVBQ1osVUFBVTtBQUFBLEVBQ1YsVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBQ1IsU0FBUztBQUFBLEVBQ1QsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsTUFBTTtBQUFBLEVBQ04sYUFBYTtBQUFBLEVBQ2IsV0FBVztBQUFBLEVBQ1gsS0FBSztBQUFBLEVBQ0wsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBQ1IsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLEVBQ1AsWUFBWTtBQUFBLEVBQ1osUUFBUTtBQUFBLEVBQ1IsYUFBYTtBQUNmO0FBRUEsZUFBTyxPQUFPLE9BQU87QUFBQSxFQUNuQixLQUFLLFVBQVU7QUFDYixXQUFPLE9BQU8sT0FBTyxJQUFJLEtBQUssZUFBYSxNQUFNLFFBQVE7QUFBQSxFQUMzRDtBQUFBLEVBQ0EsY0FBYztBQUNaLFdBQU8sS0FBSyxJQUFJLEVBQUUsWUFBWTtBQUFBLEVBQ2hDO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxFQUNMLFdBQVc7QUFBQSxFQUNYLFlBQVk7QUFBQSxFQUNaLFdBQVc7QUFBQSxFQUNYLFdBQVc7QUFBQSxFQUNYLFVBQVU7QUFDWixDQUFDO0FBRUQsU0FBUyxrQkFBa0I7QUFDekIsU0FBTyxLQUFLLElBQUksRUFBRSxVQUFVO0FBQzlCO0FBRUEsU0FBUyxtQkFBbUI7QUFDMUIsU0FBTyxLQUFLLElBQUksRUFBRSxXQUFXO0FBQy9CO0FBRUEsU0FBUyxrQkFBa0I7QUFDekIsU0FBTyxXQUFXLElBQUksRUFBRSxVQUFVO0FBQ3BDO0FBRUEsU0FBUyxrQkFBa0I7QUFDekIsU0FBTyxLQUFLLElBQUksRUFBRSxVQUFVO0FBQzlCO0FBRWUsU0FBUixNQUF1QixRQUFRO0FBQ3BDLE1BQUlDLElBQUc7QUFDUCxZQUFVLFNBQVMsSUFBSSxLQUFLLEVBQUUsWUFBWTtBQUMxQyxVQUFRQSxLQUFJLE1BQU0sS0FBSyxNQUFNLE1BQU0sSUFBSUEsR0FBRSxDQUFDLEVBQUUsUUFBUUEsS0FBSSxTQUFTQSxHQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxJQUFJLEtBQUtBLEVBQUMsSUFDdEYsTUFBTSxJQUFJLElBQUksSUFBS0EsTUFBSyxJQUFJLEtBQVFBLE1BQUssSUFBSSxLQUFRQSxNQUFLLElBQUksS0FBUUEsS0FBSSxNQUFTQSxLQUFJLE9BQVEsSUFBTUEsS0FBSSxJQUFNLENBQUMsSUFDaEgsTUFBTSxJQUFJLEtBQUtBLE1BQUssS0FBSyxLQUFNQSxNQUFLLEtBQUssS0FBTUEsTUFBSyxJQUFJLE1BQU9BLEtBQUksT0FBUSxHQUFJLElBQy9FLE1BQU0sSUFBSSxLQUFNQSxNQUFLLEtBQUssS0FBUUEsTUFBSyxJQUFJLEtBQVFBLE1BQUssSUFBSSxLQUFRQSxNQUFLLElBQUksS0FBUUEsTUFBSyxJQUFJLEtBQVFBLEtBQUksT0FBVUEsS0FBSSxPQUFRLElBQU1BLEtBQUksTUFBUSxHQUFJLElBQ3RKLFNBQ0NBLEtBQUksYUFBYSxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUlBLEdBQUUsQ0FBQyxHQUFHQSxHQUFFLENBQUMsR0FBR0EsR0FBRSxDQUFDLEdBQUcsQ0FBQyxLQUM1REEsS0FBSSxhQUFhLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSUEsR0FBRSxDQUFDLElBQUksTUFBTSxLQUFLQSxHQUFFLENBQUMsSUFBSSxNQUFNLEtBQUtBLEdBQUUsQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLEtBQ2hHQSxLQUFJLGNBQWMsS0FBSyxNQUFNLEtBQUssS0FBS0EsR0FBRSxDQUFDLEdBQUdBLEdBQUUsQ0FBQyxHQUFHQSxHQUFFLENBQUMsR0FBR0EsR0FBRSxDQUFDLENBQUMsS0FDN0RBLEtBQUksY0FBYyxLQUFLLE1BQU0sS0FBSyxLQUFLQSxHQUFFLENBQUMsSUFBSSxNQUFNLEtBQUtBLEdBQUUsQ0FBQyxJQUFJ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LFNBQVksV0FBVyxNQUFJLElBQUksWUFBWSxPQUFPLFlBQVksS0FBSyxHQUFHLEdBQUcsTUFBTSxNQUFJLElBQUksWUFBWSxPQUFPLFlBQVksS0FBSyxFQUFFO0FBQzFKLGFBQWEsaUJBQWlCLFVBQVUsTUFBTSxJQUFJLFlBQVksT0FBTyxZQUFZLEtBQUssQ0FBQztBQUd2RixJQUFJLFlBQVksT0FBTyxZQUFZLEtBQUs7IiwKICAibmFtZXMiOiBbImtleSIsICJ0eXBlIiwgImMiLCAiZG9jdW1lbnQiLCAibSIsICJ4IiwgIm0iLCAibSIsICJkYXR1bSIsICJ4IiwgIm0iLCAic2VsZWN0aW9uIiwgIm0iLCAibSIsICJhIiwgIm0iLCAibSIsICJtIiwgImNyZWF0ZSIsICJjcmVhdGUiLCAicGFyc2VUeXBlbmFtZXMiLCAibSIsICJ0eXBlIiwgIndpbmRvdyIsICJkaXNwYXRjaF9kZWZhdWx0IiwgIm0iLCAiZGlzcGF0Y2hfZGVmYXVsdCIsICJzZWxlY3RfZGVmYXVsdCIsICJzdmciLCAicm9vdCIsICJzZWxlY3Rpb24iLCAic2VsZWN0X2RlZmF1bHQiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInR5cGUiLCAieCIsICJ5IiwgImRpc3BhdGNoIiwgImZpbHRlciIsICJzZWxlY3Rpb24iLCAic2VsZWN0X2RlZmF1bHQiLCAiYyIsICJjb250YWluZXIiLCAiZGlzcGF0Y2giLCAidHlwZSIsICJldmVudCIsICJ0b3VjaCIsICJjb25zdGFudF9kZWZhdWx0IiwgIm0iLCAiYSIsICJtaW4iLCAibWF4IiwgImNvbnN0YW50X2RlZmF1bHQiLCAieCIsICJhIiwgInkiLCAieSIsICJhIiwgImNvbnN0YW50X2RlZmF1bHQiLCAieSIsICJjb2xvciIsICJyZ2IiLCAic3RhcnQiLCAiYSIsICJhIiwgImkiLCAiYSIsICJjIiwgIm0iLCAiYSIsICJ4IiwgInpvb20iLCAibm93IiwgImlkIiwgImluZGV4IiwgImdldCIsICJzZXQiLCAic3RhcnQiLCAiZW1wdHkiLCAiaW50ZXJydXB0X2RlZmF1bHQiLCAiaWQiLCAic2V0IiwgImdldCIsICJ0cmFuc2l0aW9uIiwgImEiLCAiYyIsICJhdHRyUmVtb3ZlIiwgImF0dHJSZW1vdmVOUyIsICJhdHRyQ29uc3RhbnQiLCAiYXR0ckNvbnN0YW50TlMiLCAiYXR0ckZ1bmN0aW9uIiwgImF0dHJGdW5jdGlvbk5TIiwgImF0dHJfZGVmYXVsdCIsICJpZCIsICJnZXQiLCAiaWQiLCAic2V0IiwgImdldCIsICJpZCIsICJzZXQiLCAiZ2V0IiwgImlkIiwgInNldCIsICJmaWx0ZXJfZGVmYXVsdCIsICJtIiwgIm1lcmdlX2RlZmF1bHQiLCAidHJhbnNpdGlvbiIsICJtIiwgImlkIiwgInNldCIsICJvbl9kZWZhdWx0IiwgImdldCIsICJpZCIsICJyZW1vdmVfZGVmYXVsdCIsICJzZWxlY3RfZGVmYXVsdCIsICJpZCIsICJtIiwgImdldCIsICJzZWxlY3RBbGxfZGVmYXVsdCIsICJpZCIsICJtIiwgImNoaWxkcmVuIiwgImluaGVyaXQiLCAiZ2V0IiwgIlNlbGVjdGlvbiIsICJzZWxlY3Rpb25fZGVmYXVsdCIsICJzdHlsZVJlbW92ZSIsICJzdHlsZUNvbnN0YW50IiwgInN0eWxlRnVuY3Rpb24iLCAiaWQiLCAicmVtb3ZlIiwgInNldCIsICJzdHlsZV9kZWZhdWx0IiwgInRleHRDb25zdGFudCIsICJ0ZXh0RnVuY3Rpb24iLCAidGV4dF9kZWZhdWx0IiwgIm0iLCAiaW5oZXJpdCIsICJnZXQiLCAiaWQiLCAic2V0IiwgImlkIiwgInNlbGVjdF9kZWZhdWx0IiwgInNlbGVjdEFsbF9kZWZhdWx0IiwgImZpbHRlcl9kZWZhdWx0IiwgIm1lcmdlX2RlZmF1bHQiLCAic2VsZWN0aW9uX2RlZmF1bHQiLCAib25fZGVmYXVsdCIsICJhdHRyX2RlZmF1bHQiLCAic3R5bGVfZGVmYXVsdCIsICJ0ZXh0X2RlZmF1bHQiLCAicmVtb3ZlX2RlZmF1bHQiLCAiaWQiLCAidHJhbnNpdGlvbl9kZWZhdWx0IiwgIm0iLCAiaW50ZXJydXB0X2RlZmF1bHQiLCAidHJhbnNpdGlvbl9kZWZhdWx0IiwgIngiLCAieSIsICJ4IiwgInkiLCAieCIsICJ5IiwgImRhdGFfZGVmYXVsdCIsICJ4IiwgInkiLCAieDIiLCAieTIiLCAieDMiLCAieTMiLCAicmVtb3ZlX2RlZmF1bHQiLCAieCIsICJ5IiwgInNpemVfZGVmYXVsdCIsICJ4IiwgInkiLCAiZGF0YV9kZWZhdWx0IiwgInJlbW92ZV9kZWZhdWx0IiwgInNpemVfZGVmYXVsdCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInkiLCAiZmluZCIsICJpZCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAieSIsICJtIiwgImkiLCAieCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAieCIsICJ5IiwgIm5vZGUiLCAic3RyZW5ndGgiLCAiYyIsICJ4MiIsICJ4X2RlZmF1bHQiLCAieCIsICJjb25zdGFudF9kZWZhdWx0IiwgInlfZGVmYXVsdCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAiaW5kZXgiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInR5cGUiLCAidHJhbnNmb3JtIiwgImRpc3BhdGNoIiwgIngiLCAieSIsICJpZGVudGl0eSIsICJub3Byb3BhZ2F0aW9uIiwgIm5vZXZlbnRfZGVmYXVsdCIsICJkZWZhdWx0RmlsdGVyIiwgImlkZW50aXR5IiwgImRlZmF1bHRUb3VjaGFibGUiLCAidHJhbnNmb3JtIiwgInpvb21fZGVmYXVsdCIsICJmaWx0ZXIiLCAiem9vbSIsICJzZWxlY3Rpb24iLCAieCIsICJ5IiwgImV4dGVudCIsICJ0cmFuc2l0aW9uIiwgImEiLCAidHlwZSIsICJzZWxlY3RfZGVmYXVsdCIsICJub2V2ZW50X2RlZmF1bHQiLCAibm9wcm9wYWdhdGlvbiIsICJldmVudCIsICJjb25zdGFudF9kZWZhdWx0IiwgInNlbGVjdF9kZWZhdWx0IiwgImlkIiwgIm0iLCAiem9vbV9kZWZhdWx0IiwgInhfZGVmYXVsdCIsICJ5X2RlZmF1bHQiLCAibGlua3MiLCAiaWRlbnRpdHkiXQp9Cg==
