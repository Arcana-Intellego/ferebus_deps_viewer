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
var COLORS = {
  blue: "#60a5fa",
  green: "#34d399",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#a78bfa",
  slate: "#94a3b8",
  light: "#cbd5e1"
};
var EDGE_TYPES = ["call", "use", "module-procedure-of", "binds-to", "uses-type"];
var TYPE_ALIAS = /* @__PURE__ */ new Map([["module_procedure_of", "module-procedure-of"]]);
var EDGE_COLORS = {
  "call": COLORS.blue,
  "use": COLORS.green,
  "module-procedure-of": COLORS.amber,
  "binds-to": COLORS.red,
  "uses-type": COLORS.purple
};
function colorByKind(kind) {
  switch ((kind || "unknown").toLowerCase()) {
    case "function":
    case "subroutine":
      return COLORS.blue;
    // aligns with call
    case "module":
      return COLORS.green;
    // aligns with use
    case "interface":
    case "generic":
      return COLORS.amber;
    // aligns with module-procedure-of
    case "type":
      return COLORS.purple;
    // aligns with uses-type
    case "program":
      return COLORS.slate;
    default:
      return COLORS.light;
  }
}
var colorByType = (t) => EDGE_COLORS[t] || "#999";
var SIZE_MODE = "in";
function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
var deps = await fetch("./deps.json").then((r) => r.json());
var svg = select_default2("#viz");
var gMain = svg.append("g");
var gLinks = gMain.append("g");
var gNodes = gMain.append("g");
var gArrows = gMain.append("g");
var gLabels = gMain.append("g");
var info = document.querySelector("#info");
var edgeTypeSel = document.querySelector("#edgeType");
var filterInput = document.querySelector("#filter");
var labelsToggle = document.querySelector("#labels");
var legendEl = document.querySelector("#legend");
var legendKindsEl = document.querySelector("#legendKinds");
var activeTypes = new Set(EDGE_TYPES);
function renderEdgeLegend() {
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
    swatch.style.background = colorByType(t);
    label.appendChild(swatch);
    label.appendChild(document.createTextNode(t));
    row.appendChild(cb);
    row.appendChild(label);
    legendEl.appendChild(row);
  }
}
function renderNodeKindLegend() {
  legendKindsEl.innerHTML = "";
  const kinds = [
    ["function / subroutine", colorByKind("function")],
    ["module", colorByKind("module")],
    ["interface / generic", colorByKind("interface")],
    ["type", colorByKind("type")],
    ["program", colorByKind("program")],
    ["other / unknown", colorByKind("unknown")]
  ];
  for (const [name, col] of kinds) {
    const row = document.createElement("div");
    row.className = "row";
    const sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = col;
    const lab = document.createElement("label");
    lab.appendChild(sw);
    lab.appendChild(document.createTextNode(name));
    legendKindsEl.appendChild(lab);
  }
}
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
function nodeRadius(d) {
  const k = SIZE_MODE === "in" ? d.degIn || 0 : SIZE_MODE === "out" ? d.degOut || 0 : (d.degIn || 0) + (d.degOut || 0);
  return 4 + Math.sqrt(2 + k);
}
function buildGraph(edgeType, query) {
  const nodesById = new Map(deps.nodes.map((n) => [n.id, { ...n }]));
  const types = edgeType === "all" ? [...activeTypes] : [edgeType];
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
  for (const n of nodes) {
    n.degIn = 0;
    n.degOut = 0;
  }
  for (const l of filtered) {
    l.source.degIn++;
    l.target.degOut++;
  }
  const deg = new Map([...used].map((id2) => [id2, 0]));
  for (const l of filtered) {
    deg.set(l.source.id, (deg.get(l.source.id) || 0) + 1);
    deg.set(l.target.id, (deg.get(l.target.id) || 0) + 1);
  }
  for (const n of nodes) n.degree = deg.get(n.id) || 0;
  return { nodes, links: filtered };
}
var zoomK = 1;
var onZoomRepaint = null;
var rafQueued = false;
var rafRepaint = () => {
  if (rafQueued) return;
  rafQueued = true;
  requestAnimationFrame(() => {
    rafQueued = false;
    onZoomRepaint && onZoomRepaint();
  });
};
var zoom = zoom_default2().filter((event) => {
  if (document.activeElement === filterInput) return false;
  const target = event.target;
  return !(target && target.closest && target.closest(".node"));
}).on("zoom", (ev) => {
  zoomK = ev.transform.k;
  gMain.attr("transform", ev.transform);
  rafRepaint();
});
svg.call(zoom);
var currentSim = null;
var infoPinned = false;
function run(edgeType = "all", query = "") {
  if (currentSim) currentSim.stop();
  renderEdgeLegend();
  renderNodeKindLegend();
  const { nodes, links } = buildGraph(edgeType, query);
  const sim = simulation_default(nodes).force("charge", manyBody_default().strength((d) => d.kind === "module" ? -300 : -140)).force("link", link_default(links).id(nodeKey).distance((d) => 70 + 2 * Math.min(d.source.degree, d.target.degree)).strength(0.15)).force("collide", collide_default().radius((d) => nodeRadius(d) + 2).iterations(2)).force("x", x_default2().strength(0.03)).force("y", y_default2().strength(0.03));
  currentSim = sim;
  const linkSel = gLinks.selectAll("line").data(links, (d) => d.source.id + "\u2192" + d.target.id + ":" + d.etype);
  linkSel.exit().remove();
  const linkEnter = linkSel.enter().append("line").attr("class", "link").attr("stroke-width", 1.2);
  const link = linkEnter.merge(linkSel).attr("stroke", (d) => colorByType(d.etype));
  const nodeSel = gNodes.selectAll("circle").data(nodes, nodeKey);
  nodeSel.exit().remove();
  const nodeEnter = nodeSel.enter().append("circle").attr("class", "node").attr("r", (d) => nodeRadius(d)).attr("fill", (d) => colorByKind(d.kind)).attr("stroke", "#0b0e12").attr("stroke-width", 0.75).on("pointerdown", (ev) => ev.stopPropagation()).call(
    drag_default().on("start", (ev, d) => {
      ev.sourceEvent?.stopPropagation();
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
  ).on("mouseenter", (_, d) => {
    if (!infoPinned) showInfo(d, links);
  }).on("mousemove", (ev, d) => maybeHighlight(d)).on("mouseleave", () => {
    if (!infoPinned) clearHighlight();
  }).on("click", (_, d) => {
    infoPinned = !infoPinned;
    if (infoPinned) showInfo(d, links);
  });
  const node = nodeEnter.merge(nodeSel).attr("r", (d) => nodeRadius(d));
  const arrowSel = gArrows.selectAll("path").data(links, (d) => d.source.id + "\u2192" + d.target.id + ":" + d.etype);
  arrowSel.exit().remove();
  const arrow = arrowSel.enter().append("path").attr("pointer-events", "none").merge(arrowSel).attr("fill", (d) => colorByType(d.etype));
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
    const counts = (arr) => {
      const m2 = /* @__PURE__ */ new Map();
      for (const l of arr) m2.set(l.etype, (m2.get(l.etype) || 0) + 1);
      return m2;
    };
    const inBy = counts(incoming), outBy = counts(outgoing);
    const badge = (txt) => `<span class="badge">${txt}</span>`;
    const chip = (txt) => `<span class="chip">${txt}</span>`;
    const dot = (t) => `<span class="dot" style="background:${colorByType(t)}"></span>`;
    const sig = [
      d.result ? `${d.result}` : null,
      Array.isArray(d.dummies) && d.dummies.length ? `(${d.dummies.map((x3) => x3.name || x3).join(", ")})` : null
    ].filter(Boolean).join(" ");
    const fileLine = d.file ? `${d.file}${d.line ? `:${d.line}` : ""}` : "";
    info.innerHTML = `
      <div class="info-title">${d.name || d.id}</div>
      <div class="row">
        ${d.kind ? badge(d.kind) : ""} ${d.scope ? badge(`scope: ${d.scope}`) : ""} ${d.visibility ? badge(d.visibility) : ""}
      </div>
      ${sig ? `<div class="row" style="margin-top:6px"><span class="kv">signature:</span> ${chip(sig)}</div>` : ""}
      ${fileLine ? `<div class="row" style="margin-top:6px"><span class="kv">location:</span> ${chip(fileLine)}</div>` : ""}
      <div class="counts">
        ${EDGE_TYPES.map((t) => `
          <div>${dot(t)}in ${t}</div><div>${inBy.get(t) || 0}</div>
          <div>${dot(t)}out ${t}</div><div>${outBy.get(t) || 0}</div>
        `).join("")}
      </div>
    `;
  }
  function endpoints(d) {
    const vx = d.source.x - d.target.x;
    const vy = d.source.y - d.target.y;
    const L = Math.hypot(vx, vy) || 1;
    const ux = vx / L, uy = vy / L;
    const x1 = d.target.x + ux * nodeRadius(d.target);
    const y1 = d.target.y + uy * nodeRadius(d.target);
    const x22 = d.source.x - ux * nodeRadius(d.source);
    const y22 = d.source.y - uy * nodeRadius(d.source);
    return { x1, y1, x2: x22, y2: y22, ux, uy };
  }
  function arrowPath(d, ends) {
    const ARW = 6 / zoomK;
    const HALF = 3.6 / zoomK;
    const bx = ends.x2 - ends.ux * ARW;
    const by = ends.y2 - ends.uy * ARW;
    const px = -ends.uy, py = ends.ux;
    const b1x = bx + px * HALF, b1y = by + py * HALF;
    const b2x = bx - px * HALF, b2y = by - py * HALF;
    return `M${ends.x2},${ends.y2} L${b1x},${b1y} L${b2x},${b2y} Z`;
  }
  function repaint() {
    gLinks.selectAll("line").attr("x1", (d) => {
      const e = d._e = endpoints(d);
      return e.x1;
    }).attr("y1", (d) => d._e.y1).attr("x2", (d) => d._e.x2).attr("y2", (d) => d._e.y2);
    gArrows.selectAll("path").attr("d", (d) => arrowPath(d, d._e));
    gNodes.selectAll("circle").attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    gLabels.selectAll("text").attr("x", (d) => d.x).attr("y", (d) => d.y);
  }
  sim.on("tick", repaint);
  onZoomRepaint = repaint;
  gLabels.selectAll("text").attr("opacity", labelsToggle.checked ? 1 : 0);
  svg.on("click", (ev) => {
    if (ev.target === svg.node()) {
      infoPinned = false;
    }
  });
  if (nodes.length) {
    setTimeout(() => {
      const [minX, minY, maxX, maxY] = extentXY(nodes);
      const w = maxX - minX, h = maxY - minY;
      const vb = [minX - 40, minY - 40, w + 80, h + 80];
      const { clientWidth: CW, clientHeight: CH } = svg.node();
      const k = Math.min(CW / vb[2], CH / vb[3]);
      svg.transition().duration(400).call(zoom.transform, identity2.translate(CW / 2, CH / 2).scale(k).translate(-(vb[0] + vb[2] / 2), -(vb[1] + vb[3] / 2)));
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
filterInput.addEventListener("input", debounce(() => run(edgeTypeSel.value, filterInput.value), 200));
labelsToggle.addEventListener("change", () => run(edgeTypeSel.value, filterInput.value));
run(edgeTypeSel.value, filterInput.value);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL2QzLWRpc3BhdGNoL3NyYy9kaXNwYXRjaC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9uYW1lc3BhY2VzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL25hbWVzcGFjZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jcmVhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvYXJyYXkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0b3JBbGwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9tYXRjaGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zZWxlY3RDaGlsZC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2VsZWN0Q2hpbGRyZW4uanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc3BhcnNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9lbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZXhpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vam9pbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbWVyZ2UuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL29yZGVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zb3J0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9jYWxsLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9ub2Rlcy5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vbm9kZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vc2l6ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZW1wdHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2VhY2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2F0dHIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvd2luZG93LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9zdHlsZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vcHJvcGVydHkuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2NsYXNzZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3RleHQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2h0bWwuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JhaXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9sb3dlci5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vYXBwZW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbnNlcnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL3JlbW92ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vY2xvbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2RhdHVtLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3Rpb24vZGlzcGF0Y2guanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc2VsZWN0aW9uL2l0ZXJhdG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vc3JjL3NlbGVjdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtc2VsZWN0aW9uL3NyYy9zZWxlY3QuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvc291cmNlRXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXNlbGVjdGlvbi9zcmMvcG9pbnRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9ldmVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvbm9kcmFnLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1kcmFnL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtZHJhZy9zcmMvZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWRyYWcvc3JjL2RyYWcuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9kZWZpbmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWNvbG9yL3NyYy9jb2xvci5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2Jhc2lzLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvYmFzaXNDbG9zZWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWludGVycG9sYXRlL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL2NvbG9yLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvcmdiLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvbnVtYmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvc3RyaW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1pbnRlcnBvbGF0ZS9zcmMvdHJhbnNmb3JtL2RlY29tcG9zZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9wYXJzZS5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3RyYW5zZm9ybS9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtaW50ZXJwb2xhdGUvc3JjL3pvb20uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRpbWVyL3NyYy90aW1lci5qcyIsICJub2RlX21vZHVsZXMvZDMtdGltZXIvc3JjL3RpbWVvdXQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2NoZWR1bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvc2VsZWN0aW9uL2ludGVycnVwdC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90d2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbnRlcnBvbGF0ZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9hdHRyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2F0dHJUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kZWxheS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9kdXJhdGlvbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9lYXNlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2Vhc2VWYXJ5aW5nLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2ZpbHRlci5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9tZXJnZS5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9vbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9yZW1vdmUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc2VsZWN0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3NlbGVjdEFsbC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9zZWxlY3Rpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3RyYW5zaXRpb24vc3R5bGVUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90ZXh0LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL3RleHRUd2Vlbi5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy90cmFuc2l0aW9uL2VuZC5qcyIsICJub2RlX21vZHVsZXMvZDMtdHJhbnNpdGlvbi9zcmMvdHJhbnNpdGlvbi9pbmRleC5qcyIsICJub2RlX21vZHVsZXMvZDMtZWFzZS9zcmMvY3ViaWMuanMiLCAibm9kZV9tb2R1bGVzL2QzLXRyYW5zaXRpb24vc3JjL3NlbGVjdGlvbi90cmFuc2l0aW9uLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy10cmFuc2l0aW9uL3NyYy9zZWxlY3Rpb24vaW5kZXguanMiLCAibm9kZV9tb2R1bGVzL2QzLWJydXNoL3NyYy9icnVzaC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2FkZC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2NvdmVyLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvZGF0YS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL2V4dGVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy9maW5kLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcmVtb3ZlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMvcm9vdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3NpemUuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy92aXNpdC5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3Zpc2l0QWZ0ZXIuanMiLCAibm9kZV9tb2R1bGVzL2QzLXF1YWR0cmVlL3NyYy94LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1xdWFkdHJlZS9zcmMveS5qcyIsICJub2RlX21vZHVsZXMvZDMtcXVhZHRyZWUvc3JjL3F1YWR0cmVlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvY29uc3RhbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9qaWdnbGUuanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9jb2xsaWRlLmpzIiwgIm5vZGVfbW9kdWxlcy9kMy1mb3JjZS9zcmMvbGluay5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL2xjZy5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3NpbXVsYXRpb24uanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy9tYW55Qm9keS5qcyIsICJub2RlX21vZHVsZXMvZDMtZm9yY2Uvc3JjL3guanMiLCAibm9kZV9tb2R1bGVzL2QzLWZvcmNlL3NyYy95LmpzIiwgIm5vZGVfbW9kdWxlcy9kMy16b29tL3NyYy9jb25zdGFudC5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvZXZlbnQuanMiLCAibm9kZV9tb2R1bGVzL2QzLXpvb20vc3JjL3RyYW5zZm9ybS5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvbm9ldmVudC5qcyIsICJub2RlX21vZHVsZXMvZDMtem9vbS9zcmMvem9vbS5qcyIsICJjbGllbnQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbInZhciBub29wID0ge3ZhbHVlOiAoKSA9PiB7fX07XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKCkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGFyZ3VtZW50cy5sZW5ndGgsIF8gPSB7fSwgdDsgaSA8IG47ICsraSkge1xuICAgIGlmICghKHQgPSBhcmd1bWVudHNbaV0gKyBcIlwiKSB8fCAodCBpbiBfKSB8fCAvW1xccy5dLy50ZXN0KHQpKSB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIHR5cGU6IFwiICsgdCk7XG4gICAgX1t0XSA9IFtdO1xuICB9XG4gIHJldHVybiBuZXcgRGlzcGF0Y2goXyk7XG59XG5cbmZ1bmN0aW9uIERpc3BhdGNoKF8pIHtcbiAgdGhpcy5fID0gXztcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzLCB0eXBlcykge1xuICByZXR1cm4gdHlwZW5hbWVzLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgbmFtZSA9IFwiXCIsIGkgPSB0LmluZGV4T2YoXCIuXCIpO1xuICAgIGlmIChpID49IDApIG5hbWUgPSB0LnNsaWNlKGkgKyAxKSwgdCA9IHQuc2xpY2UoMCwgaSk7XG4gICAgaWYgKHQgJiYgIXR5cGVzLmhhc093blByb3BlcnR5KHQpKSB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHR5cGU6IFwiICsgdCk7XG4gICAgcmV0dXJuIHt0eXBlOiB0LCBuYW1lOiBuYW1lfTtcbiAgfSk7XG59XG5cbkRpc3BhdGNoLnByb3RvdHlwZSA9IGRpc3BhdGNoLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IERpc3BhdGNoLFxuICBvbjogZnVuY3Rpb24odHlwZW5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF8gPSB0aGlzLl8sXG4gICAgICAgIFQgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIsIF8pLFxuICAgICAgICB0LFxuICAgICAgICBpID0gLTEsXG4gICAgICAgIG4gPSBULmxlbmd0aDtcblxuICAgIC8vIElmIG5vIGNhbGxiYWNrIHdhcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgY2FsbGJhY2sgb2YgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgJiYgKHQgPSBnZXQoX1t0XSwgdHlwZW5hbWUubmFtZSkpKSByZXR1cm4gdDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBhIHR5cGUgd2FzIHNwZWNpZmllZCwgc2V0IHRoZSBjYWxsYmFjayBmb3IgdGhlIGdpdmVuIHR5cGUgYW5kIG5hbWUuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiBhIG51bGwgY2FsbGJhY2sgd2FzIHNwZWNpZmllZCwgcmVtb3ZlIGNhbGxiYWNrcyBvZiB0aGUgZ2l2ZW4gbmFtZS5cbiAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCAmJiB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBjYWxsYmFjazogXCIgKyBjYWxsYmFjayk7XG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIGlmICh0ID0gKHR5cGVuYW1lID0gVFtpXSkudHlwZSkgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBjYWxsYmFjayk7XG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PSBudWxsKSBmb3IgKHQgaW4gXykgX1t0XSA9IHNldChfW3RdLCB0eXBlbmFtZS5uYW1lLCBudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY29weTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvcHkgPSB7fSwgXyA9IHRoaXMuXztcbiAgICBmb3IgKHZhciB0IGluIF8pIGNvcHlbdF0gPSBfW3RdLnNsaWNlKCk7XG4gICAgcmV0dXJuIG5ldyBEaXNwYXRjaChjb3B5KTtcbiAgfSxcbiAgY2FsbDogZnVuY3Rpb24odHlwZSwgdGhhdCkge1xuICAgIGlmICgobiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyKSA+IDApIGZvciAodmFyIGFyZ3MgPSBuZXcgQXJyYXkobiksIGkgPSAwLCBuLCB0OyBpIDwgbjsgKytpKSBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodCA9IHRoaXMuX1t0eXBlXSwgaSA9IDAsIG4gPSB0Lmxlbmd0aDsgaSA8IG47ICsraSkgdFtpXS52YWx1ZS5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfSxcbiAgYXBwbHk6IGZ1bmN0aW9uKHR5cGUsIHRoYXQsIGFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuXy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biB0eXBlOiBcIiArIHR5cGUpO1xuICAgIGZvciAodmFyIHQgPSB0aGlzLl9bdHlwZV0sIGkgPSAwLCBuID0gdC5sZW5ndGg7IGkgPCBuOyArK2kpIHRbaV0udmFsdWUuYXBwbHkodGhhdCwgYXJncyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldCh0eXBlLCBuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGgsIGM7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAoKGMgPSB0eXBlW2ldKS5uYW1lID09PSBuYW1lKSB7XG4gICAgICByZXR1cm4gYy52YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKSB7XG4gIGZvciAodmFyIGkgPSAwLCBuID0gdHlwZS5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICBpZiAodHlwZVtpXS5uYW1lID09PSBuYW1lKSB7XG4gICAgICB0eXBlW2ldID0gbm9vcCwgdHlwZSA9IHR5cGUuc2xpY2UoMCwgaSkuY29uY2F0KHR5cGUuc2xpY2UoaSArIDEpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkgdHlwZS5wdXNoKHtuYW1lOiBuYW1lLCB2YWx1ZTogY2FsbGJhY2t9KTtcbiAgcmV0dXJuIHR5cGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BhdGNoO1xuIiwgImV4cG9ydCB2YXIgeGh0bWwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzdmc6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgeGh0bWw6IHhodG1sLFxuICB4bGluazogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXG4gIHhtbDogXCJodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2VcIixcbiAgeG1sbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy9cIlxufTtcbiIsICJpbXBvcnQgbmFtZXNwYWNlcyBmcm9tIFwiLi9uYW1lc3BhY2VzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUpIHtcbiAgdmFyIHByZWZpeCA9IG5hbWUgKz0gXCJcIiwgaSA9IHByZWZpeC5pbmRleE9mKFwiOlwiKTtcbiAgaWYgKGkgPj0gMCAmJiAocHJlZml4ID0gbmFtZS5zbGljZSgwLCBpKSkgIT09IFwieG1sbnNcIikgbmFtZSA9IG5hbWUuc2xpY2UoaSArIDEpO1xuICByZXR1cm4gbmFtZXNwYWNlcy5oYXNPd25Qcm9wZXJ0eShwcmVmaXgpID8ge3NwYWNlOiBuYW1lc3BhY2VzW3ByZWZpeF0sIGxvY2FsOiBuYW1lfSA6IG5hbWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG59XG4iLCAiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi9uYW1lc3BhY2UuanNcIjtcbmltcG9ydCB7eGh0bWx9IGZyb20gXCIuL25hbWVzcGFjZXMuanNcIjtcblxuZnVuY3Rpb24gY3JlYXRvckluaGVyaXQobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICByZXR1cm4gdXJpID09PSB4aHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbFxuICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckZpeGVkKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcbiAgcmV0dXJuIChmdWxsbmFtZS5sb2NhbFxuICAgICAgPyBjcmVhdG9yRml4ZWRcbiAgICAgIDogY3JlYXRvckluaGVyaXQpKGZ1bGxuYW1lKTtcbn1cbiIsICJmdW5jdGlvbiBub25lKCkge31cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBub25lIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCAhPT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBzZWxlY3RvcihzZWxlY3QpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBuZXcgQXJyYXkobiksIG5vZGUsIHN1Ym5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKHN1Ym5vZGUgPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpKSB7XG4gICAgICAgIGlmIChcIl9fZGF0YV9fXCIgaW4gbm9kZSkgc3Vibm9kZS5fX2RhdGFfXyA9IG5vZGUuX19kYXRhX187XG4gICAgICAgIHN1Ymdyb3VwW2ldID0gc3Vibm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgIi8vIEdpdmVuIHNvbWV0aGluZyBhcnJheSBsaWtlIChvciBudWxsKSwgcmV0dXJucyBzb21ldGhpbmcgdGhhdCBpcyBzdHJpY3RseSBhblxuLy8gYXJyYXkuIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCBhcnJheS1saWtlIG9iamVjdHMgcGFzc2VkIHRvIGQzLnNlbGVjdEFsbFxuLy8gb3Igc2VsZWN0aW9uLnNlbGVjdEFsbCBhcmUgY29udmVydGVkIGludG8gcHJvcGVyIGFycmF5cyB3aGVuIGNyZWF0aW5nIGFcbi8vIHNlbGVjdGlvbjsgd2UgZG9uXHUyMDE5dCBldmVyIHdhbnQgdG8gY3JlYXRlIGEgc2VsZWN0aW9uIGJhY2tlZCBieSBhIGxpdmVcbi8vIEhUTUxDb2xsZWN0aW9uIG9yIE5vZGVMaXN0LiBIb3dldmVyLCBub3RlIHRoYXQgc2VsZWN0aW9uLnNlbGVjdEFsbCB3aWxsIHVzZSBhXG4vLyBzdGF0aWMgTm9kZUxpc3QgYXMgYSBncm91cCwgc2luY2UgaXQgc2FmZWx5IGRlcml2ZWQgZnJvbSBxdWVyeVNlbGVjdG9yQWxsLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXJyYXkoeCkge1xuICByZXR1cm4geCA9PSBudWxsID8gW10gOiBBcnJheS5pc0FycmF5KHgpID8geCA6IEFycmF5LmZyb20oeCk7XG59XG4iLCAiZnVuY3Rpb24gZW1wdHkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBlbXB0eSA6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IGFycmF5IGZyb20gXCIuLi9hcnJheS5qc1wiO1xuaW1wb3J0IHNlbGVjdG9yQWxsIGZyb20gXCIuLi9zZWxlY3RvckFsbC5qc1wiO1xuXG5mdW5jdGlvbiBhcnJheUFsbChzZWxlY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBhcnJheShzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICBpZiAodHlwZW9mIHNlbGVjdCA9PT0gXCJmdW5jdGlvblwiKSBzZWxlY3QgPSBhcnJheUFsbChzZWxlY3QpO1xuICBlbHNlIHNlbGVjdCA9IHNlbGVjdG9yQWxsKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gW10sIHBhcmVudHMgPSBbXSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc3ViZ3JvdXBzLnB1c2goc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKTtcbiAgICAgICAgcGFyZW50cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hpbGRNYXRjaGVyKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbiIsICJpbXBvcnQge2NoaWxkTWF0Y2hlcn0gZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxudmFyIGZpbmQgPSBBcnJheS5wcm90b3R5cGUuZmluZDtcblxuZnVuY3Rpb24gY2hpbGRGaW5kKG1hdGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmluZC5jYWxsKHRoaXMuY2hpbGRyZW4sIG1hdGNoKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2hpbGRGaXJzdCgpIHtcbiAgcmV0dXJuIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdChtYXRjaCA9PSBudWxsID8gY2hpbGRGaXJzdFxuICAgICAgOiBjaGlsZEZpbmQodHlwZW9mIG1hdGNoID09PSBcImZ1bmN0aW9uXCIgPyBtYXRjaCA6IGNoaWxkTWF0Y2hlcihtYXRjaCkpKTtcbn1cbiIsICJpbXBvcnQge2NoaWxkTWF0Y2hlcn0gZnJvbSBcIi4uL21hdGNoZXIuanNcIjtcblxudmFyIGZpbHRlciA9IEFycmF5LnByb3RvdHlwZS5maWx0ZXI7XG5cbmZ1bmN0aW9uIGNoaWxkcmVuKCkge1xuICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKTtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW5GaWx0ZXIobWF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmaWx0ZXIuY2FsbCh0aGlzLmNoaWxkcmVuLCBtYXRjaCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdEFsbChtYXRjaCA9PSBudWxsID8gY2hpbGRyZW5cbiAgICAgIDogY2hpbGRyZW5GaWx0ZXIodHlwZW9mIG1hdGNoID09PSBcImZ1bmN0aW9uXCIgPyBtYXRjaCA6IGNoaWxkTWF0Y2hlcihtYXRjaCkpKTtcbn1cbiIsICJpbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBtYXRjaGVyIGZyb20gXCIuLi9tYXRjaGVyLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1hdGNoKSB7XG4gIGlmICh0eXBlb2YgbWF0Y2ggIT09IFwiZnVuY3Rpb25cIikgbWF0Y2ggPSBtYXRjaGVyKG1hdGNoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gW10sIG5vZGUsIGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgbWF0Y2guY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpIHtcbiAgICAgICAgc3ViZ3JvdXAucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHVwZGF0ZSkge1xuICByZXR1cm4gbmV3IEFycmF5KHVwZGF0ZS5sZW5ndGgpO1xufVxuIiwgImltcG9ydCBzcGFyc2UgZnJvbSBcIi4vc3BhcnNlLmpzXCI7XG5pbXBvcnQge1NlbGVjdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2VudGVyIHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFbnRlck5vZGUocGFyZW50LCBkYXR1bSkge1xuICB0aGlzLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgdGhpcy5uYW1lc3BhY2VVUkkgPSBwYXJlbnQubmFtZXNwYWNlVVJJO1xuICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB0aGlzLl9fZGF0YV9fID0gZGF0dW07XG59XG5cbkVudGVyTm9kZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBFbnRlck5vZGUsXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fbmV4dCk7IH0sXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24oY2hpbGQsIG5leHQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5leHQpOyB9LFxuICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOyB9LFxuICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpOyB9XG59O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4O1xuICB9O1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuaW1wb3J0IHtFbnRlck5vZGV9IGZyb20gXCIuL2VudGVyLmpzXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4uL2NvbnN0YW50LmpzXCI7XG5cbmZ1bmN0aW9uIGJpbmRJbmRleChwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhKSB7XG4gIHZhciBpID0gMCxcbiAgICAgIG5vZGUsXG4gICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgIGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZml0IGludG8gdXBkYXRlLlxuICAvLyBQdXQgYW55IG51bGwgbm9kZXMgaW50byBlbnRlci5cbiAgLy8gUHV0IGFueSByZW1haW5pbmcgZGF0YSBpbnRvIGVudGVyLlxuICBmb3IgKDsgaSA8IGRhdGFMZW5ndGg7ICsraSkge1xuICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgIG5vZGUuX19kYXRhX18gPSBkYXRhW2ldO1xuICAgICAgdXBkYXRlW2ldID0gbm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW50ZXJbaV0gPSBuZXcgRW50ZXJOb2RlKHBhcmVudCwgZGF0YVtpXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gUHV0IGFueSBub24tbnVsbCBub2RlcyB0aGF0IGRvblx1MjAxOXQgZml0IGludG8gZXhpdC5cbiAgZm9yICg7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJpbmRLZXkocGFyZW50LCBncm91cCwgZW50ZXIsIHVwZGF0ZSwgZXhpdCwgZGF0YSwga2V5KSB7XG4gIHZhciBpLFxuICAgICAgbm9kZSxcbiAgICAgIG5vZGVCeUtleVZhbHVlID0gbmV3IE1hcCxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKSxcbiAgICAgIGtleVZhbHVlO1xuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBub2RlLlxuICAvLyBJZiBtdWx0aXBsZSBub2RlcyBoYXZlIHRoZSBzYW1lIGtleSwgdGhlIGR1cGxpY2F0ZXMgYXJlIGFkZGVkIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXkuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkgKyBcIlwiO1xuICAgICAgaWYgKG5vZGVCeUtleVZhbHVlLmhhcyhrZXlWYWx1ZSkpIHtcbiAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlQnlLZXlWYWx1ZS5zZXQoa2V5VmFsdWUsIG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBkYXR1bS5cbiAgLy8gSWYgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleSwgam9pbiBhbmQgYWRkIGl0IHRvIHVwZGF0ZS5cbiAgLy8gSWYgdGhlcmUgaXMgbm90IChvciB0aGUga2V5IGlzIGEgZHVwbGljYXRlKSwgYWRkIGl0IHRvIGVudGVyLlxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAga2V5VmFsdWUgPSBrZXkuY2FsbChwYXJlbnQsIGRhdGFbaV0sIGksIGRhdGEpICsgXCJcIjtcbiAgICBpZiAobm9kZSA9IG5vZGVCeUtleVZhbHVlLmdldChrZXlWYWx1ZSkpIHtcbiAgICAgIHVwZGF0ZVtpXSA9IG5vZGU7XG4gICAgICBub2RlLl9fZGF0YV9fID0gZGF0YVtpXTtcbiAgICAgIG5vZGVCeUtleVZhbHVlLmRlbGV0ZShrZXlWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudGVyW2ldID0gbmV3IEVudGVyTm9kZShwYXJlbnQsIGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIEFkZCBhbnkgcmVtYWluaW5nIG5vZGVzIHRoYXQgd2VyZSBub3QgYm91bmQgdG8gZGF0YSB0byBleGl0LlxuICBmb3IgKGkgPSAwOyBpIDwgZ3JvdXBMZW5ndGg7ICsraSkge1xuICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAobm9kZUJ5S2V5VmFsdWUuZ2V0KGtleVZhbHVlc1tpXSkgPT09IG5vZGUpKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZGF0dW0obm9kZSkge1xuICByZXR1cm4gbm9kZS5fX2RhdGFfXztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBBcnJheS5mcm9tKHRoaXMsIGRhdHVtKTtcblxuICB2YXIgYmluZCA9IGtleSA/IGJpbmRLZXkgOiBiaW5kSW5kZXgsXG4gICAgICBwYXJlbnRzID0gdGhpcy5fcGFyZW50cyxcbiAgICAgIGdyb3VwcyA9IHRoaXMuX2dyb3VwcztcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHZhbHVlID0gY29uc3RhbnQodmFsdWUpO1xuXG4gIGZvciAodmFyIG0gPSBncm91cHMubGVuZ3RoLCB1cGRhdGUgPSBuZXcgQXJyYXkobSksIGVudGVyID0gbmV3IEFycmF5KG0pLCBleGl0ID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIHZhciBwYXJlbnQgPSBwYXJlbnRzW2pdLFxuICAgICAgICBncm91cCA9IGdyb3Vwc1tqXSxcbiAgICAgICAgZ3JvdXBMZW5ndGggPSBncm91cC5sZW5ndGgsXG4gICAgICAgIGRhdGEgPSBhcnJheWxpa2UodmFsdWUuY2FsbChwYXJlbnQsIHBhcmVudCAmJiBwYXJlbnQuX19kYXRhX18sIGosIHBhcmVudHMpKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59XG5cbi8vIEdpdmVuIHNvbWUgZGF0YSwgdGhpcyByZXR1cm5zIGFuIGFycmF5LWxpa2UgdmlldyBvZiBpdDogYW4gb2JqZWN0IHRoYXRcbi8vIGV4cG9zZXMgYSBsZW5ndGggcHJvcGVydHkgYW5kIGFsbG93cyBudW1lcmljIGluZGV4aW5nLiBOb3RlIHRoYXQgdW5saWtlXG4vLyBzZWxlY3RBbGwsIHRoaXMgaXNuXHUyMDE5dCB3b3JyaWVkIGFib3V0IFx1MjAxQ2xpdmVcdTIwMUQgY29sbGVjdGlvbnMgYmVjYXVzZSB0aGUgcmVzdWx0aW5nXG4vLyBhcnJheSB3aWxsIG9ubHkgYmUgdXNlZCBicmllZmx5IHdoaWxlIGRhdGEgaXMgYmVpbmcgYm91bmQuIChJdCBpcyBwb3NzaWJsZSB0b1xuLy8gY2F1c2UgdGhlIGRhdGEgdG8gY2hhbmdlIHdoaWxlIGl0ZXJhdGluZyBieSB1c2luZyBhIGtleSBmdW5jdGlvbiwgYnV0IHBsZWFzZVxuLy8gZG9uXHUyMDE5dDsgd2VcdTIwMTlkIHJhdGhlciBhdm9pZCBhIGdyYXR1aXRvdXMgY29weS4pXG5mdW5jdGlvbiBhcnJheWxpa2UoZGF0YSkge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgXCJsZW5ndGhcIiBpbiBkYXRhXG4gICAgPyBkYXRhIC8vIEFycmF5LCBUeXBlZEFycmF5LCBOb2RlTGlzdCwgYXJyYXktbGlrZVxuICAgIDogQXJyYXkuZnJvbShkYXRhKTsgLy8gTWFwLCBTZXQsIGl0ZXJhYmxlLCBzdHJpbmcsIG9yIGFueXRoaW5nIGVsc2Vcbn1cbiIsICJpbXBvcnQgc3BhcnNlIGZyb20gXCIuL3NwYXJzZS5qc1wiO1xuaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9leGl0IHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob25lbnRlciwgb251cGRhdGUsIG9uZXhpdCkge1xuICB2YXIgZW50ZXIgPSB0aGlzLmVudGVyKCksIHVwZGF0ZSA9IHRoaXMsIGV4aXQgPSB0aGlzLmV4aXQoKTtcbiAgaWYgKHR5cGVvZiBvbmVudGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBlbnRlciA9IG9uZW50ZXIoZW50ZXIpO1xuICAgIGlmIChlbnRlcikgZW50ZXIgPSBlbnRlci5zZWxlY3Rpb24oKTtcbiAgfSBlbHNlIHtcbiAgICBlbnRlciA9IGVudGVyLmFwcGVuZChvbmVudGVyICsgXCJcIik7XG4gIH1cbiAgaWYgKG9udXBkYXRlICE9IG51bGwpIHtcbiAgICB1cGRhdGUgPSBvbnVwZGF0ZSh1cGRhdGUpO1xuICAgIGlmICh1cGRhdGUpIHVwZGF0ZSA9IHVwZGF0ZS5zZWxlY3Rpb24oKTtcbiAgfVxuICBpZiAob25leGl0ID09IG51bGwpIGV4aXQucmVtb3ZlKCk7IGVsc2Ugb25leGl0KGV4aXQpO1xuICByZXR1cm4gZW50ZXIgJiYgdXBkYXRlID8gZW50ZXIubWVyZ2UodXBkYXRlKS5vcmRlcigpIDogdXBkYXRlO1xufVxuIiwgImltcG9ydCB7U2VsZWN0aW9ufSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb250ZXh0KSB7XG4gIHZhciBzZWxlY3Rpb24gPSBjb250ZXh0LnNlbGVjdGlvbiA/IGNvbnRleHQuc2VsZWN0aW9uKCkgOiBjb250ZXh0O1xuXG4gIGZvciAodmFyIGdyb3VwczAgPSB0aGlzLl9ncm91cHMsIGdyb3VwczEgPSBzZWxlY3Rpb24uX2dyb3VwcywgbTAgPSBncm91cHMwLmxlbmd0aCwgbTEgPSBncm91cHMxLmxlbmd0aCwgbSA9IE1hdGgubWluKG0wLCBtMSksIG1lcmdlcyA9IG5ldyBBcnJheShtMCksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAwID0gZ3JvdXBzMFtqXSwgZ3JvdXAxID0gZ3JvdXBzMVtqXSwgbiA9IGdyb3VwMC5sZW5ndGgsIG1lcmdlID0gbWVyZ2VzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cDBbaV0gfHwgZ3JvdXAxW2ldKSB7XG4gICAgICAgIG1lcmdlW2ldID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKDsgaiA8IG0wOyArK2opIHtcbiAgICBtZXJnZXNbal0gPSBncm91cHMwW2pdO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24obWVyZ2VzLCB0aGlzLl9wYXJlbnRzKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBub2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5leHQpIF4gNCkgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgaWYgKCFjb21wYXJlKSBjb21wYXJlID0gYXNjZW5kaW5nO1xuXG4gIGZ1bmN0aW9uIGNvbXBhcmVOb2RlKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyZShhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH1cblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzb3J0Z3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzb3J0Z3JvdXAgPSBzb3J0Z3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzb3J0Z3JvdXBbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0Z3JvdXAuc29ydChjb21wYXJlTm9kZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzb3J0Z3JvdXBzLCB0aGlzLl9wYXJlbnRzKS5vcmRlcigpO1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1swXTtcbiAgYXJndW1lbnRzWzBdID0gdGhpcztcbiAgY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKHRoaXMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgaiA9IDAsIG0gPSBncm91cHMubGVuZ3RoOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSAwLCBuID0gZ3JvdXAubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICB2YXIgbm9kZSA9IGdyb3VwW2ldO1xuICAgICAgaWYgKG5vZGUpIHJldHVybiBub2RlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBsZXQgc2l6ZSA9IDA7XG4gIGZvciAoY29uc3Qgbm9kZSBvZiB0aGlzKSArK3NpemU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIHNpemU7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5ub2RlKCk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2FsbGJhY2spIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IG5hbWVzcGFjZSBmcm9tIFwiLi4vbmFtZXNwYWNlLmpzXCI7XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmVOUyhmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb25OUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdik7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgIHJldHVybiBmdWxsbmFtZS5sb2NhbFxuICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKVxuICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKGZ1bGxuYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0clJlbW92ZU5TIDogYXR0clJlbW92ZSkgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSkpKGZ1bGxuYW1lLCB2YWx1ZSkpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIChub2RlLm93bmVyRG9jdW1lbnQgJiYgbm9kZS5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3KSAvLyBub2RlIGlzIGEgTm9kZVxuICAgICAgfHwgKG5vZGUuZG9jdW1lbnQgJiYgbm9kZSkgLy8gbm9kZSBpcyBhIFdpbmRvd1xuICAgICAgfHwgbm9kZS5kZWZhdWx0VmlldzsgLy8gbm9kZSBpcyBhIERvY3VtZW50XG59XG4iLCAiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3cuanNcIjtcblxuZnVuY3Rpb24gc3R5bGVSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVDb25zdGFudChuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVGdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICAgIGVsc2UgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2LCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHN0eWxlUmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gc3R5bGVGdW5jdGlvblxuICAgICAgICAgICAgOiBzdHlsZUNvbnN0YW50KShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpXG4gICAgICA6IHN0eWxlVmFsdWUodGhpcy5ub2RlKCksIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3R5bGVWYWx1ZShub2RlLCBuYW1lKSB7XG4gIHJldHVybiBub2RlLnN0eWxlLmdldFByb3BlcnR5VmFsdWUobmFtZSlcbiAgICAgIHx8IGRlZmF1bHRWaWV3KG5vZGUpLmdldENvbXB1dGVkU3R5bGUobm9kZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbn1cbiIsICJmdW5jdGlvbiBwcm9wZXJ0eVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0gdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxXG4gICAgICA/IHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gcHJvcGVydHlSZW1vdmUgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gcHJvcGVydHlGdW5jdGlvblxuICAgICAgICAgIDogcHJvcGVydHlDb25zdGFudCkobmFtZSwgdmFsdWUpKVxuICAgICAgOiB0aGlzLm5vZGUoKVtuYW1lXTtcbn1cbiIsICJmdW5jdGlvbiBjbGFzc0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnRyaW0oKS5zcGxpdCgvXnxcXHMrLyk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzTGlzdChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTGlzdCB8fCBuZXcgQ2xhc3NMaXN0KG5vZGUpO1xufVxuXG5mdW5jdGlvbiBDbGFzc0xpc3Qobm9kZSkge1xuICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgdGhpcy5fbmFtZXMgPSBjbGFzc0FycmF5KG5vZGUuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIik7XG59XG5cbkNsYXNzTGlzdC5wcm90b3R5cGUgPSB7XG4gIGFkZDogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnB1c2gobmFtZSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcbiAgICBpZiAoaSA+PSAwKSB7XG4gICAgICB0aGlzLl9uYW1lcy5zcGxpY2UoaSwgMSk7XG4gICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMuX25hbWVzLmpvaW4oXCIgXCIpKTtcbiAgICB9XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWVzLmluZGV4T2YobmFtZSkgPj0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY2xhc3NlZEFkZChub2RlLCBuYW1lcykge1xuICB2YXIgbGlzdCA9IGNsYXNzTGlzdChub2RlKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICB3aGlsZSAoKytpIDwgbikgbGlzdC5hZGQobmFtZXNbaV0pO1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkUmVtb3ZlKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LnJlbW92ZShuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRUcnVlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkQWRkKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZhbHNlKG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjbGFzc2VkUmVtb3ZlKHRoaXMsIG5hbWVzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZEZ1bmN0aW9uKG5hbWVzLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgKHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgPyBjbGFzc2VkQWRkIDogY2xhc3NlZFJlbW92ZSkodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICB2YXIgbmFtZXMgPSBjbGFzc0FycmF5KG5hbWUgKyBcIlwiKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbGlzdCA9IGNsYXNzTGlzdCh0aGlzLm5vZGUoKSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFsaXN0LmNvbnRhaW5zKG5hbWVzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gY2xhc3NlZEZ1bmN0aW9uIDogdmFsdWVcbiAgICAgID8gY2xhc3NlZFRydWVcbiAgICAgIDogY2xhc3NlZEZhbHNlKShuYW1lcywgdmFsdWUpKTtcbn1cbiIsICJmdW5jdGlvbiB0ZXh0UmVtb3ZlKCkge1xuICB0aGlzLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHRleHRSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHRleHRGdW5jdGlvblxuICAgICAgICAgIDogdGV4dENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufVxuIiwgImZ1bmN0aW9uIGh0bWxSZW1vdmUoKSB7XG4gIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gaHRtbENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlubmVySFRNTCA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBodG1sRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0aGlzLmlubmVySFRNTCA9IHYgPT0gbnVsbCA/IFwiXCIgOiB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2godmFsdWUgPT0gbnVsbFxuICAgICAgICAgID8gaHRtbFJlbW92ZSA6ICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgID8gaHRtbEZ1bmN0aW9uXG4gICAgICAgICAgOiBodG1sQ29uc3RhbnQpKHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKCkuaW5uZXJIVE1MO1xufVxuIiwgImZ1bmN0aW9uIHJhaXNlKCkge1xuICBpZiAodGhpcy5uZXh0U2libGluZykgdGhpcy5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHRoaXMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyYWlzZSk7XG59XG4iLCAiZnVuY3Rpb24gbG93ZXIoKSB7XG4gIGlmICh0aGlzLnByZXZpb3VzU2libGluZykgdGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLCB0aGlzLnBhcmVudE5vZGUuZmlyc3RDaGlsZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKGxvd2VyKTtcbn1cbiIsICJpbXBvcnQgY3JlYXRvciBmcm9tIFwiLi4vY3JlYXRvci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlbmRDaGlsZChjcmVhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH0pO1xufVxuIiwgImltcG9ydCBjcmVhdG9yIGZyb20gXCIuLi9jcmVhdG9yLmpzXCI7XG5pbXBvcnQgc2VsZWN0b3IgZnJvbSBcIi4uL3NlbGVjdG9yLmpzXCI7XG5cbmZ1bmN0aW9uIGNvbnN0YW50TnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIGJlZm9yZSkge1xuICB2YXIgY3JlYXRlID0gdHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIiA/IG5hbWUgOiBjcmVhdG9yKG5hbWUpLFxuICAgICAgc2VsZWN0ID0gYmVmb3JlID09IG51bGwgPyBjb25zdGFudE51bGwgOiB0eXBlb2YgYmVmb3JlID09PSBcImZ1bmN0aW9uXCIgPyBiZWZvcmUgOiBzZWxlY3RvcihiZWZvcmUpO1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QmVmb3JlKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCBzZWxlY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCBudWxsKTtcbiAgfSk7XG59XG4iLCAiZnVuY3Rpb24gcmVtb3ZlKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5lYWNoKHJlbW92ZSk7XG59XG4iLCAiZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lU2hhbGxvdygpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVEZWVwKCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZGVlcCkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QoZGVlcCA/IHNlbGVjdGlvbl9jbG9uZURlZXAgOiBzZWxlY3Rpb25fY2xvbmVTaGFsbG93KTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufVxuIiwgImZ1bmN0aW9uIGNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lcikge1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50LCB0aGlzLl9fZGF0YV9fKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUeXBlbmFtZXModHlwZW5hbWVzKSB7XG4gIHJldHVybiB0eXBlbmFtZXMudHJpbSgpLnNwbGl0KC9efFxccysvKS5tYXAoZnVuY3Rpb24odCkge1xuICAgIHZhciBuYW1lID0gXCJcIiwgaSA9IHQuaW5kZXhPZihcIi5cIik7XG4gICAgaWYgKGkgPj0gMCkgbmFtZSA9IHQuc2xpY2UoaSArIDEpLCB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICByZXR1cm4ge3R5cGU6IHQsIG5hbWU6IG5hbWV9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25SZW1vdmUodHlwZW5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBvbiA9IHRoaXMuX19vbjtcbiAgICBpZiAoIW9uKSByZXR1cm47XG4gICAgZm9yICh2YXIgaiA9IDAsIGkgPSAtMSwgbSA9IG9uLmxlbmd0aCwgbzsgaiA8IG07ICsraikge1xuICAgICAgaWYgKG8gPSBvbltqXSwgKCF0eXBlbmFtZS50eXBlIHx8IG8udHlwZSA9PT0gdHlwZW5hbWUudHlwZSkgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8ub3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvblsrK2ldID0gbztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCsraSkgb24ubGVuZ3RoID0gaTtcbiAgICBlbHNlIGRlbGV0ZSB0aGlzLl9fb247XG4gIH07XG59XG5cbmZ1bmN0aW9uIG9uQWRkKHR5cGVuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uLCBvLCBsaXN0ZW5lciA9IGNvbnRleHRMaXN0ZW5lcih2YWx1ZSk7XG4gICAgaWYgKG9uKSBmb3IgKHZhciBqID0gMCwgbSA9IG9uLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgICAgaWYgKChvID0gb25bal0pLnR5cGUgPT09IHR5cGVuYW1lLnR5cGUgJiYgby5uYW1lID09PSB0eXBlbmFtZS5uYW1lKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIsIG8ub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihvLnR5cGUsIG8ubGlzdGVuZXIgPSBsaXN0ZW5lciwgby5vcHRpb25zID0gb3B0aW9ucyk7XG4gICAgICAgIG8udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodHlwZW5hbWUudHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICAgIG8gPSB7dHlwZTogdHlwZW5hbWUudHlwZSwgbmFtZTogdHlwZW5hbWUubmFtZSwgdmFsdWU6IHZhbHVlLCBsaXN0ZW5lcjogbGlzdGVuZXIsIG9wdGlvbnM6IG9wdGlvbnN9O1xuICAgIGlmICghb24pIHRoaXMuX19vbiA9IFtvXTtcbiAgICBlbHNlIG9uLnB1c2gobyk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHR5cGVuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdHlwZW5hbWVzID0gcGFyc2VUeXBlbmFtZXModHlwZW5hbWUgKyBcIlwiKSwgaSwgbiA9IHR5cGVuYW1lcy5sZW5ndGgsIHQ7XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgdmFyIG9uID0gdGhpcy5ub2RlKCkuX19vbjtcbiAgICBpZiAob24pIGZvciAodmFyIGogPSAwLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBmb3IgKGkgPSAwLCBvID0gb25bal07IGkgPCBuOyArK2kpIHtcbiAgICAgICAgaWYgKCh0ID0gdHlwZW5hbWVzW2ldKS50eXBlID09PSBvLnR5cGUgJiYgdC5uYW1lID09PSBvLm5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gby52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBvbiA9IHZhbHVlID8gb25BZGQgOiBvblJlbW92ZTtcbiAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgdGhpcy5lYWNoKG9uKHR5cGVuYW1lc1tpXSwgdmFsdWUsIG9wdGlvbnMpKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiaW1wb3J0IGRlZmF1bHRWaWV3IGZyb20gXCIuLi93aW5kb3cuanNcIjtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChub2RlLCB0eXBlLCBwYXJhbXMpIHtcbiAgdmFyIHdpbmRvdyA9IGRlZmF1bHRWaWV3KG5vZGUpLFxuICAgICAgZXZlbnQgPSB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG5cbiAgaWYgKHR5cGVvZiBldmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXZlbnQgPSBuZXcgZXZlbnQodHlwZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudCA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGlmIChwYXJhbXMpIGV2ZW50LmluaXRFdmVudCh0eXBlLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpLCBldmVudC5kZXRhaWwgPSBwYXJhbXMuZGV0YWlsO1xuICAgIGVsc2UgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaENvbnN0YW50KHR5cGUsIHBhcmFtcykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRpc3BhdGNoRXZlbnQodGhpcywgdHlwZSwgcGFyYW1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hGdW5jdGlvbih0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiB0aGlzLmVhY2goKHR5cGVvZiBwYXJhbXMgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBkaXNwYXRjaEZ1bmN0aW9uXG4gICAgICA6IGRpc3BhdGNoQ29uc3RhbnQpKHR5cGUsIHBhcmFtcykpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKigpIHtcbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHlpZWxkIG5vZGU7XG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHNlbGVjdGlvbl9zZWxlY3QgZnJvbSBcIi4vc2VsZWN0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3NlbGVjdEFsbCBmcm9tIFwiLi9zZWxlY3RBbGwuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0Q2hpbGQgZnJvbSBcIi4vc2VsZWN0Q2hpbGQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fc2VsZWN0Q2hpbGRyZW4gZnJvbSBcIi4vc2VsZWN0Q2hpbGRyZW4uanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZmlsdGVyIGZyb20gXCIuL2ZpbHRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kYXRhIGZyb20gXCIuL2RhdGEuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZW50ZXIgZnJvbSBcIi4vZW50ZXIuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZXhpdCBmcm9tIFwiLi9leGl0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2pvaW4gZnJvbSBcIi4vam9pbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9tZXJnZSBmcm9tIFwiLi9tZXJnZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9vcmRlciBmcm9tIFwiLi9vcmRlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zb3J0IGZyb20gXCIuL3NvcnQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fY2FsbCBmcm9tIFwiLi9jYWxsLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX25vZGVzIGZyb20gXCIuL25vZGVzLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX25vZGUgZnJvbSBcIi4vbm9kZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zaXplIGZyb20gXCIuL3NpemUuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZW1wdHkgZnJvbSBcIi4vZW1wdHkuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fZWFjaCBmcm9tIFwiLi9lYWNoLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2F0dHIgZnJvbSBcIi4vYXR0ci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9zdHlsZSBmcm9tIFwiLi9zdHlsZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9wcm9wZXJ0eSBmcm9tIFwiLi9wcm9wZXJ0eS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jbGFzc2VkIGZyb20gXCIuL2NsYXNzZWQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fdGV4dCBmcm9tIFwiLi90ZXh0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2h0bWwgZnJvbSBcIi4vaHRtbC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9yYWlzZSBmcm9tIFwiLi9yYWlzZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9sb3dlciBmcm9tIFwiLi9sb3dlci5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9hcHBlbmQgZnJvbSBcIi4vYXBwZW5kLmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX2luc2VydCBmcm9tIFwiLi9pbnNlcnQuanNcIjtcbmltcG9ydCBzZWxlY3Rpb25fcmVtb3ZlIGZyb20gXCIuL3JlbW92ZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9jbG9uZSBmcm9tIFwiLi9jbG9uZS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kYXR1bSBmcm9tIFwiLi9kYXR1bS5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9vbiBmcm9tIFwiLi9vbi5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9kaXNwYXRjaCBmcm9tIFwiLi9kaXNwYXRjaC5qc1wiO1xuaW1wb3J0IHNlbGVjdGlvbl9pdGVyYXRvciBmcm9tIFwiLi9pdGVyYXRvci5qc1wiO1xuXG5leHBvcnQgdmFyIHJvb3QgPSBbbnVsbF07XG5cbmV4cG9ydCBmdW5jdGlvbiBTZWxlY3Rpb24oZ3JvdXBzLCBwYXJlbnRzKSB7XG4gIHRoaXMuX2dyb3VwcyA9IGdyb3VwcztcbiAgdGhpcy5fcGFyZW50cyA9IHBhcmVudHM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdXSwgcm9vdCk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9zZWxlY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzO1xufVxuXG5TZWxlY3Rpb24ucHJvdG90eXBlID0gc2VsZWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFNlbGVjdGlvbixcbiAgc2VsZWN0OiBzZWxlY3Rpb25fc2VsZWN0LFxuICBzZWxlY3RBbGw6IHNlbGVjdGlvbl9zZWxlY3RBbGwsXG4gIHNlbGVjdENoaWxkOiBzZWxlY3Rpb25fc2VsZWN0Q2hpbGQsXG4gIHNlbGVjdENoaWxkcmVuOiBzZWxlY3Rpb25fc2VsZWN0Q2hpbGRyZW4sXG4gIGZpbHRlcjogc2VsZWN0aW9uX2ZpbHRlcixcbiAgZGF0YTogc2VsZWN0aW9uX2RhdGEsXG4gIGVudGVyOiBzZWxlY3Rpb25fZW50ZXIsXG4gIGV4aXQ6IHNlbGVjdGlvbl9leGl0LFxuICBqb2luOiBzZWxlY3Rpb25fam9pbixcbiAgbWVyZ2U6IHNlbGVjdGlvbl9tZXJnZSxcbiAgc2VsZWN0aW9uOiBzZWxlY3Rpb25fc2VsZWN0aW9uLFxuICBvcmRlcjogc2VsZWN0aW9uX29yZGVyLFxuICBzb3J0OiBzZWxlY3Rpb25fc29ydCxcbiAgY2FsbDogc2VsZWN0aW9uX2NhbGwsXG4gIG5vZGVzOiBzZWxlY3Rpb25fbm9kZXMsXG4gIG5vZGU6IHNlbGVjdGlvbl9ub2RlLFxuICBzaXplOiBzZWxlY3Rpb25fc2l6ZSxcbiAgZW1wdHk6IHNlbGVjdGlvbl9lbXB0eSxcbiAgZWFjaDogc2VsZWN0aW9uX2VhY2gsXG4gIGF0dHI6IHNlbGVjdGlvbl9hdHRyLFxuICBzdHlsZTogc2VsZWN0aW9uX3N0eWxlLFxuICBwcm9wZXJ0eTogc2VsZWN0aW9uX3Byb3BlcnR5LFxuICBjbGFzc2VkOiBzZWxlY3Rpb25fY2xhc3NlZCxcbiAgdGV4dDogc2VsZWN0aW9uX3RleHQsXG4gIGh0bWw6IHNlbGVjdGlvbl9odG1sLFxuICByYWlzZTogc2VsZWN0aW9uX3JhaXNlLFxuICBsb3dlcjogc2VsZWN0aW9uX2xvd2VyLFxuICBhcHBlbmQ6IHNlbGVjdGlvbl9hcHBlbmQsXG4gIGluc2VydDogc2VsZWN0aW9uX2luc2VydCxcbiAgcmVtb3ZlOiBzZWxlY3Rpb25fcmVtb3ZlLFxuICBjbG9uZTogc2VsZWN0aW9uX2Nsb25lLFxuICBkYXR1bTogc2VsZWN0aW9uX2RhdHVtLFxuICBvbjogc2VsZWN0aW9uX29uLFxuICBkaXNwYXRjaDogc2VsZWN0aW9uX2Rpc3BhdGNoLFxuICBbU3ltYm9sLml0ZXJhdG9yXTogc2VsZWN0aW9uX2l0ZXJhdG9yXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZWxlY3Rpb247XG4iLCAiaW1wb3J0IHtTZWxlY3Rpb24sIHJvb3R9IGZyb20gXCIuL3NlbGVjdGlvbi9pbmRleC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKV1dLCBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XSlcbiAgICAgIDogbmV3IFNlbGVjdGlvbihbW3NlbGVjdG9yXV0sIHJvb3QpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGxldCBzb3VyY2VFdmVudDtcbiAgd2hpbGUgKHNvdXJjZUV2ZW50ID0gZXZlbnQuc291cmNlRXZlbnQpIGV2ZW50ID0gc291cmNlRXZlbnQ7XG4gIHJldHVybiBldmVudDtcbn1cbiIsICJpbXBvcnQgc291cmNlRXZlbnQgZnJvbSBcIi4vc291cmNlRXZlbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZXZlbnQsIG5vZGUpIHtcbiAgZXZlbnQgPSBzb3VyY2VFdmVudChldmVudCk7XG4gIGlmIChub2RlID09PSB1bmRlZmluZWQpIG5vZGUgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICBpZiAobm9kZSkge1xuICAgIHZhciBzdmcgPSBub2RlLm93bmVyU1ZHRWxlbWVudCB8fCBub2RlO1xuICAgIGlmIChzdmcuY3JlYXRlU1ZHUG9pbnQpIHtcbiAgICAgIHZhciBwb2ludCA9IHN2Zy5jcmVhdGVTVkdQb2ludCgpO1xuICAgICAgcG9pbnQueCA9IGV2ZW50LmNsaWVudFgsIHBvaW50LnkgPSBldmVudC5jbGllbnRZO1xuICAgICAgcG9pbnQgPSBwb2ludC5tYXRyaXhUcmFuc2Zvcm0obm9kZS5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpO1xuICAgICAgcmV0dXJuIFtwb2ludC54LCBwb2ludC55XTtcbiAgICB9XG4gICAgaWYgKG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4gW2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBub2RlLmNsaWVudExlZnQsIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIG5vZGUuY2xpZW50VG9wXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtldmVudC5wYWdlWCwgZXZlbnQucGFnZVldO1xufVxuIiwgIi8vIFRoZXNlIGFyZSB0eXBpY2FsbHkgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIG5vZXZlbnQgdG8gZW5zdXJlIHRoYXQgd2UgY2FuXG4vLyBwcmV2ZW50RGVmYXVsdCBvbiB0aGUgZXZlbnQuXG5leHBvcnQgY29uc3Qgbm9ucGFzc2l2ZSA9IHtwYXNzaXZlOiBmYWxzZX07XG5leHBvcnQgY29uc3Qgbm9ucGFzc2l2ZWNhcHR1cmUgPSB7Y2FwdHVyZTogdHJ1ZSwgcGFzc2l2ZTogZmFsc2V9O1xuXG5leHBvcnQgZnVuY3Rpb24gbm9wcm9wYWdhdGlvbihldmVudCkge1xuICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3R9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCBub2V2ZW50LCB7bm9ucGFzc2l2ZWNhcHR1cmV9IGZyb20gXCIuL25vZXZlbnQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmlldykge1xuICB2YXIgcm9vdCA9IHZpZXcuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgc2VsZWN0aW9uID0gc2VsZWN0KHZpZXcpLm9uKFwiZHJhZ3N0YXJ0LmRyYWdcIiwgbm9ldmVudCwgbm9ucGFzc2l2ZWNhcHR1cmUpO1xuICBpZiAoXCJvbnNlbGVjdHN0YXJ0XCIgaW4gcm9vdCkge1xuICAgIHNlbGVjdGlvbi5vbihcInNlbGVjdHN0YXJ0LmRyYWdcIiwgbm9ldmVudCwgbm9ucGFzc2l2ZWNhcHR1cmUpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuX19ub3NlbGVjdCA9IHJvb3Quc3R5bGUuTW96VXNlclNlbGVjdDtcbiAgICByb290LnN0eWxlLk1velVzZXJTZWxlY3QgPSBcIm5vbmVcIjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24geWVzZHJhZyh2aWV3LCBub2NsaWNrKSB7XG4gIHZhciByb290ID0gdmlldy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBzZWxlY3Rpb24gPSBzZWxlY3Qodmlldykub24oXCJkcmFnc3RhcnQuZHJhZ1wiLCBudWxsKTtcbiAgaWYgKG5vY2xpY2spIHtcbiAgICBzZWxlY3Rpb24ub24oXCJjbGljay5kcmFnXCIsIG5vZXZlbnQsIG5vbnBhc3NpdmVjYXB0dXJlKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBzZWxlY3Rpb24ub24oXCJjbGljay5kcmFnXCIsIG51bGwpOyB9LCAwKTtcbiAgfVxuICBpZiAoXCJvbnNlbGVjdHN0YXJ0XCIgaW4gcm9vdCkge1xuICAgIHNlbGVjdGlvbi5vbihcInNlbGVjdHN0YXJ0LmRyYWdcIiwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gcm9vdC5fX25vc2VsZWN0O1xuICAgIGRlbGV0ZSByb290Ll9fbm9zZWxlY3Q7XG4gIH1cbn1cbiIsICJleHBvcnQgZGVmYXVsdCB4ID0+ICgpID0+IHg7XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRHJhZ0V2ZW50KHR5cGUsIHtcbiAgc291cmNlRXZlbnQsXG4gIHN1YmplY3QsXG4gIHRhcmdldCxcbiAgaWRlbnRpZmllcixcbiAgYWN0aXZlLFxuICB4LCB5LCBkeCwgZHksXG4gIGRpc3BhdGNoXG59KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICB0eXBlOiB7dmFsdWU6IHR5cGUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgc291cmNlRXZlbnQ6IHt2YWx1ZTogc291cmNlRXZlbnQsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgc3ViamVjdDoge3ZhbHVlOiBzdWJqZWN0LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHRhcmdldDoge3ZhbHVlOiB0YXJnZXQsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgaWRlbnRpZmllcjoge3ZhbHVlOiBpZGVudGlmaWVyLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIGFjdGl2ZToge3ZhbHVlOiBhY3RpdmUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgeDoge3ZhbHVlOiB4LCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIHk6IHt2YWx1ZTogeSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBkeDoge3ZhbHVlOiBkeCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBkeToge3ZhbHVlOiBkeSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICBfOiB7dmFsdWU6IGRpc3BhdGNofVxuICB9KTtcbn1cblxuRHJhZ0V2ZW50LnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdmFsdWUgPSB0aGlzLl8ub24uYXBwbHkodGhpcy5fLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdmFsdWUgPT09IHRoaXMuXyA/IHRoaXMgOiB2YWx1ZTtcbn07XG4iLCAiaW1wb3J0IHtkaXNwYXRjaH0gZnJvbSBcImQzLWRpc3BhdGNoXCI7XG5pbXBvcnQge3NlbGVjdCwgcG9pbnRlcn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IG5vZHJhZywge3llc2RyYWd9IGZyb20gXCIuL25vZHJhZy5qc1wiO1xuaW1wb3J0IG5vZXZlbnQsIHtub25wYXNzaXZlLCBub25wYXNzaXZlY2FwdHVyZSwgbm9wcm9wYWdhdGlvbn0gZnJvbSBcIi4vbm9ldmVudC5qc1wiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgRHJhZ0V2ZW50IGZyb20gXCIuL2V2ZW50LmpzXCI7XG5cbi8vIElnbm9yZSByaWdodC1jbGljaywgc2luY2UgdGhhdCBzaG91bGQgb3BlbiB0aGUgY29udGV4dCBtZW51LlxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlcihldmVudCkge1xuICByZXR1cm4gIWV2ZW50LmN0cmxLZXkgJiYgIWV2ZW50LmJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbnRhaW5lcigpIHtcbiAgcmV0dXJuIHRoaXMucGFyZW50Tm9kZTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFN1YmplY3QoZXZlbnQsIGQpIHtcbiAgcmV0dXJuIGQgPT0gbnVsbCA/IHt4OiBldmVudC54LCB5OiBldmVudC55fSA6IGQ7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRUb3VjaGFibGUoKSB7XG4gIHJldHVybiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgKFwib250b3VjaHN0YXJ0XCIgaW4gdGhpcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgZmlsdGVyID0gZGVmYXVsdEZpbHRlcixcbiAgICAgIGNvbnRhaW5lciA9IGRlZmF1bHRDb250YWluZXIsXG4gICAgICBzdWJqZWN0ID0gZGVmYXVsdFN1YmplY3QsXG4gICAgICB0b3VjaGFibGUgPSBkZWZhdWx0VG91Y2hhYmxlLFxuICAgICAgZ2VzdHVyZXMgPSB7fSxcbiAgICAgIGxpc3RlbmVycyA9IGRpc3BhdGNoKFwic3RhcnRcIiwgXCJkcmFnXCIsIFwiZW5kXCIpLFxuICAgICAgYWN0aXZlID0gMCxcbiAgICAgIG1vdXNlZG93bngsXG4gICAgICBtb3VzZWRvd255LFxuICAgICAgbW91c2Vtb3ZpbmcsXG4gICAgICB0b3VjaGVuZGluZyxcbiAgICAgIGNsaWNrRGlzdGFuY2UyID0gMDtcblxuICBmdW5jdGlvbiBkcmFnKHNlbGVjdGlvbikge1xuICAgIHNlbGVjdGlvblxuICAgICAgICAub24oXCJtb3VzZWRvd24uZHJhZ1wiLCBtb3VzZWRvd25lZClcbiAgICAgIC5maWx0ZXIodG91Y2hhYmxlKVxuICAgICAgICAub24oXCJ0b3VjaHN0YXJ0LmRyYWdcIiwgdG91Y2hzdGFydGVkKVxuICAgICAgICAub24oXCJ0b3VjaG1vdmUuZHJhZ1wiLCB0b3VjaG1vdmVkLCBub25wYXNzaXZlKVxuICAgICAgICAub24oXCJ0b3VjaGVuZC5kcmFnIHRvdWNoY2FuY2VsLmRyYWdcIiwgdG91Y2hlbmRlZClcbiAgICAgICAgLnN0eWxlKFwidG91Y2gtYWN0aW9uXCIsIFwibm9uZVwiKVxuICAgICAgICAuc3R5bGUoXCItd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3JcIiwgXCJyZ2JhKDAsMCwwLDApXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2Vkb3duZWQoZXZlbnQsIGQpIHtcbiAgICBpZiAodG91Y2hlbmRpbmcgfHwgIWZpbHRlci5jYWxsKHRoaXMsIGV2ZW50LCBkKSkgcmV0dXJuO1xuICAgIHZhciBnZXN0dXJlID0gYmVmb3Jlc3RhcnQodGhpcywgY29udGFpbmVyLmNhbGwodGhpcywgZXZlbnQsIGQpLCBldmVudCwgZCwgXCJtb3VzZVwiKTtcbiAgICBpZiAoIWdlc3R1cmUpIHJldHVybjtcbiAgICBzZWxlY3QoZXZlbnQudmlldylcbiAgICAgIC5vbihcIm1vdXNlbW92ZS5kcmFnXCIsIG1vdXNlbW92ZWQsIG5vbnBhc3NpdmVjYXB0dXJlKVxuICAgICAgLm9uKFwibW91c2V1cC5kcmFnXCIsIG1vdXNldXBwZWQsIG5vbnBhc3NpdmVjYXB0dXJlKTtcbiAgICBub2RyYWcoZXZlbnQudmlldyk7XG4gICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgbW91c2Vtb3ZpbmcgPSBmYWxzZTtcbiAgICBtb3VzZWRvd254ID0gZXZlbnQuY2xpZW50WDtcbiAgICBtb3VzZWRvd255ID0gZXZlbnQuY2xpZW50WTtcbiAgICBnZXN0dXJlKFwic3RhcnRcIiwgZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2Vtb3ZlZChldmVudCkge1xuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGlmICghbW91c2Vtb3ZpbmcpIHtcbiAgICAgIHZhciBkeCA9IGV2ZW50LmNsaWVudFggLSBtb3VzZWRvd254LCBkeSA9IGV2ZW50LmNsaWVudFkgLSBtb3VzZWRvd255O1xuICAgICAgbW91c2Vtb3ZpbmcgPSBkeCAqIGR4ICsgZHkgKiBkeSA+IGNsaWNrRGlzdGFuY2UyO1xuICAgIH1cbiAgICBnZXN0dXJlcy5tb3VzZShcImRyYWdcIiwgZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW91c2V1cHBlZChldmVudCkge1xuICAgIHNlbGVjdChldmVudC52aWV3KS5vbihcIm1vdXNlbW92ZS5kcmFnIG1vdXNldXAuZHJhZ1wiLCBudWxsKTtcbiAgICB5ZXNkcmFnKGV2ZW50LnZpZXcsIG1vdXNlbW92aW5nKTtcbiAgICBub2V2ZW50KGV2ZW50KTtcbiAgICBnZXN0dXJlcy5tb3VzZShcImVuZFwiLCBldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaHN0YXJ0ZWQoZXZlbnQsIGQpIHtcbiAgICBpZiAoIWZpbHRlci5jYWxsKHRoaXMsIGV2ZW50LCBkKSkgcmV0dXJuO1xuICAgIHZhciB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMsXG4gICAgICAgIGMgPSBjb250YWluZXIuY2FsbCh0aGlzLCBldmVudCwgZCksXG4gICAgICAgIG4gPSB0b3VjaGVzLmxlbmd0aCwgaSwgZ2VzdHVyZTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChnZXN0dXJlID0gYmVmb3Jlc3RhcnQodGhpcywgYywgZXZlbnQsIGQsIHRvdWNoZXNbaV0uaWRlbnRpZmllciwgdG91Y2hlc1tpXSkpIHtcbiAgICAgICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgICAgIGdlc3R1cmUoXCJzdGFydFwiLCBldmVudCwgdG91Y2hlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2htb3ZlZChldmVudCkge1xuICAgIHZhciB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMsXG4gICAgICAgIG4gPSB0b3VjaGVzLmxlbmd0aCwgaSwgZ2VzdHVyZTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChnZXN0dXJlID0gZ2VzdHVyZXNbdG91Y2hlc1tpXS5pZGVudGlmaWVyXSkge1xuICAgICAgICBub2V2ZW50KGV2ZW50KTtcbiAgICAgICAgZ2VzdHVyZShcImRyYWdcIiwgZXZlbnQsIHRvdWNoZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoZW5kZWQoZXZlbnQpIHtcbiAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLFxuICAgICAgICBuID0gdG91Y2hlcy5sZW5ndGgsIGksIGdlc3R1cmU7XG5cbiAgICBpZiAodG91Y2hlbmRpbmcpIGNsZWFyVGltZW91dCh0b3VjaGVuZGluZyk7XG4gICAgdG91Y2hlbmRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0b3VjaGVuZGluZyA9IG51bGw7IH0sIDUwMCk7IC8vIEdob3N0IGNsaWNrcyBhcmUgZGVsYXllZCFcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBpZiAoZ2VzdHVyZSA9IGdlc3R1cmVzW3RvdWNoZXNbaV0uaWRlbnRpZmllcl0pIHtcbiAgICAgICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgICAgIGdlc3R1cmUoXCJlbmRcIiwgZXZlbnQsIHRvdWNoZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJlZm9yZXN0YXJ0KHRoYXQsIGNvbnRhaW5lciwgZXZlbnQsIGQsIGlkZW50aWZpZXIsIHRvdWNoKSB7XG4gICAgdmFyIGRpc3BhdGNoID0gbGlzdGVuZXJzLmNvcHkoKSxcbiAgICAgICAgcCA9IHBvaW50ZXIodG91Y2ggfHwgZXZlbnQsIGNvbnRhaW5lciksIGR4LCBkeSxcbiAgICAgICAgcztcblxuICAgIGlmICgocyA9IHN1YmplY3QuY2FsbCh0aGF0LCBuZXcgRHJhZ0V2ZW50KFwiYmVmb3Jlc3RhcnRcIiwge1xuICAgICAgICBzb3VyY2VFdmVudDogZXZlbnQsXG4gICAgICAgIHRhcmdldDogZHJhZyxcbiAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgYWN0aXZlLFxuICAgICAgICB4OiBwWzBdLFxuICAgICAgICB5OiBwWzFdLFxuICAgICAgICBkeDogMCxcbiAgICAgICAgZHk6IDAsXG4gICAgICAgIGRpc3BhdGNoXG4gICAgICB9KSwgZCkpID09IG51bGwpIHJldHVybjtcblxuICAgIGR4ID0gcy54IC0gcFswXSB8fCAwO1xuICAgIGR5ID0gcy55IC0gcFsxXSB8fCAwO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGdlc3R1cmUodHlwZSwgZXZlbnQsIHRvdWNoKSB7XG4gICAgICB2YXIgcDAgPSBwLCBuO1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzdGFydFwiOiBnZXN0dXJlc1tpZGVudGlmaWVyXSA9IGdlc3R1cmUsIG4gPSBhY3RpdmUrKzsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlbmRcIjogZGVsZXRlIGdlc3R1cmVzW2lkZW50aWZpZXJdLCAtLWFjdGl2ZTsgLy8gZmFsbHMgdGhyb3VnaFxuICAgICAgICBjYXNlIFwiZHJhZ1wiOiBwID0gcG9pbnRlcih0b3VjaCB8fCBldmVudCwgY29udGFpbmVyKSwgbiA9IGFjdGl2ZTsgYnJlYWs7XG4gICAgICB9XG4gICAgICBkaXNwYXRjaC5jYWxsKFxuICAgICAgICB0eXBlLFxuICAgICAgICB0aGF0LFxuICAgICAgICBuZXcgRHJhZ0V2ZW50KHR5cGUsIHtcbiAgICAgICAgICBzb3VyY2VFdmVudDogZXZlbnQsXG4gICAgICAgICAgc3ViamVjdDogcyxcbiAgICAgICAgICB0YXJnZXQ6IGRyYWcsXG4gICAgICAgICAgaWRlbnRpZmllcixcbiAgICAgICAgICBhY3RpdmU6IG4sXG4gICAgICAgICAgeDogcFswXSArIGR4LFxuICAgICAgICAgIHk6IHBbMV0gKyBkeSxcbiAgICAgICAgICBkeDogcFswXSAtIHAwWzBdLFxuICAgICAgICAgIGR5OiBwWzFdIC0gcDBbMV0sXG4gICAgICAgICAgZGlzcGF0Y2hcbiAgICAgICAgfSksXG4gICAgICAgIGRcbiAgICAgICk7XG4gICAgfTtcbiAgfVxuXG4gIGRyYWcuZmlsdGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZpbHRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgZHJhZykgOiBmaWx0ZXI7XG4gIH07XG5cbiAgZHJhZy5jb250YWluZXIgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY29udGFpbmVyID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudChfKSwgZHJhZykgOiBjb250YWluZXI7XG4gIH07XG5cbiAgZHJhZy5zdWJqZWN0ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN1YmplY3QgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KF8pLCBkcmFnKSA6IHN1YmplY3Q7XG4gIH07XG5cbiAgZHJhZy50b3VjaGFibGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodG91Y2hhYmxlID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCghIV8pLCBkcmFnKSA6IHRvdWNoYWJsZTtcbiAgfTtcblxuICBkcmFnLm9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlID0gbGlzdGVuZXJzLm9uLmFwcGx5KGxpc3RlbmVycywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdmFsdWUgPT09IGxpc3RlbmVycyA/IGRyYWcgOiB2YWx1ZTtcbiAgfTtcblxuICBkcmFnLmNsaWNrRGlzdGFuY2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY2xpY2tEaXN0YW5jZTIgPSAoXyA9ICtfKSAqIF8sIGRyYWcpIDogTWF0aC5zcXJ0KGNsaWNrRGlzdGFuY2UyKTtcbiAgfTtcblxuICByZXR1cm4gZHJhZztcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb25zdHJ1Y3RvciwgZmFjdG9yeSwgcHJvdG90eXBlKSB7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGZhY3RvcnkucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICBwcm90b3R5cGUuY29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChwYXJlbnQsIGRlZmluaXRpb24pIHtcbiAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XG4gIGZvciAodmFyIGtleSBpbiBkZWZpbml0aW9uKSBwcm90b3R5cGVba2V5XSA9IGRlZmluaXRpb25ba2V5XTtcbiAgcmV0dXJuIHByb3RvdHlwZTtcbn1cbiIsICJpbXBvcnQgZGVmaW5lLCB7ZXh0ZW5kfSBmcm9tIFwiLi9kZWZpbmUuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIENvbG9yKCkge31cblxuZXhwb3J0IHZhciBkYXJrZXIgPSAwLjc7XG5leHBvcnQgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxudmFyIHJlSSA9IFwiXFxcXHMqKFsrLV0/XFxcXGQrKVxcXFxzKlwiLFxuICAgIHJlTiA9IFwiXFxcXHMqKFsrLV0/KD86XFxcXGQqXFxcXC4pP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KVxcXFxzKlwiLFxuICAgIHJlUCA9IFwiXFxcXHMqKFsrLV0/KD86XFxcXGQqXFxcXC4pP1xcXFxkKyg/OltlRV1bKy1dP1xcXFxkKyk/KSVcXFxccypcIixcbiAgICByZUhleCA9IC9eIyhbMC05YS1mXXszLDh9KSQvLFxuICAgIHJlUmdiSW50ZWdlciA9IG5ldyBSZWdFeHAoYF5yZ2JcXFxcKCR7cmVJfSwke3JlSX0sJHtyZUl9XFxcXCkkYCksXG4gICAgcmVSZ2JQZXJjZW50ID0gbmV3IFJlZ0V4cChgXnJnYlxcXFwoJHtyZVB9LCR7cmVQfSwke3JlUH1cXFxcKSRgKSxcbiAgICByZVJnYmFJbnRlZ2VyID0gbmV3IFJlZ0V4cChgXnJnYmFcXFxcKCR7cmVJfSwke3JlSX0sJHtyZUl9LCR7cmVOfVxcXFwpJGApLFxuICAgIHJlUmdiYVBlcmNlbnQgPSBuZXcgUmVnRXhwKGBecmdiYVxcXFwoJHtyZVB9LCR7cmVQfSwke3JlUH0sJHtyZU59XFxcXCkkYCksXG4gICAgcmVIc2xQZXJjZW50ID0gbmV3IFJlZ0V4cChgXmhzbFxcXFwoJHtyZU59LCR7cmVQfSwke3JlUH1cXFxcKSRgKSxcbiAgICByZUhzbGFQZXJjZW50ID0gbmV3IFJlZ0V4cChgXmhzbGFcXFxcKCR7cmVOfSwke3JlUH0sJHtyZVB9LCR7cmVOfVxcXFwpJGApO1xuXG52YXIgbmFtZWQgPSB7XG4gIGFsaWNlYmx1ZTogMHhmMGY4ZmYsXG4gIGFudGlxdWV3aGl0ZTogMHhmYWViZDcsXG4gIGFxdWE6IDB4MDBmZmZmLFxuICBhcXVhbWFyaW5lOiAweDdmZmZkNCxcbiAgYXp1cmU6IDB4ZjBmZmZmLFxuICBiZWlnZTogMHhmNWY1ZGMsXG4gIGJpc3F1ZTogMHhmZmU0YzQsXG4gIGJsYWNrOiAweDAwMDAwMCxcbiAgYmxhbmNoZWRhbG1vbmQ6IDB4ZmZlYmNkLFxuICBibHVlOiAweDAwMDBmZixcbiAgYmx1ZXZpb2xldDogMHg4YTJiZTIsXG4gIGJyb3duOiAweGE1MmEyYSxcbiAgYnVybHl3b29kOiAweGRlYjg4NyxcbiAgY2FkZXRibHVlOiAweDVmOWVhMCxcbiAgY2hhcnRyZXVzZTogMHg3ZmZmMDAsXG4gIGNob2NvbGF0ZTogMHhkMjY5MWUsXG4gIGNvcmFsOiAweGZmN2Y1MCxcbiAgY29ybmZsb3dlcmJsdWU6IDB4NjQ5NWVkLFxuICBjb3Juc2lsazogMHhmZmY4ZGMsXG4gIGNyaW1zb246IDB4ZGMxNDNjLFxuICBjeWFuOiAweDAwZmZmZixcbiAgZGFya2JsdWU6IDB4MDAwMDhiLFxuICBkYXJrY3lhbjogMHgwMDhiOGIsXG4gIGRhcmtnb2xkZW5yb2Q6IDB4Yjg4NjBiLFxuICBkYXJrZ3JheTogMHhhOWE5YTksXG4gIGRhcmtncmVlbjogMHgwMDY0MDAsXG4gIGRhcmtncmV5OiAweGE5YTlhOSxcbiAgZGFya2toYWtpOiAweGJkYjc2YixcbiAgZGFya21hZ2VudGE6IDB4OGIwMDhiLFxuICBkYXJrb2xpdmVncmVlbjogMHg1NTZiMmYsXG4gIGRhcmtvcmFuZ2U6IDB4ZmY4YzAwLFxuICBkYXJrb3JjaGlkOiAweDk5MzJjYyxcbiAgZGFya3JlZDogMHg4YjAwMDAsXG4gIGRhcmtzYWxtb246IDB4ZTk5NjdhLFxuICBkYXJrc2VhZ3JlZW46IDB4OGZiYzhmLFxuICBkYXJrc2xhdGVibHVlOiAweDQ4M2Q4YixcbiAgZGFya3NsYXRlZ3JheTogMHgyZjRmNGYsXG4gIGRhcmtzbGF0ZWdyZXk6IDB4MmY0ZjRmLFxuICBkYXJrdHVycXVvaXNlOiAweDAwY2VkMSxcbiAgZGFya3Zpb2xldDogMHg5NDAwZDMsXG4gIGRlZXBwaW5rOiAweGZmMTQ5MyxcbiAgZGVlcHNreWJsdWU6IDB4MDBiZmZmLFxuICBkaW1ncmF5OiAweDY5Njk2OSxcbiAgZGltZ3JleTogMHg2OTY5NjksXG4gIGRvZGdlcmJsdWU6IDB4MWU5MGZmLFxuICBmaXJlYnJpY2s6IDB4YjIyMjIyLFxuICBmbG9yYWx3aGl0ZTogMHhmZmZhZjAsXG4gIGZvcmVzdGdyZWVuOiAweDIyOGIyMixcbiAgZnVjaHNpYTogMHhmZjAwZmYsXG4gIGdhaW5zYm9ybzogMHhkY2RjZGMsXG4gIGdob3N0d2hpdGU6IDB4ZjhmOGZmLFxuICBnb2xkOiAweGZmZDcwMCxcbiAgZ29sZGVucm9kOiAweGRhYTUyMCxcbiAgZ3JheTogMHg4MDgwODAsXG4gIGdyZWVuOiAweDAwODAwMCxcbiAgZ3JlZW55ZWxsb3c6IDB4YWRmZjJmLFxuICBncmV5OiAweDgwODA4MCxcbiAgaG9uZXlkZXc6IDB4ZjBmZmYwLFxuICBob3RwaW5rOiAweGZmNjliNCxcbiAgaW5kaWFucmVkOiAweGNkNWM1YyxcbiAgaW5kaWdvOiAweDRiMDA4MixcbiAgaXZvcnk6IDB4ZmZmZmYwLFxuICBraGFraTogMHhmMGU2OGMsXG4gIGxhdmVuZGVyOiAweGU2ZTZmYSxcbiAgbGF2ZW5kZXJibHVzaDogMHhmZmYwZjUsXG4gIGxhd25ncmVlbjogMHg3Y2ZjMDAsXG4gIGxlbW9uY2hpZmZvbjogMHhmZmZhY2QsXG4gIGxpZ2h0Ymx1ZTogMHhhZGQ4ZTYsXG4gIGxpZ2h0Y29yYWw6IDB4ZjA4MDgwLFxuICBsaWdodGN5YW46IDB4ZTBmZmZmLFxuICBsaWdodGdvbGRlbnJvZHllbGxvdzogMHhmYWZhZDIsXG4gIGxpZ2h0Z3JheTogMHhkM2QzZDMsXG4gIGxpZ2h0Z3JlZW46IDB4OTBlZTkwLFxuICBsaWdodGdyZXk6IDB4ZDNkM2QzLFxuICBsaWdodHBpbms6IDB4ZmZiNmMxLFxuICBsaWdodHNhbG1vbjogMHhmZmEwN2EsXG4gIGxpZ2h0c2VhZ3JlZW46IDB4MjBiMmFhLFxuICBsaWdodHNreWJsdWU6IDB4ODdjZWZhLFxuICBsaWdodHNsYXRlZ3JheTogMHg3Nzg4OTksXG4gIGxpZ2h0c2xhdGVncmV5OiAweDc3ODg5OSxcbiAgbGlnaHRzdGVlbGJsdWU6IDB4YjBjNGRlLFxuICBsaWdodHllbGxvdzogMHhmZmZmZTAsXG4gIGxpbWU6IDB4MDBmZjAwLFxuICBsaW1lZ3JlZW46IDB4MzJjZDMyLFxuICBsaW5lbjogMHhmYWYwZTYsXG4gIG1hZ2VudGE6IDB4ZmYwMGZmLFxuICBtYXJvb246IDB4ODAwMDAwLFxuICBtZWRpdW1hcXVhbWFyaW5lOiAweDY2Y2RhYSxcbiAgbWVkaXVtYmx1ZTogMHgwMDAwY2QsXG4gIG1lZGl1bW9yY2hpZDogMHhiYTU1ZDMsXG4gIG1lZGl1bXB1cnBsZTogMHg5MzcwZGIsXG4gIG1lZGl1bXNlYWdyZWVuOiAweDNjYjM3MSxcbiAgbWVkaXVtc2xhdGVibHVlOiAweDdiNjhlZSxcbiAgbWVkaXVtc3ByaW5nZ3JlZW46IDB4MDBmYTlhLFxuICBtZWRpdW10dXJxdW9pc2U6IDB4NDhkMWNjLFxuICBtZWRpdW12aW9sZXRyZWQ6IDB4YzcxNTg1LFxuICBtaWRuaWdodGJsdWU6IDB4MTkxOTcwLFxuICBtaW50Y3JlYW06IDB4ZjVmZmZhLFxuICBtaXN0eXJvc2U6IDB4ZmZlNGUxLFxuICBtb2NjYXNpbjogMHhmZmU0YjUsXG4gIG5hdmFqb3doaXRlOiAweGZmZGVhZCxcbiAgbmF2eTogMHgwMDAwODAsXG4gIG9sZGxhY2U6IDB4ZmRmNWU2LFxuICBvbGl2ZTogMHg4MDgwMDAsXG4gIG9saXZlZHJhYjogMHg2YjhlMjMsXG4gIG9yYW5nZTogMHhmZmE1MDAsXG4gIG9yYW5nZXJlZDogMHhmZjQ1MDAsXG4gIG9yY2hpZDogMHhkYTcwZDYsXG4gIHBhbGVnb2xkZW5yb2Q6IDB4ZWVlOGFhLFxuICBwYWxlZ3JlZW46IDB4OThmYjk4LFxuICBwYWxldHVycXVvaXNlOiAweGFmZWVlZSxcbiAgcGFsZXZpb2xldHJlZDogMHhkYjcwOTMsXG4gIHBhcGF5YXdoaXA6IDB4ZmZlZmQ1LFxuICBwZWFjaHB1ZmY6IDB4ZmZkYWI5LFxuICBwZXJ1OiAweGNkODUzZixcbiAgcGluazogMHhmZmMwY2IsXG4gIHBsdW06IDB4ZGRhMGRkLFxuICBwb3dkZXJibHVlOiAweGIwZTBlNixcbiAgcHVycGxlOiAweDgwMDA4MCxcbiAgcmViZWNjYXB1cnBsZTogMHg2NjMzOTksXG4gIHJlZDogMHhmZjAwMDAsXG4gIHJvc3licm93bjogMHhiYzhmOGYsXG4gIHJveWFsYmx1ZTogMHg0MTY5ZTEsXG4gIHNhZGRsZWJyb3duOiAweDhiNDUxMyxcbiAgc2FsbW9uOiAweGZhODA3MixcbiAgc2FuZHlicm93bjogMHhmNGE0NjAsXG4gIHNlYWdyZWVuOiAweDJlOGI1NyxcbiAgc2Vhc2hlbGw6IDB4ZmZmNWVlLFxuICBzaWVubmE6IDB4YTA1MjJkLFxuICBzaWx2ZXI6IDB4YzBjMGMwLFxuICBza3libHVlOiAweDg3Y2VlYixcbiAgc2xhdGVibHVlOiAweDZhNWFjZCxcbiAgc2xhdGVncmF5OiAweDcwODA5MCxcbiAgc2xhdGVncmV5OiAweDcwODA5MCxcbiAgc25vdzogMHhmZmZhZmEsXG4gIHNwcmluZ2dyZWVuOiAweDAwZmY3ZixcbiAgc3RlZWxibHVlOiAweDQ2ODJiNCxcbiAgdGFuOiAweGQyYjQ4YyxcbiAgdGVhbDogMHgwMDgwODAsXG4gIHRoaXN0bGU6IDB4ZDhiZmQ4LFxuICB0b21hdG86IDB4ZmY2MzQ3LFxuICB0dXJxdW9pc2U6IDB4NDBlMGQwLFxuICB2aW9sZXQ6IDB4ZWU4MmVlLFxuICB3aGVhdDogMHhmNWRlYjMsXG4gIHdoaXRlOiAweGZmZmZmZixcbiAgd2hpdGVzbW9rZTogMHhmNWY1ZjUsXG4gIHllbGxvdzogMHhmZmZmMDAsXG4gIHllbGxvd2dyZWVuOiAweDlhY2QzMlxufTtcblxuZGVmaW5lKENvbG9yLCBjb2xvciwge1xuICBjb3B5KGNoYW5uZWxzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuY29uc3RydWN0b3IsIHRoaXMsIGNoYW5uZWxzKTtcbiAgfSxcbiAgZGlzcGxheWFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucmdiKCkuZGlzcGxheWFibGUoKTtcbiAgfSxcbiAgaGV4OiBjb2xvcl9mb3JtYXRIZXgsIC8vIERlcHJlY2F0ZWQhIFVzZSBjb2xvci5mb3JtYXRIZXguXG4gIGZvcm1hdEhleDogY29sb3JfZm9ybWF0SGV4LFxuICBmb3JtYXRIZXg4OiBjb2xvcl9mb3JtYXRIZXg4LFxuICBmb3JtYXRIc2w6IGNvbG9yX2Zvcm1hdEhzbCxcbiAgZm9ybWF0UmdiOiBjb2xvcl9mb3JtYXRSZ2IsXG4gIHRvU3RyaW5nOiBjb2xvcl9mb3JtYXRSZ2Jcbn0pO1xuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRIZXgoKSB7XG4gIHJldHVybiB0aGlzLnJnYigpLmZvcm1hdEhleCgpO1xufVxuXG5mdW5jdGlvbiBjb2xvcl9mb3JtYXRIZXg4KCkge1xuICByZXR1cm4gdGhpcy5yZ2IoKS5mb3JtYXRIZXg4KCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdEhzbCgpIHtcbiAgcmV0dXJuIGhzbENvbnZlcnQodGhpcykuZm9ybWF0SHNsKCk7XG59XG5cbmZ1bmN0aW9uIGNvbG9yX2Zvcm1hdFJnYigpIHtcbiAgcmV0dXJuIHRoaXMucmdiKCkuZm9ybWF0UmdiKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICB2YXIgbSwgbDtcbiAgZm9ybWF0ID0gKGZvcm1hdCArIFwiXCIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gKG0gPSByZUhleC5leGVjKGZvcm1hdCkpID8gKGwgPSBtWzFdLmxlbmd0aCwgbSA9IHBhcnNlSW50KG1bMV0sIDE2KSwgbCA9PT0gNiA/IHJnYm4obSkgLy8gI2ZmMDAwMFxuICAgICAgOiBsID09PSAzID8gbmV3IFJnYigobSA+PiA4ICYgMHhmKSB8IChtID4+IDQgJiAweGYwKSwgKG0gPj4gNCAmIDB4ZikgfCAobSAmIDB4ZjApLCAoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpLCAxKSAvLyAjZjAwXG4gICAgICA6IGwgPT09IDggPyByZ2JhKG0gPj4gMjQgJiAweGZmLCBtID4+IDE2ICYgMHhmZiwgbSA+PiA4ICYgMHhmZiwgKG0gJiAweGZmKSAvIDB4ZmYpIC8vICNmZjAwMDAwMFxuICAgICAgOiBsID09PSA0ID8gcmdiYSgobSA+PiAxMiAmIDB4ZikgfCAobSA+PiA4ICYgMHhmMCksIChtID4+IDggJiAweGYpIHwgKG0gPj4gNCAmIDB4ZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgoKG0gJiAweGYpIDw8IDQpIHwgKG0gJiAweGYpKSAvIDB4ZmYpIC8vICNmMDAwXG4gICAgICA6IG51bGwpIC8vIGludmFsaWQgaGV4XG4gICAgICA6IChtID0gcmVSZ2JJbnRlZ2VyLmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0sIG1bMl0sIG1bM10sIDEpIC8vIHJnYigyNTUsIDAsIDApXG4gICAgICA6IChtID0gcmVSZ2JQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBuZXcgUmdiKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIDEpIC8vIHJnYigxMDAlLCAwJSwgMCUpXG4gICAgICA6IChtID0gcmVSZ2JhSW50ZWdlci5leGVjKGZvcm1hdCkpID8gcmdiYShtWzFdLCBtWzJdLCBtWzNdLCBtWzRdKSAvLyByZ2JhKDI1NSwgMCwgMCwgMSlcbiAgICAgIDogKG0gPSByZVJnYmFQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyByZ2JhKG1bMV0gKiAyNTUgLyAxMDAsIG1bMl0gKiAyNTUgLyAxMDAsIG1bM10gKiAyNTUgLyAxMDAsIG1bNF0pIC8vIHJnYigxMDAlLCAwJSwgMCUsIDEpXG4gICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2xhKG1bMV0sIG1bMl0gLyAxMDAsIG1bM10gLyAxMDAsIDEpIC8vIGhzbCgxMjAsIDUwJSwgNTAlKVxuICAgICAgOiAobSA9IHJlSHNsYVBlcmNlbnQuZXhlYyhmb3JtYXQpKSA/IGhzbGEobVsxXSwgbVsyXSAvIDEwMCwgbVszXSAvIDEwMCwgbVs0XSkgLy8gaHNsYSgxMjAsIDUwJSwgNTAlLCAxKVxuICAgICAgOiBuYW1lZC5oYXNPd25Qcm9wZXJ0eShmb3JtYXQpID8gcmdibihuYW1lZFtmb3JtYXRdKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgICAgOiBmb3JtYXQgPT09IFwidHJhbnNwYXJlbnRcIiA/IG5ldyBSZ2IoTmFOLCBOYU4sIE5hTiwgMClcbiAgICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gcmdibihuKSB7XG4gIHJldHVybiBuZXcgUmdiKG4gPj4gMTYgJiAweGZmLCBuID4+IDggJiAweGZmLCBuICYgMHhmZiwgMSk7XG59XG5cbmZ1bmN0aW9uIHJnYmEociwgZywgYiwgYSkge1xuICBpZiAoYSA8PSAwKSByID0gZyA9IGIgPSBOYU47XG4gIHJldHVybiBuZXcgUmdiKHIsIGcsIGIsIGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiQ29udmVydChvKSB7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IFJnYjtcbiAgbyA9IG8ucmdiKCk7XG4gIHJldHVybiBuZXcgUmdiKG8uciwgby5nLCBvLmIsIG8ub3BhY2l0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2IociwgZywgYiwgb3BhY2l0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IHJnYkNvbnZlcnQocikgOiBuZXcgUmdiKHIsIGcsIGIsIG9wYWNpdHkgPT0gbnVsbCA/IDEgOiBvcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJnYihyLCBnLCBiLCBvcGFjaXR5KSB7XG4gIHRoaXMuciA9ICtyO1xuICB0aGlzLmcgPSArZztcbiAgdGhpcy5iID0gK2I7XG4gIHRoaXMub3BhY2l0eSA9ICtvcGFjaXR5O1xufVxuXG5kZWZpbmUoUmdiLCByZ2IsIGV4dGVuZChDb2xvciwge1xuICBicmlnaHRlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGssIHRoaXMub3BhY2l0eSk7XG4gIH0sXG4gIGRhcmtlcihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjbGFtcCgpIHtcbiAgICByZXR1cm4gbmV3IFJnYihjbGFtcGkodGhpcy5yKSwgY2xhbXBpKHRoaXMuZyksIGNsYW1waSh0aGlzLmIpLCBjbGFtcGEodGhpcy5vcGFjaXR5KSk7XG4gIH0sXG4gIGRpc3BsYXlhYmxlKCkge1xuICAgIHJldHVybiAoLTAuNSA8PSB0aGlzLnIgJiYgdGhpcy5yIDwgMjU1LjUpXG4gICAgICAgICYmICgtMC41IDw9IHRoaXMuZyAmJiB0aGlzLmcgPCAyNTUuNSlcbiAgICAgICAgJiYgKC0wLjUgPD0gdGhpcy5iICYmIHRoaXMuYiA8IDI1NS41KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLm9wYWNpdHkgJiYgdGhpcy5vcGFjaXR5IDw9IDEpO1xuICB9LFxuICBoZXg6IHJnYl9mb3JtYXRIZXgsIC8vIERlcHJlY2F0ZWQhIFVzZSBjb2xvci5mb3JtYXRIZXguXG4gIGZvcm1hdEhleDogcmdiX2Zvcm1hdEhleCxcbiAgZm9ybWF0SGV4ODogcmdiX2Zvcm1hdEhleDgsXG4gIGZvcm1hdFJnYjogcmdiX2Zvcm1hdFJnYixcbiAgdG9TdHJpbmc6IHJnYl9mb3JtYXRSZ2Jcbn0pKTtcblxuZnVuY3Rpb24gcmdiX2Zvcm1hdEhleCgpIHtcbiAgcmV0dXJuIGAjJHtoZXgodGhpcy5yKX0ke2hleCh0aGlzLmcpfSR7aGV4KHRoaXMuYil9YDtcbn1cblxuZnVuY3Rpb24gcmdiX2Zvcm1hdEhleDgoKSB7XG4gIHJldHVybiBgIyR7aGV4KHRoaXMucil9JHtoZXgodGhpcy5nKX0ke2hleCh0aGlzLmIpfSR7aGV4KChpc05hTih0aGlzLm9wYWNpdHkpID8gMSA6IHRoaXMub3BhY2l0eSkgKiAyNTUpfWA7XG59XG5cbmZ1bmN0aW9uIHJnYl9mb3JtYXRSZ2IoKSB7XG4gIGNvbnN0IGEgPSBjbGFtcGEodGhpcy5vcGFjaXR5KTtcbiAgcmV0dXJuIGAke2EgPT09IDEgPyBcInJnYihcIiA6IFwicmdiYShcIn0ke2NsYW1waSh0aGlzLnIpfSwgJHtjbGFtcGkodGhpcy5nKX0sICR7Y2xhbXBpKHRoaXMuYil9JHthID09PSAxID8gXCIpXCIgOiBgLCAke2F9KWB9YDtcbn1cblxuZnVuY3Rpb24gY2xhbXBhKG9wYWNpdHkpIHtcbiAgcmV0dXJuIGlzTmFOKG9wYWNpdHkpID8gMSA6IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIG9wYWNpdHkpKTtcbn1cblxuZnVuY3Rpb24gY2xhbXBpKHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQodmFsdWUpIHx8IDApKTtcbn1cblxuZnVuY3Rpb24gaGV4KHZhbHVlKSB7XG4gIHZhbHVlID0gY2xhbXBpKHZhbHVlKTtcbiAgcmV0dXJuICh2YWx1ZSA8IDE2ID8gXCIwXCIgOiBcIlwiKSArIHZhbHVlLnRvU3RyaW5nKDE2KTtcbn1cblxuZnVuY3Rpb24gaHNsYShoLCBzLCBsLCBhKSB7XG4gIGlmIChhIDw9IDApIGggPSBzID0gbCA9IE5hTjtcbiAgZWxzZSBpZiAobCA8PSAwIHx8IGwgPj0gMSkgaCA9IHMgPSBOYU47XG4gIGVsc2UgaWYgKHMgPD0gMCkgaCA9IE5hTjtcbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoc2xDb252ZXJ0KG8pIHtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBuZXcgSHNsKG8uaCwgby5zLCBvLmwsIG8ub3BhY2l0eSk7XG4gIGlmICghKG8gaW5zdGFuY2VvZiBDb2xvcikpIG8gPSBjb2xvcihvKTtcbiAgaWYgKCFvKSByZXR1cm4gbmV3IEhzbDtcbiAgaWYgKG8gaW5zdGFuY2VvZiBIc2wpIHJldHVybiBvO1xuICBvID0gby5yZ2IoKTtcbiAgdmFyIHIgPSBvLnIgLyAyNTUsXG4gICAgICBnID0gby5nIC8gMjU1LFxuICAgICAgYiA9IG8uYiAvIDI1NSxcbiAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICBoID0gTmFOLFxuICAgICAgcyA9IG1heCAtIG1pbixcbiAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gIGlmIChzKSB7XG4gICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyBzICsgKGcgPCBiKSAqIDY7XG4gICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHMgKyAyO1xuICAgIGVsc2UgaCA9IChyIC0gZykgLyBzICsgNDtcbiAgICBzIC89IGwgPCAwLjUgPyBtYXggKyBtaW4gOiAyIC0gbWF4IC0gbWluO1xuICAgIGggKj0gNjA7XG4gIH0gZWxzZSB7XG4gICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gIH1cbiAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCwgby5vcGFjaXR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhzbChoLCBzLCBsLCBvcGFjaXR5KSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gaHNsQ29udmVydChoKSA6IG5ldyBIc2woaCwgcywgbCwgb3BhY2l0eSA9PSBudWxsID8gMSA6IG9wYWNpdHkpO1xufVxuXG5mdW5jdGlvbiBIc2woaCwgcywgbCwgb3BhY2l0eSkge1xuICB0aGlzLmggPSAraDtcbiAgdGhpcy5zID0gK3M7XG4gIHRoaXMubCA9ICtsO1xuICB0aGlzLm9wYWNpdHkgPSArb3BhY2l0eTtcbn1cblxuZGVmaW5lKEhzbCwgaHNsLCBleHRlbmQoQ29sb3IsIHtcbiAgYnJpZ2h0ZXIoaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgZGFya2VyKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogaywgdGhpcy5vcGFjaXR5KTtcbiAgfSxcbiAgcmdiKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCArIChsIDwgMC41ID8gbCA6IDEgLSBsKSAqIHMsXG4gICAgICAgIG0xID0gMiAqIGwgLSBtMjtcbiAgICByZXR1cm4gbmV3IFJnYihcbiAgICAgIGhzbDJyZ2IoaCA+PSAyNDAgPyBoIC0gMjQwIDogaCArIDEyMCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCwgbTEsIG0yKSxcbiAgICAgIGhzbDJyZ2IoaCA8IDEyMCA/IGggKyAyNDAgOiBoIC0gMTIwLCBtMSwgbTIpLFxuICAgICAgdGhpcy5vcGFjaXR5XG4gICAgKTtcbiAgfSxcbiAgY2xhbXAoKSB7XG4gICAgcmV0dXJuIG5ldyBIc2woY2xhbXBoKHRoaXMuaCksIGNsYW1wdCh0aGlzLnMpLCBjbGFtcHQodGhpcy5sKSwgY2xhbXBhKHRoaXMub3BhY2l0eSkpO1xuICB9LFxuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5zICYmIHRoaXMucyA8PSAxIHx8IGlzTmFOKHRoaXMucykpXG4gICAgICAgICYmICgwIDw9IHRoaXMubCAmJiB0aGlzLmwgPD0gMSlcbiAgICAgICAgJiYgKDAgPD0gdGhpcy5vcGFjaXR5ICYmIHRoaXMub3BhY2l0eSA8PSAxKTtcbiAgfSxcbiAgZm9ybWF0SHNsKCkge1xuICAgIGNvbnN0IGEgPSBjbGFtcGEodGhpcy5vcGFjaXR5KTtcbiAgICByZXR1cm4gYCR7YSA9PT0gMSA/IFwiaHNsKFwiIDogXCJoc2xhKFwifSR7Y2xhbXBoKHRoaXMuaCl9LCAke2NsYW1wdCh0aGlzLnMpICogMTAwfSUsICR7Y2xhbXB0KHRoaXMubCkgKiAxMDB9JSR7YSA9PT0gMSA/IFwiKVwiIDogYCwgJHthfSlgfWA7XG4gIH1cbn0pKTtcblxuZnVuY3Rpb24gY2xhbXBoKHZhbHVlKSB7XG4gIHZhbHVlID0gKHZhbHVlIHx8IDApICUgMzYwO1xuICByZXR1cm4gdmFsdWUgPCAwID8gdmFsdWUgKyAzNjAgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xhbXB0KHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB2YWx1ZSB8fCAwKSk7XG59XG5cbi8qIEZyb20gRnZEIDEzLjM3LCBDU1MgQ29sb3IgTW9kdWxlIExldmVsIDMgKi9cbmZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gIHJldHVybiAoaCA8IDYwID8gbTEgKyAobTIgLSBtMSkgKiBoIC8gNjBcbiAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICA6IG0xKSAqIDI1NTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gYmFzaXModDEsIHYwLCB2MSwgdjIsIHYzKSB7XG4gIHZhciB0MiA9IHQxICogdDEsIHQzID0gdDIgKiB0MTtcbiAgcmV0dXJuICgoMSAtIDMgKiB0MSArIDMgKiB0MiAtIHQzKSAqIHYwXG4gICAgICArICg0IC0gNiAqIHQyICsgMyAqIHQzKSAqIHYxXG4gICAgICArICgxICsgMyAqIHQxICsgMyAqIHQyIC0gMyAqIHQzKSAqIHYyXG4gICAgICArIHQzICogdjMpIC8gNjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBuID0gdmFsdWVzLmxlbmd0aCAtIDE7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSB0IDw9IDAgPyAodCA9IDApIDogdCA+PSAxID8gKHQgPSAxLCBuIC0gMSkgOiBNYXRoLmZsb29yKHQgKiBuKSxcbiAgICAgICAgdjEgPSB2YWx1ZXNbaV0sXG4gICAgICAgIHYyID0gdmFsdWVzW2kgKyAxXSxcbiAgICAgICAgdjAgPSBpID4gMCA/IHZhbHVlc1tpIC0gMV0gOiAyICogdjEgLSB2MixcbiAgICAgICAgdjMgPSBpIDwgbiAtIDEgPyB2YWx1ZXNbaSArIDJdIDogMiAqIHYyIC0gdjE7XG4gICAgcmV0dXJuIGJhc2lzKCh0IC0gaSAvIG4pICogbiwgdjAsIHYxLCB2MiwgdjMpO1xuICB9O1xufVxuIiwgImltcG9ydCB7YmFzaXN9IGZyb20gXCIuL2Jhc2lzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgbiA9IHZhbHVlcy5sZW5ndGg7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIGkgPSBNYXRoLmZsb29yKCgodCAlPSAxKSA8IDAgPyArK3QgOiB0KSAqIG4pLFxuICAgICAgICB2MCA9IHZhbHVlc1soaSArIG4gLSAxKSAlIG5dLFxuICAgICAgICB2MSA9IHZhbHVlc1tpICUgbl0sXG4gICAgICAgIHYyID0gdmFsdWVzWyhpICsgMSkgJSBuXSxcbiAgICAgICAgdjMgPSB2YWx1ZXNbKGkgKyAyKSAlIG5dO1xuICAgIHJldHVybiBiYXNpcygodCAtIGkgLyBuKSAqIG4sIHYwLCB2MSwgdjIsIHYzKTtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCB4ID0+ICgpID0+IHg7XG4iLCAiaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5cbmZ1bmN0aW9uIGxpbmVhcihhLCBkKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgcmV0dXJuIGEgKyB0ICogZDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXhwb25lbnRpYWwoYSwgYiwgeSkge1xuICByZXR1cm4gYSA9IE1hdGgucG93KGEsIHkpLCBiID0gTWF0aC5wb3coYiwgeSkgLSBhLCB5ID0gMSAvIHksIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gTWF0aC5wb3coYSArIHQgKiBiLCB5KTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh1ZShhLCBiKSB7XG4gIHZhciBkID0gYiAtIGE7XG4gIHJldHVybiBkID8gbGluZWFyKGEsIGQgPiAxODAgfHwgZCA8IC0xODAgPyBkIC0gMzYwICogTWF0aC5yb3VuZChkIC8gMzYwKSA6IGQpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnYW1tYSh5KSB7XG4gIHJldHVybiAoeSA9ICt5KSA9PT0gMSA/IG5vZ2FtbWEgOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIgLSBhID8gZXhwb25lbnRpYWwoYSwgYiwgeSkgOiBjb25zdGFudChpc05hTihhKSA/IGIgOiBhKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm9nYW1tYShhLCBiKSB7XG4gIHZhciBkID0gYiAtIGE7XG4gIHJldHVybiBkID8gbGluZWFyKGEsIGQpIDogY29uc3RhbnQoaXNOYU4oYSkgPyBiIDogYSk7XG59XG4iLCAiaW1wb3J0IHtyZ2IgYXMgY29sb3JSZ2J9IGZyb20gXCJkMy1jb2xvclwiO1xuaW1wb3J0IGJhc2lzIGZyb20gXCIuL2Jhc2lzLmpzXCI7XG5pbXBvcnQgYmFzaXNDbG9zZWQgZnJvbSBcIi4vYmFzaXNDbG9zZWQuanNcIjtcbmltcG9ydCBub2dhbW1hLCB7Z2FtbWF9IGZyb20gXCIuL2NvbG9yLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiByZ2JHYW1tYSh5KSB7XG4gIHZhciBjb2xvciA9IGdhbW1hKHkpO1xuXG4gIGZ1bmN0aW9uIHJnYihzdGFydCwgZW5kKSB7XG4gICAgdmFyIHIgPSBjb2xvcigoc3RhcnQgPSBjb2xvclJnYihzdGFydCkpLnIsIChlbmQgPSBjb2xvclJnYihlbmQpKS5yKSxcbiAgICAgICAgZyA9IGNvbG9yKHN0YXJ0LmcsIGVuZC5nKSxcbiAgICAgICAgYiA9IGNvbG9yKHN0YXJ0LmIsIGVuZC5iKSxcbiAgICAgICAgb3BhY2l0eSA9IG5vZ2FtbWEoc3RhcnQub3BhY2l0eSwgZW5kLm9wYWNpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBzdGFydC5yID0gcih0KTtcbiAgICAgIHN0YXJ0LmcgPSBnKHQpO1xuICAgICAgc3RhcnQuYiA9IGIodCk7XG4gICAgICBzdGFydC5vcGFjaXR5ID0gb3BhY2l0eSh0KTtcbiAgICAgIHJldHVybiBzdGFydCArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIHJnYi5nYW1tYSA9IHJnYkdhbW1hO1xuXG4gIHJldHVybiByZ2I7XG59KSgxKTtcblxuZnVuY3Rpb24gcmdiU3BsaW5lKHNwbGluZSkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sb3JzKSB7XG4gICAgdmFyIG4gPSBjb2xvcnMubGVuZ3RoLFxuICAgICAgICByID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBnID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBiID0gbmV3IEFycmF5KG4pLFxuICAgICAgICBpLCBjb2xvcjtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBjb2xvciA9IGNvbG9yUmdiKGNvbG9yc1tpXSk7XG4gICAgICByW2ldID0gY29sb3IuciB8fCAwO1xuICAgICAgZ1tpXSA9IGNvbG9yLmcgfHwgMDtcbiAgICAgIGJbaV0gPSBjb2xvci5iIHx8IDA7XG4gICAgfVxuICAgIHIgPSBzcGxpbmUocik7XG4gICAgZyA9IHNwbGluZShnKTtcbiAgICBiID0gc3BsaW5lKGIpO1xuICAgIGNvbG9yLm9wYWNpdHkgPSAxO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBjb2xvci5yID0gcih0KTtcbiAgICAgIGNvbG9yLmcgPSBnKHQpO1xuICAgICAgY29sb3IuYiA9IGIodCk7XG4gICAgICByZXR1cm4gY29sb3IgKyBcIlwiO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB2YXIgcmdiQmFzaXMgPSByZ2JTcGxpbmUoYmFzaXMpO1xuZXhwb3J0IHZhciByZ2JCYXNpc0Nsb3NlZCA9IHJnYlNwbGluZShiYXNpc0Nsb3NlZCk7XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA9ICthLCBiID0gK2IsIGZ1bmN0aW9uKHQpIHtcbiAgICByZXR1cm4gYSAqICgxIC0gdCkgKyBiICogdDtcbiAgfTtcbn1cbiIsICJpbXBvcnQgbnVtYmVyIGZyb20gXCIuL251bWJlci5qc1wiO1xuXG52YXIgcmVBID0gL1stK10/KD86XFxkK1xcLj9cXGQqfFxcLj9cXGQrKSg/OltlRV1bLStdP1xcZCspPy9nLFxuICAgIHJlQiA9IG5ldyBSZWdFeHAocmVBLnNvdXJjZSwgXCJnXCIpO1xuXG5mdW5jdGlvbiB6ZXJvKGIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBiO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvbmUoYikge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHJldHVybiBiKHQpICsgXCJcIjtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYSwgYikge1xuICB2YXIgYmkgPSByZUEubGFzdEluZGV4ID0gcmVCLmxhc3RJbmRleCA9IDAsIC8vIHNjYW4gaW5kZXggZm9yIG5leHQgbnVtYmVyIGluIGJcbiAgICAgIGFtLCAvLyBjdXJyZW50IG1hdGNoIGluIGFcbiAgICAgIGJtLCAvLyBjdXJyZW50IG1hdGNoIGluIGJcbiAgICAgIGJzLCAvLyBzdHJpbmcgcHJlY2VkaW5nIGN1cnJlbnQgbnVtYmVyIGluIGIsIGlmIGFueVxuICAgICAgaSA9IC0xLCAvLyBpbmRleCBpbiBzXG4gICAgICBzID0gW10sIC8vIHN0cmluZyBjb25zdGFudHMgYW5kIHBsYWNlaG9sZGVyc1xuICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuXG4gIC8vIENvZXJjZSBpbnB1dHMgdG8gc3RyaW5ncy5cbiAgYSA9IGEgKyBcIlwiLCBiID0gYiArIFwiXCI7XG5cbiAgLy8gSW50ZXJwb2xhdGUgcGFpcnMgb2YgbnVtYmVycyBpbiBhICYgYi5cbiAgd2hpbGUgKChhbSA9IHJlQS5leGVjKGEpKVxuICAgICAgJiYgKGJtID0gcmVCLmV4ZWMoYikpKSB7XG4gICAgaWYgKChicyA9IGJtLmluZGV4KSA+IGJpKSB7IC8vIGEgc3RyaW5nIHByZWNlZGVzIHRoZSBuZXh0IG51bWJlciBpbiBiXG4gICAgICBicyA9IGIuc2xpY2UoYmksIGJzKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICB9XG4gICAgaWYgKChhbSA9IGFtWzBdKSA9PT0gKGJtID0gYm1bMF0pKSB7IC8vIG51bWJlcnMgaW4gYSAmIGIgbWF0Y2hcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBibTtcbiAgICB9IGVsc2UgeyAvLyBpbnRlcnBvbGF0ZSBub24tbWF0Y2hpbmcgbnVtYmVyc1xuICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgIHEucHVzaCh7aTogaSwgeDogbnVtYmVyKGFtLCBibSl9KTtcbiAgICB9XG4gICAgYmkgPSByZUIubGFzdEluZGV4O1xuICB9XG5cbiAgLy8gQWRkIHJlbWFpbnMgb2YgYi5cbiAgaWYgKGJpIDwgYi5sZW5ndGgpIHtcbiAgICBicyA9IGIuc2xpY2UoYmkpO1xuICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgIGVsc2Ugc1srK2ldID0gYnM7XG4gIH1cblxuICAvLyBTcGVjaWFsIG9wdGltaXphdGlvbiBmb3Igb25seSBhIHNpbmdsZSBtYXRjaC5cbiAgLy8gT3RoZXJ3aXNlLCBpbnRlcnBvbGF0ZSBlYWNoIG9mIHRoZSBudW1iZXJzIGFuZCByZWpvaW4gdGhlIHN0cmluZy5cbiAgcmV0dXJuIHMubGVuZ3RoIDwgMiA/IChxWzBdXG4gICAgICA/IG9uZShxWzBdLngpXG4gICAgICA6IHplcm8oYikpXG4gICAgICA6IChiID0gcS5sZW5ndGgsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbzsgaSA8IGI7ICsraSkgc1sobyA9IHFbaV0pLmldID0gby54KHQpO1xuICAgICAgICAgIHJldHVybiBzLmpvaW4oXCJcIik7XG4gICAgICAgIH0pO1xufVxuIiwgInZhciBkZWdyZWVzID0gMTgwIC8gTWF0aC5QSTtcblxuZXhwb3J0IHZhciBpZGVudGl0eSA9IHtcbiAgdHJhbnNsYXRlWDogMCxcbiAgdHJhbnNsYXRlWTogMCxcbiAgcm90YXRlOiAwLFxuICBza2V3WDogMCxcbiAgc2NhbGVYOiAxLFxuICBzY2FsZVk6IDFcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFyIHNjYWxlWCwgc2NhbGVZLCBza2V3WDtcbiAgaWYgKHNjYWxlWCA9IE1hdGguc3FydChhICogYSArIGIgKiBiKSkgYSAvPSBzY2FsZVgsIGIgLz0gc2NhbGVYO1xuICBpZiAoc2tld1ggPSBhICogYyArIGIgKiBkKSBjIC09IGEgKiBza2V3WCwgZCAtPSBiICogc2tld1g7XG4gIGlmIChzY2FsZVkgPSBNYXRoLnNxcnQoYyAqIGMgKyBkICogZCkpIGMgLz0gc2NhbGVZLCBkIC89IHNjYWxlWSwgc2tld1ggLz0gc2NhbGVZO1xuICBpZiAoYSAqIGQgPCBiICogYykgYSA9IC1hLCBiID0gLWIsIHNrZXdYID0gLXNrZXdYLCBzY2FsZVggPSAtc2NhbGVYO1xuICByZXR1cm4ge1xuICAgIHRyYW5zbGF0ZVg6IGUsXG4gICAgdHJhbnNsYXRlWTogZixcbiAgICByb3RhdGU6IE1hdGguYXRhbjIoYiwgYSkgKiBkZWdyZWVzLFxuICAgIHNrZXdYOiBNYXRoLmF0YW4oc2tld1gpICogZGVncmVlcyxcbiAgICBzY2FsZVg6IHNjYWxlWCxcbiAgICBzY2FsZVk6IHNjYWxlWVxuICB9O1xufVxuIiwgImltcG9ydCBkZWNvbXBvc2UsIHtpZGVudGl0eX0gZnJvbSBcIi4vZGVjb21wb3NlLmpzXCI7XG5cbnZhciBzdmdOb2RlO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ3NzKHZhbHVlKSB7XG4gIGNvbnN0IG0gPSBuZXcgKHR5cGVvZiBET01NYXRyaXggPT09IFwiZnVuY3Rpb25cIiA/IERPTU1hdHJpeCA6IFdlYktpdENTU01hdHJpeCkodmFsdWUgKyBcIlwiKTtcbiAgcmV0dXJuIG0uaXNJZGVudGl0eSA/IGlkZW50aXR5IDogZGVjb21wb3NlKG0uYSwgbS5iLCBtLmMsIG0uZCwgbS5lLCBtLmYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTdmcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBpZGVudGl0eTtcbiAgaWYgKCFzdmdOb2RlKSBzdmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJnXCIpO1xuICBzdmdOb2RlLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCB2YWx1ZSk7XG4gIGlmICghKHZhbHVlID0gc3ZnTm9kZS50cmFuc2Zvcm0uYmFzZVZhbC5jb25zb2xpZGF0ZSgpKSkgcmV0dXJuIGlkZW50aXR5O1xuICB2YWx1ZSA9IHZhbHVlLm1hdHJpeDtcbiAgcmV0dXJuIGRlY29tcG9zZSh2YWx1ZS5hLCB2YWx1ZS5iLCB2YWx1ZS5jLCB2YWx1ZS5kLCB2YWx1ZS5lLCB2YWx1ZS5mKTtcbn1cbiIsICJpbXBvcnQgbnVtYmVyIGZyb20gXCIuLi9udW1iZXIuanNcIjtcbmltcG9ydCB7cGFyc2VDc3MsIHBhcnNlU3ZnfSBmcm9tIFwiLi9wYXJzZS5qc1wiO1xuXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZVRyYW5zZm9ybShwYXJzZSwgcHhDb21tYSwgcHhQYXJlbiwgZGVnUGFyZW4pIHtcblxuICBmdW5jdGlvbiBwb3Aocykge1xuICAgIHJldHVybiBzLmxlbmd0aCA/IHMucG9wKCkgKyBcIiBcIiA6IFwiXCI7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2xhdGUoeGEsIHlhLCB4YiwgeWIsIHMsIHEpIHtcbiAgICBpZiAoeGEgIT09IHhiIHx8IHlhICE9PSB5Yikge1xuICAgICAgdmFyIGkgPSBzLnB1c2goXCJ0cmFuc2xhdGUoXCIsIG51bGwsIHB4Q29tbWEsIG51bGwsIHB4UGFyZW4pO1xuICAgICAgcS5wdXNoKHtpOiBpIC0gNCwgeDogbnVtYmVyKHhhLCB4Yil9LCB7aTogaSAtIDIsIHg6IG51bWJlcih5YSwgeWIpfSk7XG4gICAgfSBlbHNlIGlmICh4YiB8fCB5Yikge1xuICAgICAgcy5wdXNoKFwidHJhbnNsYXRlKFwiICsgeGIgKyBweENvbW1hICsgeWIgKyBweFBhcmVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByb3RhdGUoYSwgYiwgcywgcSkge1xuICAgIGlmIChhICE9PSBiKSB7XG4gICAgICBpZiAoYSAtIGIgPiAxODApIGIgKz0gMzYwOyBlbHNlIGlmIChiIC0gYSA+IDE4MCkgYSArPSAzNjA7IC8vIHNob3J0ZXN0IHBhdGhcbiAgICAgIHEucHVzaCh7aTogcy5wdXNoKHBvcChzKSArIFwicm90YXRlKFwiLCBudWxsLCBkZWdQYXJlbikgLSAyLCB4OiBudW1iZXIoYSwgYil9KTtcbiAgICB9IGVsc2UgaWYgKGIpIHtcbiAgICAgIHMucHVzaChwb3AocykgKyBcInJvdGF0ZShcIiArIGIgKyBkZWdQYXJlbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2tld1goYSwgYiwgcywgcSkge1xuICAgIGlmIChhICE9PSBiKSB7XG4gICAgICBxLnB1c2goe2k6IHMucHVzaChwb3AocykgKyBcInNrZXdYKFwiLCBudWxsLCBkZWdQYXJlbikgLSAyLCB4OiBudW1iZXIoYSwgYil9KTtcbiAgICB9IGVsc2UgaWYgKGIpIHtcbiAgICAgIHMucHVzaChwb3AocykgKyBcInNrZXdYKFwiICsgYiArIGRlZ1BhcmVuKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzY2FsZSh4YSwgeWEsIHhiLCB5YiwgcywgcSkge1xuICAgIGlmICh4YSAhPT0geGIgfHwgeWEgIT09IHliKSB7XG4gICAgICB2YXIgaSA9IHMucHVzaChwb3AocykgKyBcInNjYWxlKFwiLCBudWxsLCBcIixcIiwgbnVsbCwgXCIpXCIpO1xuICAgICAgcS5wdXNoKHtpOiBpIC0gNCwgeDogbnVtYmVyKHhhLCB4Yil9LCB7aTogaSAtIDIsIHg6IG51bWJlcih5YSwgeWIpfSk7XG4gICAgfSBlbHNlIGlmICh4YiAhPT0gMSB8fCB5YiAhPT0gMSkge1xuICAgICAgcy5wdXNoKHBvcChzKSArIFwic2NhbGUoXCIgKyB4YiArIFwiLFwiICsgeWIgKyBcIilcIik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICB2YXIgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuICAgIGEgPSBwYXJzZShhKSwgYiA9IHBhcnNlKGIpO1xuICAgIHRyYW5zbGF0ZShhLnRyYW5zbGF0ZVgsIGEudHJhbnNsYXRlWSwgYi50cmFuc2xhdGVYLCBiLnRyYW5zbGF0ZVksIHMsIHEpO1xuICAgIHJvdGF0ZShhLnJvdGF0ZSwgYi5yb3RhdGUsIHMsIHEpO1xuICAgIHNrZXdYKGEuc2tld1gsIGIuc2tld1gsIHMsIHEpO1xuICAgIHNjYWxlKGEuc2NhbGVYLCBhLnNjYWxlWSwgYi5zY2FsZVgsIGIuc2NhbGVZLCBzLCBxKTtcbiAgICBhID0gYiA9IG51bGw7IC8vIGdjXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHZhciBpID0gLTEsIG4gPSBxLmxlbmd0aCwgbztcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgIH07XG4gIH07XG59XG5cbmV4cG9ydCB2YXIgaW50ZXJwb2xhdGVUcmFuc2Zvcm1Dc3MgPSBpbnRlcnBvbGF0ZVRyYW5zZm9ybShwYXJzZUNzcywgXCJweCwgXCIsIFwicHgpXCIsIFwiZGVnKVwiKTtcbmV4cG9ydCB2YXIgaW50ZXJwb2xhdGVUcmFuc2Zvcm1TdmcgPSBpbnRlcnBvbGF0ZVRyYW5zZm9ybShwYXJzZVN2ZywgXCIsIFwiLCBcIilcIiwgXCIpXCIpO1xuIiwgInZhciBlcHNpbG9uMiA9IDFlLTEyO1xuXG5mdW5jdGlvbiBjb3NoKHgpIHtcbiAgcmV0dXJuICgoeCA9IE1hdGguZXhwKHgpKSArIDEgLyB4KSAvIDI7XG59XG5cbmZ1bmN0aW9uIHNpbmgoeCkge1xuICByZXR1cm4gKCh4ID0gTWF0aC5leHAoeCkpIC0gMSAvIHgpIC8gMjtcbn1cblxuZnVuY3Rpb24gdGFuaCh4KSB7XG4gIHJldHVybiAoKHggPSBNYXRoLmV4cCgyICogeCkpIC0gMSkgLyAoeCArIDEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gem9vbVJobyhyaG8sIHJobzIsIHJobzQpIHtcblxuICAvLyBwMCA9IFt1eDAsIHV5MCwgdzBdXG4gIC8vIHAxID0gW3V4MSwgdXkxLCB3MV1cbiAgZnVuY3Rpb24gem9vbShwMCwgcDEpIHtcbiAgICB2YXIgdXgwID0gcDBbMF0sIHV5MCA9IHAwWzFdLCB3MCA9IHAwWzJdLFxuICAgICAgICB1eDEgPSBwMVswXSwgdXkxID0gcDFbMV0sIHcxID0gcDFbMl0sXG4gICAgICAgIGR4ID0gdXgxIC0gdXgwLFxuICAgICAgICBkeSA9IHV5MSAtIHV5MCxcbiAgICAgICAgZDIgPSBkeCAqIGR4ICsgZHkgKiBkeSxcbiAgICAgICAgaSxcbiAgICAgICAgUztcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgdTAgXHUyMjQ1IHUxLlxuICAgIGlmIChkMiA8IGVwc2lsb24yKSB7XG4gICAgICBTID0gTWF0aC5sb2codzEgLyB3MCkgLyByaG87XG4gICAgICBpID0gZnVuY3Rpb24odCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHV4MCArIHQgKiBkeCxcbiAgICAgICAgICB1eTAgKyB0ICogZHksXG4gICAgICAgICAgdzAgKiBNYXRoLmV4cChyaG8gKiB0ICogUylcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBHZW5lcmFsIGNhc2UuXG4gICAgZWxzZSB7XG4gICAgICB2YXIgZDEgPSBNYXRoLnNxcnQoZDIpLFxuICAgICAgICAgIGIwID0gKHcxICogdzEgLSB3MCAqIHcwICsgcmhvNCAqIGQyKSAvICgyICogdzAgKiByaG8yICogZDEpLFxuICAgICAgICAgIGIxID0gKHcxICogdzEgLSB3MCAqIHcwIC0gcmhvNCAqIGQyKSAvICgyICogdzEgKiByaG8yICogZDEpLFxuICAgICAgICAgIHIwID0gTWF0aC5sb2coTWF0aC5zcXJ0KGIwICogYjAgKyAxKSAtIGIwKSxcbiAgICAgICAgICByMSA9IE1hdGgubG9nKE1hdGguc3FydChiMSAqIGIxICsgMSkgLSBiMSk7XG4gICAgICBTID0gKHIxIC0gcjApIC8gcmhvO1xuICAgICAgaSA9IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgdmFyIHMgPSB0ICogUyxcbiAgICAgICAgICAgIGNvc2hyMCA9IGNvc2gocjApLFxuICAgICAgICAgICAgdSA9IHcwIC8gKHJobzIgKiBkMSkgKiAoY29zaHIwICogdGFuaChyaG8gKiBzICsgcjApIC0gc2luaChyMCkpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHV4MCArIHUgKiBkeCxcbiAgICAgICAgICB1eTAgKyB1ICogZHksXG4gICAgICAgICAgdzAgKiBjb3NocjAgLyBjb3NoKHJobyAqIHMgKyByMClcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpLmR1cmF0aW9uID0gUyAqIDEwMDAgKiByaG8gLyBNYXRoLlNRUlQyO1xuXG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICB6b29tLnJobyA9IGZ1bmN0aW9uKF8pIHtcbiAgICB2YXIgXzEgPSBNYXRoLm1heCgxZS0zLCArXyksIF8yID0gXzEgKiBfMSwgXzQgPSBfMiAqIF8yO1xuICAgIHJldHVybiB6b29tUmhvKF8xLCBfMiwgXzQpO1xuICB9O1xuXG4gIHJldHVybiB6b29tO1xufSkoTWF0aC5TUVJUMiwgMiwgNCk7XG4iLCAidmFyIGZyYW1lID0gMCwgLy8gaXMgYW4gYW5pbWF0aW9uIGZyYW1lIHBlbmRpbmc/XG4gICAgdGltZW91dCA9IDAsIC8vIGlzIGEgdGltZW91dCBwZW5kaW5nP1xuICAgIGludGVydmFsID0gMCwgLy8gYXJlIGFueSB0aW1lcnMgYWN0aXZlP1xuICAgIHBva2VEZWxheSA9IDEwMDAsIC8vIGhvdyBmcmVxdWVudGx5IHdlIGNoZWNrIGZvciBjbG9jayBza2V3XG4gICAgdGFza0hlYWQsXG4gICAgdGFza1RhaWwsXG4gICAgY2xvY2tMYXN0ID0gMCxcbiAgICBjbG9ja05vdyA9IDAsXG4gICAgY2xvY2tTa2V3ID0gMCxcbiAgICBjbG9jayA9IHR5cGVvZiBwZXJmb3JtYW5jZSA9PT0gXCJvYmplY3RcIiAmJiBwZXJmb3JtYW5jZS5ub3cgPyBwZXJmb3JtYW5jZSA6IERhdGUsXG4gICAgc2V0RnJhbWUgPSB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiICYmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KSA6IGZ1bmN0aW9uKGYpIHsgc2V0VGltZW91dChmLCAxNyk7IH07XG5cbmV4cG9ydCBmdW5jdGlvbiBub3coKSB7XG4gIHJldHVybiBjbG9ja05vdyB8fCAoc2V0RnJhbWUoY2xlYXJOb3cpLCBjbG9ja05vdyA9IGNsb2NrLm5vdygpICsgY2xvY2tTa2V3KTtcbn1cblxuZnVuY3Rpb24gY2xlYXJOb3coKSB7XG4gIGNsb2NrTm93ID0gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRpbWVyKCkge1xuICB0aGlzLl9jYWxsID1cbiAgdGhpcy5fdGltZSA9XG4gIHRoaXMuX25leHQgPSBudWxsO1xufVxuXG5UaW1lci5wcm90b3R5cGUgPSB0aW1lci5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBUaW1lcixcbiAgcmVzdGFydDogZnVuY3Rpb24oY2FsbGJhY2ssIGRlbGF5LCB0aW1lKSB7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb25cIik7XG4gICAgdGltZSA9ICh0aW1lID09IG51bGwgPyBub3coKSA6ICt0aW1lKSArIChkZWxheSA9PSBudWxsID8gMCA6ICtkZWxheSk7XG4gICAgaWYgKCF0aGlzLl9uZXh0ICYmIHRhc2tUYWlsICE9PSB0aGlzKSB7XG4gICAgICBpZiAodGFza1RhaWwpIHRhc2tUYWlsLl9uZXh0ID0gdGhpcztcbiAgICAgIGVsc2UgdGFza0hlYWQgPSB0aGlzO1xuICAgICAgdGFza1RhaWwgPSB0aGlzO1xuICAgIH1cbiAgICB0aGlzLl9jYWxsID0gY2FsbGJhY2s7XG4gICAgdGhpcy5fdGltZSA9IHRpbWU7XG4gICAgc2xlZXAoKTtcbiAgfSxcbiAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX2NhbGwpIHtcbiAgICAgIHRoaXMuX2NhbGwgPSBudWxsO1xuICAgICAgdGhpcy5fdGltZSA9IEluZmluaXR5O1xuICAgICAgc2xlZXAoKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lcihjYWxsYmFjaywgZGVsYXksIHRpbWUpIHtcbiAgdmFyIHQgPSBuZXcgVGltZXI7XG4gIHQucmVzdGFydChjYWxsYmFjaywgZGVsYXksIHRpbWUpO1xuICByZXR1cm4gdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyRmx1c2goKSB7XG4gIG5vdygpOyAvLyBHZXQgdGhlIGN1cnJlbnQgdGltZSwgaWYgbm90IGFscmVhZHkgc2V0LlxuICArK2ZyYW1lOyAvLyBQcmV0ZW5kIHdlXHUyMDE5dmUgc2V0IGFuIGFsYXJtLCBpZiB3ZSBoYXZlblx1MjAxOXQgYWxyZWFkeS5cbiAgdmFyIHQgPSB0YXNrSGVhZCwgZTtcbiAgd2hpbGUgKHQpIHtcbiAgICBpZiAoKGUgPSBjbG9ja05vdyAtIHQuX3RpbWUpID49IDApIHQuX2NhbGwuY2FsbCh1bmRlZmluZWQsIGUpO1xuICAgIHQgPSB0Ll9uZXh0O1xuICB9XG4gIC0tZnJhbWU7XG59XG5cbmZ1bmN0aW9uIHdha2UoKSB7XG4gIGNsb2NrTm93ID0gKGNsb2NrTGFzdCA9IGNsb2NrLm5vdygpKSArIGNsb2NrU2tldztcbiAgZnJhbWUgPSB0aW1lb3V0ID0gMDtcbiAgdHJ5IHtcbiAgICB0aW1lckZsdXNoKCk7XG4gIH0gZmluYWxseSB7XG4gICAgZnJhbWUgPSAwO1xuICAgIG5hcCgpO1xuICAgIGNsb2NrTm93ID0gMDtcbiAgfVxufVxuXG5mdW5jdGlvbiBwb2tlKCkge1xuICB2YXIgbm93ID0gY2xvY2subm93KCksIGRlbGF5ID0gbm93IC0gY2xvY2tMYXN0O1xuICBpZiAoZGVsYXkgPiBwb2tlRGVsYXkpIGNsb2NrU2tldyAtPSBkZWxheSwgY2xvY2tMYXN0ID0gbm93O1xufVxuXG5mdW5jdGlvbiBuYXAoKSB7XG4gIHZhciB0MCwgdDEgPSB0YXNrSGVhZCwgdDIsIHRpbWUgPSBJbmZpbml0eTtcbiAgd2hpbGUgKHQxKSB7XG4gICAgaWYgKHQxLl9jYWxsKSB7XG4gICAgICBpZiAodGltZSA+IHQxLl90aW1lKSB0aW1lID0gdDEuX3RpbWU7XG4gICAgICB0MCA9IHQxLCB0MSA9IHQxLl9uZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0MiA9IHQxLl9uZXh0LCB0MS5fbmV4dCA9IG51bGw7XG4gICAgICB0MSA9IHQwID8gdDAuX25leHQgPSB0MiA6IHRhc2tIZWFkID0gdDI7XG4gICAgfVxuICB9XG4gIHRhc2tUYWlsID0gdDA7XG4gIHNsZWVwKHRpbWUpO1xufVxuXG5mdW5jdGlvbiBzbGVlcCh0aW1lKSB7XG4gIGlmIChmcmFtZSkgcmV0dXJuOyAvLyBTb29uZXN0IGFsYXJtIGFscmVhZHkgc2V0LCBvciB3aWxsIGJlLlxuICBpZiAodGltZW91dCkgdGltZW91dCA9IGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgdmFyIGRlbGF5ID0gdGltZSAtIGNsb2NrTm93OyAvLyBTdHJpY3RseSBsZXNzIHRoYW4gaWYgd2UgcmVjb21wdXRlZCBjbG9ja05vdy5cbiAgaWYgKGRlbGF5ID4gMjQpIHtcbiAgICBpZiAodGltZSA8IEluZmluaXR5KSB0aW1lb3V0ID0gc2V0VGltZW91dCh3YWtlLCB0aW1lIC0gY2xvY2subm93KCkgLSBjbG9ja1NrZXcpO1xuICAgIGlmIChpbnRlcnZhbCkgaW50ZXJ2YWwgPSBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWludGVydmFsKSBjbG9ja0xhc3QgPSBjbG9jay5ub3coKSwgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChwb2tlLCBwb2tlRGVsYXkpO1xuICAgIGZyYW1lID0gMSwgc2V0RnJhbWUod2FrZSk7XG4gIH1cbn1cbiIsICJpbXBvcnQge1RpbWVyfSBmcm9tIFwiLi90aW1lci5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjYWxsYmFjaywgZGVsYXksIHRpbWUpIHtcbiAgdmFyIHQgPSBuZXcgVGltZXI7XG4gIGRlbGF5ID0gZGVsYXkgPT0gbnVsbCA/IDAgOiArZGVsYXk7XG4gIHQucmVzdGFydChlbGFwc2VkID0+IHtcbiAgICB0LnN0b3AoKTtcbiAgICBjYWxsYmFjayhlbGFwc2VkICsgZGVsYXkpO1xuICB9LCBkZWxheSwgdGltZSk7XG4gIHJldHVybiB0O1xufVxuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHt0aW1lciwgdGltZW91dH0gZnJvbSBcImQzLXRpbWVyXCI7XG5cbnZhciBlbXB0eU9uID0gZGlzcGF0Y2goXCJzdGFydFwiLCBcImVuZFwiLCBcImNhbmNlbFwiLCBcImludGVycnVwdFwiKTtcbnZhciBlbXB0eVR3ZWVuID0gW107XG5cbmV4cG9ydCB2YXIgQ1JFQVRFRCA9IDA7XG5leHBvcnQgdmFyIFNDSEVEVUxFRCA9IDE7XG5leHBvcnQgdmFyIFNUQVJUSU5HID0gMjtcbmV4cG9ydCB2YXIgU1RBUlRFRCA9IDM7XG5leHBvcnQgdmFyIFJVTk5JTkcgPSA0O1xuZXhwb3J0IHZhciBFTkRJTkcgPSA1O1xuZXhwb3J0IHZhciBFTkRFRCA9IDY7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUsIG5hbWUsIGlkLCBpbmRleCwgZ3JvdXAsIHRpbWluZykge1xuICB2YXIgc2NoZWR1bGVzID0gbm9kZS5fX3RyYW5zaXRpb247XG4gIGlmICghc2NoZWR1bGVzKSBub2RlLl9fdHJhbnNpdGlvbiA9IHt9O1xuICBlbHNlIGlmIChpZCBpbiBzY2hlZHVsZXMpIHJldHVybjtcbiAgY3JlYXRlKG5vZGUsIGlkLCB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBpbmRleDogaW5kZXgsIC8vIEZvciBjb250ZXh0IGR1cmluZyBjYWxsYmFjay5cbiAgICBncm91cDogZ3JvdXAsIC8vIEZvciBjb250ZXh0IGR1cmluZyBjYWxsYmFjay5cbiAgICBvbjogZW1wdHlPbixcbiAgICB0d2VlbjogZW1wdHlUd2VlbixcbiAgICB0aW1lOiB0aW1pbmcudGltZSxcbiAgICBkZWxheTogdGltaW5nLmRlbGF5LFxuICAgIGR1cmF0aW9uOiB0aW1pbmcuZHVyYXRpb24sXG4gICAgZWFzZTogdGltaW5nLmVhc2UsXG4gICAgdGltZXI6IG51bGwsXG4gICAgc3RhdGU6IENSRUFURURcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KG5vZGUsIGlkKSB7XG4gIHZhciBzY2hlZHVsZSA9IGdldChub2RlLCBpZCk7XG4gIGlmIChzY2hlZHVsZS5zdGF0ZSA+IENSRUFURUQpIHRocm93IG5ldyBFcnJvcihcInRvbyBsYXRlOyBhbHJlYWR5IHNjaGVkdWxlZFwiKTtcbiAgcmV0dXJuIHNjaGVkdWxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0KG5vZGUsIGlkKSB7XG4gIHZhciBzY2hlZHVsZSA9IGdldChub2RlLCBpZCk7XG4gIGlmIChzY2hlZHVsZS5zdGF0ZSA+IFNUQVJURUQpIHRocm93IG5ldyBFcnJvcihcInRvbyBsYXRlOyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gIHJldHVybiBzY2hlZHVsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldChub2RlLCBpZCkge1xuICB2YXIgc2NoZWR1bGUgPSBub2RlLl9fdHJhbnNpdGlvbjtcbiAgaWYgKCFzY2hlZHVsZSB8fCAhKHNjaGVkdWxlID0gc2NoZWR1bGVbaWRdKSkgdGhyb3cgbmV3IEVycm9yKFwidHJhbnNpdGlvbiBub3QgZm91bmRcIik7XG4gIHJldHVybiBzY2hlZHVsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKG5vZGUsIGlkLCBzZWxmKSB7XG4gIHZhciBzY2hlZHVsZXMgPSBub2RlLl9fdHJhbnNpdGlvbixcbiAgICAgIHR3ZWVuO1xuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNlbGYgdGltZXIgd2hlbiB0aGUgdHJhbnNpdGlvbiBpcyBjcmVhdGVkLlxuICAvLyBOb3RlIHRoZSBhY3R1YWwgZGVsYXkgaXMgbm90IGtub3duIHVudGlsIHRoZSBmaXJzdCBjYWxsYmFjayFcbiAgc2NoZWR1bGVzW2lkXSA9IHNlbGY7XG4gIHNlbGYudGltZXIgPSB0aW1lcihzY2hlZHVsZSwgMCwgc2VsZi50aW1lKTtcblxuICBmdW5jdGlvbiBzY2hlZHVsZShlbGFwc2VkKSB7XG4gICAgc2VsZi5zdGF0ZSA9IFNDSEVEVUxFRDtcbiAgICBzZWxmLnRpbWVyLnJlc3RhcnQoc3RhcnQsIHNlbGYuZGVsYXksIHNlbGYudGltZSk7XG5cbiAgICAvLyBJZiB0aGUgZWxhcHNlZCBkZWxheSBpcyBsZXNzIHRoYW4gb3VyIGZpcnN0IHNsZWVwLCBzdGFydCBpbW1lZGlhdGVseS5cbiAgICBpZiAoc2VsZi5kZWxheSA8PSBlbGFwc2VkKSBzdGFydChlbGFwc2VkIC0gc2VsZi5kZWxheSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydChlbGFwc2VkKSB7XG4gICAgdmFyIGksIGosIG4sIG87XG5cbiAgICAvLyBJZiB0aGUgc3RhdGUgaXMgbm90IFNDSEVEVUxFRCwgdGhlbiB3ZSBwcmV2aW91c2x5IGVycm9yZWQgb24gc3RhcnQuXG4gICAgaWYgKHNlbGYuc3RhdGUgIT09IFNDSEVEVUxFRCkgcmV0dXJuIHN0b3AoKTtcblxuICAgIGZvciAoaSBpbiBzY2hlZHVsZXMpIHtcbiAgICAgIG8gPSBzY2hlZHVsZXNbaV07XG4gICAgICBpZiAoby5uYW1lICE9PSBzZWxmLm5hbWUpIGNvbnRpbnVlO1xuXG4gICAgICAvLyBXaGlsZSB0aGlzIGVsZW1lbnQgYWxyZWFkeSBoYXMgYSBzdGFydGluZyB0cmFuc2l0aW9uIGR1cmluZyB0aGlzIGZyYW1lLFxuICAgICAgLy8gZGVmZXIgc3RhcnRpbmcgYW4gaW50ZXJydXB0aW5nIHRyYW5zaXRpb24gdW50aWwgdGhhdCB0cmFuc2l0aW9uIGhhcyBhXG4gICAgICAvLyBjaGFuY2UgdG8gdGljayAoYW5kIHBvc3NpYmx5IGVuZCk7IHNlZSBkMy9kMy10cmFuc2l0aW9uIzU0IVxuICAgICAgaWYgKG8uc3RhdGUgPT09IFNUQVJURUQpIHJldHVybiB0aW1lb3V0KHN0YXJ0KTtcblxuICAgICAgLy8gSW50ZXJydXB0IHRoZSBhY3RpdmUgdHJhbnNpdGlvbiwgaWYgYW55LlxuICAgICAgaWYgKG8uc3RhdGUgPT09IFJVTk5JTkcpIHtcbiAgICAgICAgby5zdGF0ZSA9IEVOREVEO1xuICAgICAgICBvLnRpbWVyLnN0b3AoKTtcbiAgICAgICAgby5vbi5jYWxsKFwiaW50ZXJydXB0XCIsIG5vZGUsIG5vZGUuX19kYXRhX18sIG8uaW5kZXgsIG8uZ3JvdXApO1xuICAgICAgICBkZWxldGUgc2NoZWR1bGVzW2ldO1xuICAgICAgfVxuXG4gICAgICAvLyBDYW5jZWwgYW55IHByZS1lbXB0ZWQgdHJhbnNpdGlvbnMuXG4gICAgICBlbHNlIGlmICgraSA8IGlkKSB7XG4gICAgICAgIG8uc3RhdGUgPSBFTkRFRDtcbiAgICAgICAgby50aW1lci5zdG9wKCk7XG4gICAgICAgIG8ub24uY2FsbChcImNhbmNlbFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBvLmluZGV4LCBvLmdyb3VwKTtcbiAgICAgICAgZGVsZXRlIHNjaGVkdWxlc1tpXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZlciB0aGUgZmlyc3QgdGljayB0byBlbmQgb2YgdGhlIGN1cnJlbnQgZnJhbWU7IHNlZSBkMy9kMyMxNTc2LlxuICAgIC8vIE5vdGUgdGhlIHRyYW5zaXRpb24gbWF5IGJlIGNhbmNlbGVkIGFmdGVyIHN0YXJ0IGFuZCBiZWZvcmUgdGhlIGZpcnN0IHRpY2shXG4gICAgLy8gTm90ZSB0aGlzIG11c3QgYmUgc2NoZWR1bGVkIGJlZm9yZSB0aGUgc3RhcnQgZXZlbnQ7IHNlZSBkMy9kMy10cmFuc2l0aW9uIzE2IVxuICAgIC8vIEFzc3VtaW5nIHRoaXMgaXMgc3VjY2Vzc2Z1bCwgc3Vic2VxdWVudCBjYWxsYmFja3MgZ28gc3RyYWlnaHQgdG8gdGljay5cbiAgICB0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNlbGYuc3RhdGUgPT09IFNUQVJURUQpIHtcbiAgICAgICAgc2VsZi5zdGF0ZSA9IFJVTk5JTkc7XG4gICAgICAgIHNlbGYudGltZXIucmVzdGFydCh0aWNrLCBzZWxmLmRlbGF5LCBzZWxmLnRpbWUpO1xuICAgICAgICB0aWNrKGVsYXBzZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIHN0YXJ0IGV2ZW50LlxuICAgIC8vIE5vdGUgdGhpcyBtdXN0IGJlIGRvbmUgYmVmb3JlIHRoZSB0d2VlbiBhcmUgaW5pdGlhbGl6ZWQuXG4gICAgc2VsZi5zdGF0ZSA9IFNUQVJUSU5HO1xuICAgIHNlbGYub24uY2FsbChcInN0YXJ0XCIsIG5vZGUsIG5vZGUuX19kYXRhX18sIHNlbGYuaW5kZXgsIHNlbGYuZ3JvdXApO1xuICAgIGlmIChzZWxmLnN0YXRlICE9PSBTVEFSVElORykgcmV0dXJuOyAvLyBpbnRlcnJ1cHRlZFxuICAgIHNlbGYuc3RhdGUgPSBTVEFSVEVEO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgdHdlZW4sIGRlbGV0aW5nIG51bGwgdHdlZW4uXG4gICAgdHdlZW4gPSBuZXcgQXJyYXkobiA9IHNlbGYudHdlZW4ubGVuZ3RoKTtcbiAgICBmb3IgKGkgPSAwLCBqID0gLTE7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChvID0gc2VsZi50d2VlbltpXS52YWx1ZS5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIHNlbGYuaW5kZXgsIHNlbGYuZ3JvdXApKSB7XG4gICAgICAgIHR3ZWVuWysral0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICB0d2Vlbi5sZW5ndGggPSBqICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpY2soZWxhcHNlZCkge1xuICAgIHZhciB0ID0gZWxhcHNlZCA8IHNlbGYuZHVyYXRpb24gPyBzZWxmLmVhc2UuY2FsbChudWxsLCBlbGFwc2VkIC8gc2VsZi5kdXJhdGlvbikgOiAoc2VsZi50aW1lci5yZXN0YXJ0KHN0b3ApLCBzZWxmLnN0YXRlID0gRU5ESU5HLCAxKSxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBuID0gdHdlZW4ubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgIHR3ZWVuW2ldLmNhbGwobm9kZSwgdCk7XG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggdGhlIGVuZCBldmVudC5cbiAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gRU5ESU5HKSB7XG4gICAgICBzZWxmLm9uLmNhbGwoXCJlbmRcIiwgbm9kZSwgbm9kZS5fX2RhdGFfXywgc2VsZi5pbmRleCwgc2VsZi5ncm91cCk7XG4gICAgICBzdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICBzZWxmLnN0YXRlID0gRU5ERUQ7XG4gICAgc2VsZi50aW1lci5zdG9wKCk7XG4gICAgZGVsZXRlIHNjaGVkdWxlc1tpZF07XG4gICAgZm9yICh2YXIgaSBpbiBzY2hlZHVsZXMpIHJldHVybjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIGRlbGV0ZSBub2RlLl9fdHJhbnNpdGlvbjtcbiAgfVxufVxuIiwgImltcG9ydCB7U1RBUlRJTkcsIEVORElORywgRU5ERUR9IGZyb20gXCIuL3RyYW5zaXRpb24vc2NoZWR1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obm9kZSwgbmFtZSkge1xuICB2YXIgc2NoZWR1bGVzID0gbm9kZS5fX3RyYW5zaXRpb24sXG4gICAgICBzY2hlZHVsZSxcbiAgICAgIGFjdGl2ZSxcbiAgICAgIGVtcHR5ID0gdHJ1ZSxcbiAgICAgIGk7XG5cbiAgaWYgKCFzY2hlZHVsZXMpIHJldHVybjtcblxuICBuYW1lID0gbmFtZSA9PSBudWxsID8gbnVsbCA6IG5hbWUgKyBcIlwiO1xuXG4gIGZvciAoaSBpbiBzY2hlZHVsZXMpIHtcbiAgICBpZiAoKHNjaGVkdWxlID0gc2NoZWR1bGVzW2ldKS5uYW1lICE9PSBuYW1lKSB7IGVtcHR5ID0gZmFsc2U7IGNvbnRpbnVlOyB9XG4gICAgYWN0aXZlID0gc2NoZWR1bGUuc3RhdGUgPiBTVEFSVElORyAmJiBzY2hlZHVsZS5zdGF0ZSA8IEVORElORztcbiAgICBzY2hlZHVsZS5zdGF0ZSA9IEVOREVEO1xuICAgIHNjaGVkdWxlLnRpbWVyLnN0b3AoKTtcbiAgICBzY2hlZHVsZS5vbi5jYWxsKGFjdGl2ZSA/IFwiaW50ZXJydXB0XCIgOiBcImNhbmNlbFwiLCBub2RlLCBub2RlLl9fZGF0YV9fLCBzY2hlZHVsZS5pbmRleCwgc2NoZWR1bGUuZ3JvdXApO1xuICAgIGRlbGV0ZSBzY2hlZHVsZXNbaV07XG4gIH1cblxuICBpZiAoZW1wdHkpIGRlbGV0ZSBub2RlLl9fdHJhbnNpdGlvbjtcbn1cbiIsICJpbXBvcnQgaW50ZXJydXB0IGZyb20gXCIuLi9pbnRlcnJ1cHQuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIGludGVycnVwdCh0aGlzLCBuYW1lKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHtnZXQsIHNldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gdHdlZW5SZW1vdmUoaWQsIG5hbWUpIHtcbiAgdmFyIHR3ZWVuMCwgdHdlZW4xO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNjaGVkdWxlID0gc2V0KHRoaXMsIGlkKSxcbiAgICAgICAgdHdlZW4gPSBzY2hlZHVsZS50d2VlbjtcblxuICAgIC8vIElmIHRoaXMgbm9kZSBzaGFyZWQgdHdlZW4gd2l0aCB0aGUgcHJldmlvdXMgbm9kZSxcbiAgICAvLyBqdXN0IGFzc2lnbiB0aGUgdXBkYXRlZCBzaGFyZWQgdHdlZW4gYW5kIHdlXHUyMDE5cmUgZG9uZSFcbiAgICAvLyBPdGhlcndpc2UsIGNvcHktb24td3JpdGUuXG4gICAgaWYgKHR3ZWVuICE9PSB0d2VlbjApIHtcbiAgICAgIHR3ZWVuMSA9IHR3ZWVuMCA9IHR3ZWVuO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSB0d2VlbjEubGVuZ3RoOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIGlmICh0d2VlbjFbaV0ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgIHR3ZWVuMSA9IHR3ZWVuMS5zbGljZSgpO1xuICAgICAgICAgIHR3ZWVuMS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzY2hlZHVsZS50d2VlbiA9IHR3ZWVuMTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdHdlZW5GdW5jdGlvbihpZCwgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIHR3ZWVuMCwgdHdlZW4xO1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzY2hlZHVsZSA9IHNldCh0aGlzLCBpZCksXG4gICAgICAgIHR3ZWVuID0gc2NoZWR1bGUudHdlZW47XG5cbiAgICAvLyBJZiB0aGlzIG5vZGUgc2hhcmVkIHR3ZWVuIHdpdGggdGhlIHByZXZpb3VzIG5vZGUsXG4gICAgLy8ganVzdCBhc3NpZ24gdGhlIHVwZGF0ZWQgc2hhcmVkIHR3ZWVuIGFuZCB3ZVx1MjAxOXJlIGRvbmUhXG4gICAgLy8gT3RoZXJ3aXNlLCBjb3B5LW9uLXdyaXRlLlxuICAgIGlmICh0d2VlbiAhPT0gdHdlZW4wKSB7XG4gICAgICB0d2VlbjEgPSAodHdlZW4wID0gdHdlZW4pLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciB0ID0ge25hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZX0sIGkgPSAwLCBuID0gdHdlZW4xLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAodHdlZW4xW2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICB0d2VlbjFbaV0gPSB0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaSA9PT0gbikgdHdlZW4xLnB1c2godCk7XG4gICAgfVxuXG4gICAgc2NoZWR1bGUudHdlZW4gPSB0d2VlbjE7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBpZCA9IHRoaXMuX2lkO1xuXG4gIG5hbWUgKz0gXCJcIjtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgdHdlZW4gPSBnZXQodGhpcy5ub2RlKCksIGlkKS50d2VlbjtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IHR3ZWVuLmxlbmd0aCwgdDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKCh0ID0gdHdlZW5baV0pLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHQudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuZWFjaCgodmFsdWUgPT0gbnVsbCA/IHR3ZWVuUmVtb3ZlIDogdHdlZW5GdW5jdGlvbikoaWQsIG5hbWUsIHZhbHVlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0d2VlblZhbHVlKHRyYW5zaXRpb24sIG5hbWUsIHZhbHVlKSB7XG4gIHZhciBpZCA9IHRyYW5zaXRpb24uX2lkO1xuXG4gIHRyYW5zaXRpb24uZWFjaChmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NoZWR1bGUgPSBzZXQodGhpcywgaWQpO1xuICAgIChzY2hlZHVsZS52YWx1ZSB8fCAoc2NoZWR1bGUudmFsdWUgPSB7fSkpW25hbWVdID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gZ2V0KG5vZGUsIGlkKS52YWx1ZVtuYW1lXTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge2NvbG9yfSBmcm9tIFwiZDMtY29sb3JcIjtcbmltcG9ydCB7aW50ZXJwb2xhdGVOdW1iZXIsIGludGVycG9sYXRlUmdiLCBpbnRlcnBvbGF0ZVN0cmluZ30gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGEsIGIpIHtcbiAgdmFyIGM7XG4gIHJldHVybiAodHlwZW9mIGIgPT09IFwibnVtYmVyXCIgPyBpbnRlcnBvbGF0ZU51bWJlclxuICAgICAgOiBiIGluc3RhbmNlb2YgY29sb3IgPyBpbnRlcnBvbGF0ZVJnYlxuICAgICAgOiAoYyA9IGNvbG9yKGIpKSA/IChiID0gYywgaW50ZXJwb2xhdGVSZ2IpXG4gICAgICA6IGludGVycG9sYXRlU3RyaW5nKShhLCBiKTtcbn1cbiIsICJpbXBvcnQge2ludGVycG9sYXRlVHJhbnNmb3JtU3ZnIGFzIGludGVycG9sYXRlVHJhbnNmb3JtfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7bmFtZXNwYWNlfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge3R3ZWVuVmFsdWV9IGZyb20gXCIuL3R3ZWVuLmpzXCI7XG5pbXBvcnQgaW50ZXJwb2xhdGUgZnJvbSBcIi4vaW50ZXJwb2xhdGUuanNcIjtcblxuZnVuY3Rpb24gYXR0clJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clJlbW92ZU5TKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJDb25zdGFudChuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUxKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoZnVsbG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZTEpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCIsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCA9IHRoaXMuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckZ1bmN0aW9uKG5hbWUsIGludGVycG9sYXRlLCB2YWx1ZSkge1xuICB2YXIgc3RyaW5nMDAsXG4gICAgICBzdHJpbmcxMCxcbiAgICAgIGludGVycG9sYXRlMDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdHJpbmcwLCB2YWx1ZTEgPSB2YWx1ZSh0aGlzKSwgc3RyaW5nMTtcbiAgICBpZiAodmFsdWUxID09IG51bGwpIHJldHVybiB2b2lkIHRoaXMucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgIHN0cmluZzAgPSB0aGlzLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIjtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCAmJiBzdHJpbmcxID09PSBzdHJpbmcxMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IChzdHJpbmcxMCA9IHN0cmluZzEsIGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJGdW5jdGlvbk5TKGZ1bGxuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMTAsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCwgdmFsdWUxID0gdmFsdWUodGhpcyksIHN0cmluZzE7XG4gICAgaWYgKHZhbHVlMSA9PSBudWxsKSByZXR1cm4gdm9pZCB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgc3RyaW5nMCA9IHRoaXMuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKTtcbiAgICBzdHJpbmcxID0gdmFsdWUxICsgXCJcIjtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCAmJiBzdHJpbmcxID09PSBzdHJpbmcxMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IChzdHJpbmcxMCA9IHN0cmluZzEsIGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKSwgaSA9IGZ1bGxuYW1lID09PSBcInRyYW5zZm9ybVwiID8gaW50ZXJwb2xhdGVUcmFuc2Zvcm0gOiBpbnRlcnBvbGF0ZTtcbiAgcmV0dXJuIHRoaXMuYXR0clR3ZWVuKG5hbWUsIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJGdW5jdGlvbk5TIDogYXR0ckZ1bmN0aW9uKShmdWxsbmFtZSwgaSwgdHdlZW5WYWx1ZSh0aGlzLCBcImF0dHIuXCIgKyBuYW1lLCB2YWx1ZSkpXG4gICAgICA6IHZhbHVlID09IG51bGwgPyAoZnVsbG5hbWUubG9jYWwgPyBhdHRyUmVtb3ZlTlMgOiBhdHRyUmVtb3ZlKShmdWxsbmFtZSlcbiAgICAgIDogKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckNvbnN0YW50TlMgOiBhdHRyQ29uc3RhbnQpKGZ1bGxuYW1lLCBpLCB2YWx1ZSkpO1xufVxuIiwgImltcG9ydCB7bmFtZXNwYWNlfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5cbmZ1bmN0aW9uIGF0dHJJbnRlcnBvbGF0ZShuYW1lLCBpKSB7XG4gIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgaS5jYWxsKHRoaXMsIHQpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckludGVycG9sYXRlTlMoZnVsbG5hbWUsIGkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgaS5jYWxsKHRoaXMsIHQpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0clR3ZWVuTlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHZhciB0MCwgaTA7XG4gIGZ1bmN0aW9uIHR3ZWVuKCkge1xuICAgIHZhciBpID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoaSAhPT0gaTApIHQwID0gKGkwID0gaSkgJiYgYXR0ckludGVycG9sYXRlTlMoZnVsbG5hbWUsIGkpO1xuICAgIHJldHVybiB0MDtcbiAgfVxuICB0d2Vlbi5fdmFsdWUgPSB2YWx1ZTtcbiAgcmV0dXJuIHR3ZWVuO1xufVxuXG5mdW5jdGlvbiBhdHRyVHdlZW4obmFtZSwgdmFsdWUpIHtcbiAgdmFyIHQwLCBpMDtcbiAgZnVuY3Rpb24gdHdlZW4oKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChpICE9PSBpMCkgdDAgPSAoaTAgPSBpKSAmJiBhdHRySW50ZXJwb2xhdGUobmFtZSwgaSk7XG4gICAgcmV0dXJuIHQwO1xuICB9XG4gIHR3ZWVuLl92YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gdHdlZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBrZXkgPSBcImF0dHIuXCIgKyBuYW1lO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHJldHVybiAoa2V5ID0gdGhpcy50d2VlbihrZXkpKSAmJiBrZXkuX3ZhbHVlO1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCBudWxsKTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcbiAgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCAoZnVsbG5hbWUubG9jYWwgPyBhdHRyVHdlZW5OUyA6IGF0dHJUd2VlbikoZnVsbG5hbWUsIHZhbHVlKSk7XG59XG4iLCAiaW1wb3J0IHtnZXQsIGluaXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIGRlbGF5RnVuY3Rpb24oaWQsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBpbml0KHRoaXMsIGlkKS5kZWxheSA9ICt2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkZWxheUNvbnN0YW50KGlkLCB2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPSArdmFsdWUsIGZ1bmN0aW9uKCkge1xuICAgIGluaXQodGhpcywgaWQpLmRlbGF5ID0gdmFsdWU7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBpZCA9IHRoaXMuX2lkO1xuXG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaCgodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGRlbGF5RnVuY3Rpb25cbiAgICAgICAgICA6IGRlbGF5Q29uc3RhbnQpKGlkLCB2YWx1ZSkpXG4gICAgICA6IGdldCh0aGlzLm5vZGUoKSwgaWQpLmRlbGF5O1xufVxuIiwgImltcG9ydCB7Z2V0LCBzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmZ1bmN0aW9uIGR1cmF0aW9uRnVuY3Rpb24oaWQsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBzZXQodGhpcywgaWQpLmR1cmF0aW9uID0gK3ZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGR1cmF0aW9uQ29uc3RhbnQoaWQsIHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9ICt2YWx1ZSwgZnVuY3Rpb24oKSB7XG4gICAgc2V0KHRoaXMsIGlkKS5kdXJhdGlvbiA9IHZhbHVlO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICB2YXIgaWQgPSB0aGlzLl9pZDtcblxuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLmVhY2goKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgPyBkdXJhdGlvbkZ1bmN0aW9uXG4gICAgICAgICAgOiBkdXJhdGlvbkNvbnN0YW50KShpZCwgdmFsdWUpKVxuICAgICAgOiBnZXQodGhpcy5ub2RlKCksIGlkKS5kdXJhdGlvbjtcbn1cbiIsICJpbXBvcnQge2dldCwgc2V0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiBlYXNlQ29uc3RhbnQoaWQsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IEVycm9yO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgc2V0KHRoaXMsIGlkKS5lYXNlID0gdmFsdWU7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBpZCA9IHRoaXMuX2lkO1xuXG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuZWFjaChlYXNlQ29uc3RhbnQoaWQsIHZhbHVlKSlcbiAgICAgIDogZ2V0KHRoaXMubm9kZSgpLCBpZCkuZWFzZTtcbn1cbiIsICJpbXBvcnQge3NldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZnVuY3Rpb24gZWFzZVZhcnlpbmcoaWQsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHR5cGVvZiB2ICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgICBzZXQodGhpcywgaWQpLmVhc2UgPSB2O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHRocm93IG5ldyBFcnJvcjtcbiAgcmV0dXJuIHRoaXMuZWFjaChlYXNlVmFyeWluZyh0aGlzLl9pZCwgdmFsdWUpKTtcbn1cbiIsICJpbXBvcnQge21hdGNoZXJ9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMsIHRoaXMuX25hbWUsIHRoaXMuX2lkKTtcbn1cbiIsICJpbXBvcnQge1RyYW5zaXRpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgaWYgKHRyYW5zaXRpb24uX2lkICE9PSB0aGlzLl9pZCkgdGhyb3cgbmV3IEVycm9yO1xuXG4gIGZvciAodmFyIGdyb3VwczAgPSB0aGlzLl9ncm91cHMsIGdyb3VwczEgPSB0cmFuc2l0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihtZXJnZXMsIHRoaXMuX3BhcmVudHMsIHRoaXMuX25hbWUsIHRoaXMuX2lkKTtcbn1cbiIsICJpbXBvcnQge2dldCwgc2V0LCBpbml0fSBmcm9tIFwiLi9zY2hlZHVsZS5qc1wiO1xuXG5mdW5jdGlvbiBzdGFydChuYW1lKSB7XG4gIHJldHVybiAobmFtZSArIFwiXCIpLnRyaW0oKS5zcGxpdCgvXnxcXHMrLykuZXZlcnkoZnVuY3Rpb24odCkge1xuICAgIHZhciBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSB0ID0gdC5zbGljZSgwLCBpKTtcbiAgICByZXR1cm4gIXQgfHwgdCA9PT0gXCJzdGFydFwiO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25GdW5jdGlvbihpZCwgbmFtZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG9uMCwgb24xLCBzaXQgPSBzdGFydChuYW1lKSA/IGluaXQgOiBzZXQ7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NoZWR1bGUgPSBzaXQodGhpcywgaWQpLFxuICAgICAgICBvbiA9IHNjaGVkdWxlLm9uO1xuXG4gICAgLy8gSWYgdGhpcyBub2RlIHNoYXJlZCBhIGRpc3BhdGNoIHdpdGggdGhlIHByZXZpb3VzIG5vZGUsXG4gICAgLy8ganVzdCBhc3NpZ24gdGhlIHVwZGF0ZWQgc2hhcmVkIGRpc3BhdGNoIGFuZCB3ZVx1MjAxOXJlIGRvbmUhXG4gICAgLy8gT3RoZXJ3aXNlLCBjb3B5LW9uLXdyaXRlLlxuICAgIGlmIChvbiAhPT0gb24wKSAob24xID0gKG9uMCA9IG9uKS5jb3B5KCkpLm9uKG5hbWUsIGxpc3RlbmVyKTtcblxuICAgIHNjaGVkdWxlLm9uID0gb24xO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcikge1xuICB2YXIgaWQgPSB0aGlzLl9pZDtcblxuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDJcbiAgICAgID8gZ2V0KHRoaXMubm9kZSgpLCBpZCkub24ub24obmFtZSlcbiAgICAgIDogdGhpcy5lYWNoKG9uRnVuY3Rpb24oaWQsIG5hbWUsIGxpc3RlbmVyKSk7XG59XG4iLCAiZnVuY3Rpb24gcmVtb3ZlRnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gICAgZm9yICh2YXIgaSBpbiB0aGlzLl9fdHJhbnNpdGlvbikgaWYgKCtpICE9PSBpZCkgcmV0dXJuO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm9uKFwiZW5kLnJlbW92ZVwiLCByZW1vdmVGdW5jdGlvbih0aGlzLl9pZCkpO1xufVxuIiwgImltcG9ydCB7c2VsZWN0b3J9IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB7VHJhbnNpdGlvbn0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzY2hlZHVsZSwge2dldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc2VsZWN0KSB7XG4gIHZhciBuYW1lID0gdGhpcy5fbmFtZSxcbiAgICAgIGlkID0gdGhpcy5faWQ7XG5cbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3Ioc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIG4gPSBncm91cC5sZW5ndGgsIHN1Ymdyb3VwID0gc3ViZ3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBzdWJub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKChub2RlID0gZ3JvdXBbaV0pICYmIChzdWJub2RlID0gc2VsZWN0LmNhbGwobm9kZSwgbm9kZS5fX2RhdGFfXywgaSwgZ3JvdXApKSkge1xuICAgICAgICBpZiAoXCJfX2RhdGFfX1wiIGluIG5vZGUpIHN1Ym5vZGUuX19kYXRhX18gPSBub2RlLl9fZGF0YV9fO1xuICAgICAgICBzdWJncm91cFtpXSA9IHN1Ym5vZGU7XG4gICAgICAgIHNjaGVkdWxlKHN1Ymdyb3VwW2ldLCBuYW1lLCBpZCwgaSwgc3ViZ3JvdXAsIGdldChub2RlLCBpZCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihzdWJncm91cHMsIHRoaXMuX3BhcmVudHMsIG5hbWUsIGlkKTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdG9yQWxsfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge1RyYW5zaXRpb259IGZyb20gXCIuL2luZGV4LmpzXCI7XG5pbXBvcnQgc2NoZWR1bGUsIHtnZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdCkge1xuICB2YXIgbmFtZSA9IHRoaXMuX25hbWUsXG4gICAgICBpZCA9IHRoaXMuX2lkO1xuXG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yQWxsKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gW10sIHBhcmVudHMgPSBbXSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgZm9yICh2YXIgY2hpbGRyZW4gPSBzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCksIGNoaWxkLCBpbmhlcml0ID0gZ2V0KG5vZGUsIGlkKSwgayA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGsgPCBsOyArK2spIHtcbiAgICAgICAgICBpZiAoY2hpbGQgPSBjaGlsZHJlbltrXSkge1xuICAgICAgICAgICAgc2NoZWR1bGUoY2hpbGQsIG5hbWUsIGlkLCBrLCBjaGlsZHJlbiwgaW5oZXJpdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN1Ymdyb3Vwcy5wdXNoKGNoaWxkcmVuKTtcbiAgICAgICAgcGFyZW50cy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihzdWJncm91cHMsIHBhcmVudHMsIG5hbWUsIGlkKTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdGlvbn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuXG52YXIgU2VsZWN0aW9uID0gc2VsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHRoaXMuX2dyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG4iLCAiaW1wb3J0IHtpbnRlcnBvbGF0ZVRyYW5zZm9ybUNzcyBhcyBpbnRlcnBvbGF0ZVRyYW5zZm9ybX0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQge3N0eWxlfSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge3NldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcbmltcG9ydCB7dHdlZW5WYWx1ZX0gZnJvbSBcIi4vdHdlZW4uanNcIjtcbmltcG9ydCBpbnRlcnBvbGF0ZSBmcm9tIFwiLi9pbnRlcnBvbGF0ZS5qc1wiO1xuXG5mdW5jdGlvbiBzdHlsZU51bGwobmFtZSwgaW50ZXJwb2xhdGUpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMTAsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCA9IHN0eWxlKHRoaXMsIG5hbWUpLFxuICAgICAgICBzdHJpbmcxID0gKHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSksIHN0eWxlKHRoaXMsIG5hbWUpKTtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCAmJiBzdHJpbmcxID09PSBzdHJpbmcxMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgc3RyaW5nMTAgPSBzdHJpbmcxKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVDb25zdGFudChuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUxKSB7XG4gIHZhciBzdHJpbmcwMCxcbiAgICAgIHN0cmluZzEgPSB2YWx1ZTEgKyBcIlwiLFxuICAgICAgaW50ZXJwb2xhdGUwO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0cmluZzAgPSBzdHlsZSh0aGlzLCBuYW1lKTtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3R5bGVGdW5jdGlvbihuYW1lLCBpbnRlcnBvbGF0ZSwgdmFsdWUpIHtcbiAgdmFyIHN0cmluZzAwLFxuICAgICAgc3RyaW5nMTAsXG4gICAgICBpbnRlcnBvbGF0ZTA7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RyaW5nMCA9IHN0eWxlKHRoaXMsIG5hbWUpLFxuICAgICAgICB2YWx1ZTEgPSB2YWx1ZSh0aGlzKSxcbiAgICAgICAgc3RyaW5nMSA9IHZhbHVlMSArIFwiXCI7XG4gICAgaWYgKHZhbHVlMSA9PSBudWxsKSBzdHJpbmcxID0gdmFsdWUxID0gKHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSksIHN0eWxlKHRoaXMsIG5hbWUpKTtcbiAgICByZXR1cm4gc3RyaW5nMCA9PT0gc3RyaW5nMSA/IG51bGxcbiAgICAgICAgOiBzdHJpbmcwID09PSBzdHJpbmcwMCAmJiBzdHJpbmcxID09PSBzdHJpbmcxMCA/IGludGVycG9sYXRlMFxuICAgICAgICA6IChzdHJpbmcxMCA9IHN0cmluZzEsIGludGVycG9sYXRlMCA9IGludGVycG9sYXRlKHN0cmluZzAwID0gc3RyaW5nMCwgdmFsdWUxKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlTWF5YmVSZW1vdmUoaWQsIG5hbWUpIHtcbiAgdmFyIG9uMCwgb24xLCBsaXN0ZW5lcjAsIGtleSA9IFwic3R5bGUuXCIgKyBuYW1lLCBldmVudCA9IFwiZW5kLlwiICsga2V5LCByZW1vdmU7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2NoZWR1bGUgPSBzZXQodGhpcywgaWQpLFxuICAgICAgICBvbiA9IHNjaGVkdWxlLm9uLFxuICAgICAgICBsaXN0ZW5lciA9IHNjaGVkdWxlLnZhbHVlW2tleV0gPT0gbnVsbCA/IHJlbW92ZSB8fCAocmVtb3ZlID0gc3R5bGVSZW1vdmUobmFtZSkpIDogdW5kZWZpbmVkO1xuXG4gICAgLy8gSWYgdGhpcyBub2RlIHNoYXJlZCBhIGRpc3BhdGNoIHdpdGggdGhlIHByZXZpb3VzIG5vZGUsXG4gICAgLy8ganVzdCBhc3NpZ24gdGhlIHVwZGF0ZWQgc2hhcmVkIGRpc3BhdGNoIGFuZCB3ZVx1MjAxOXJlIGRvbmUhXG4gICAgLy8gT3RoZXJ3aXNlLCBjb3B5LW9uLXdyaXRlLlxuICAgIGlmIChvbiAhPT0gb24wIHx8IGxpc3RlbmVyMCAhPT0gbGlzdGVuZXIpIChvbjEgPSAob24wID0gb24pLmNvcHkoKSkub24oZXZlbnQsIGxpc3RlbmVyMCA9IGxpc3RlbmVyKTtcblxuICAgIHNjaGVkdWxlLm9uID0gb24xO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpIHtcbiAgdmFyIGkgPSAobmFtZSArPSBcIlwiKSA9PT0gXCJ0cmFuc2Zvcm1cIiA/IGludGVycG9sYXRlVHJhbnNmb3JtIDogaW50ZXJwb2xhdGU7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gdGhpc1xuICAgICAgLnN0eWxlVHdlZW4obmFtZSwgc3R5bGVOdWxsKG5hbWUsIGkpKVxuICAgICAgLm9uKFwiZW5kLnN0eWxlLlwiICsgbmFtZSwgc3R5bGVSZW1vdmUobmFtZSkpXG4gICAgOiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IHRoaXNcbiAgICAgIC5zdHlsZVR3ZWVuKG5hbWUsIHN0eWxlRnVuY3Rpb24obmFtZSwgaSwgdHdlZW5WYWx1ZSh0aGlzLCBcInN0eWxlLlwiICsgbmFtZSwgdmFsdWUpKSlcbiAgICAgIC5lYWNoKHN0eWxlTWF5YmVSZW1vdmUodGhpcy5faWQsIG5hbWUpKVxuICAgIDogdGhpc1xuICAgICAgLnN0eWxlVHdlZW4obmFtZSwgc3R5bGVDb25zdGFudChuYW1lLCBpLCB2YWx1ZSksIHByaW9yaXR5KVxuICAgICAgLm9uKFwiZW5kLnN0eWxlLlwiICsgbmFtZSwgbnVsbCk7XG59XG4iLCAiZnVuY3Rpb24gc3R5bGVJbnRlcnBvbGF0ZShuYW1lLCBpLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHRoaXMuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgaS5jYWxsKHRoaXMsIHQpLCBwcmlvcml0eSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0eWxlVHdlZW4obmFtZSwgdmFsdWUsIHByaW9yaXR5KSB7XG4gIHZhciB0LCBpMDtcbiAgZnVuY3Rpb24gdHdlZW4oKSB7XG4gICAgdmFyIGkgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChpICE9PSBpMCkgdCA9IChpMCA9IGkpICYmIHN0eWxlSW50ZXJwb2xhdGUobmFtZSwgaSwgcHJpb3JpdHkpO1xuICAgIHJldHVybiB0O1xuICB9XG4gIHR3ZWVuLl92YWx1ZSA9IHZhbHVlO1xuICByZXR1cm4gdHdlZW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICB2YXIga2V5ID0gXCJzdHlsZS5cIiArIChuYW1lICs9IFwiXCIpO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHJldHVybiAoa2V5ID0gdGhpcy50d2VlbihrZXkpKSAmJiBrZXkuX3ZhbHVlO1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCBudWxsKTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgc3R5bGVUd2VlbihuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpO1xufVxuIiwgImltcG9ydCB7dHdlZW5WYWx1ZX0gZnJvbSBcIi4vdHdlZW4uanNcIjtcblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZhbHVlMSA9IHZhbHVlKHRoaXMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2YWx1ZTEgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZTE7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLnR3ZWVuKFwidGV4dFwiLCB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyB0ZXh0RnVuY3Rpb24odHdlZW5WYWx1ZSh0aGlzLCBcInRleHRcIiwgdmFsdWUpKVxuICAgICAgOiB0ZXh0Q29uc3RhbnQodmFsdWUgPT0gbnVsbCA/IFwiXCIgOiB2YWx1ZSArIFwiXCIpKTtcbn1cbiIsICJmdW5jdGlvbiB0ZXh0SW50ZXJwb2xhdGUoaSkge1xuICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSBpLmNhbGwodGhpcywgdCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRUd2Vlbih2YWx1ZSkge1xuICB2YXIgdDAsIGkwO1xuICBmdW5jdGlvbiB0d2VlbigpIHtcbiAgICB2YXIgaSA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGkgIT09IGkwKSB0MCA9IChpMCA9IGkpICYmIHRleHRJbnRlcnBvbGF0ZShpKTtcbiAgICByZXR1cm4gdDA7XG4gIH1cbiAgdHdlZW4uX3ZhbHVlID0gdmFsdWU7XG4gIHJldHVybiB0d2Vlbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIGtleSA9IFwidGV4dFwiO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDEpIHJldHVybiAoa2V5ID0gdGhpcy50d2VlbihrZXkpKSAmJiBrZXkuX3ZhbHVlO1xuICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIHRoaXMudHdlZW4oa2V5LCBudWxsKTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJmdW5jdGlvblwiKSB0aHJvdyBuZXcgRXJyb3I7XG4gIHJldHVybiB0aGlzLnR3ZWVuKGtleSwgdGV4dFR3ZWVuKHZhbHVlKSk7XG59XG4iLCAiaW1wb3J0IHtUcmFuc2l0aW9uLCBuZXdJZH0gZnJvbSBcIi4vaW5kZXguanNcIjtcbmltcG9ydCBzY2hlZHVsZSwge2dldH0gZnJvbSBcIi4vc2NoZWR1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBuYW1lID0gdGhpcy5fbmFtZSxcbiAgICAgIGlkMCA9IHRoaXMuX2lkLFxuICAgICAgaWQxID0gbmV3SWQoKTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICB2YXIgaW5oZXJpdCA9IGdldChub2RlLCBpZDApO1xuICAgICAgICBzY2hlZHVsZShub2RlLCBuYW1lLCBpZDEsIGksIGdyb3VwLCB7XG4gICAgICAgICAgdGltZTogaW5oZXJpdC50aW1lICsgaW5oZXJpdC5kZWxheSArIGluaGVyaXQuZHVyYXRpb24sXG4gICAgICAgICAgZGVsYXk6IDAsXG4gICAgICAgICAgZHVyYXRpb246IGluaGVyaXQuZHVyYXRpb24sXG4gICAgICAgICAgZWFzZTogaW5oZXJpdC5lYXNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihncm91cHMsIHRoaXMuX3BhcmVudHMsIG5hbWUsIGlkMSk7XG59XG4iLCAiaW1wb3J0IHtzZXR9IGZyb20gXCIuL3NjaGVkdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgb24wLCBvbjEsIHRoYXQgPSB0aGlzLCBpZCA9IHRoYXQuX2lkLCBzaXplID0gdGhhdC5zaXplKCk7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgY2FuY2VsID0ge3ZhbHVlOiByZWplY3R9LFxuICAgICAgICBlbmQgPSB7dmFsdWU6IGZ1bmN0aW9uKCkgeyBpZiAoLS1zaXplID09PSAwKSByZXNvbHZlKCk7IH19O1xuXG4gICAgdGhhdC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNjaGVkdWxlID0gc2V0KHRoaXMsIGlkKSxcbiAgICAgICAgICBvbiA9IHNjaGVkdWxlLm9uO1xuXG4gICAgICAvLyBJZiB0aGlzIG5vZGUgc2hhcmVkIGEgZGlzcGF0Y2ggd2l0aCB0aGUgcHJldmlvdXMgbm9kZSxcbiAgICAgIC8vIGp1c3QgYXNzaWduIHRoZSB1cGRhdGVkIHNoYXJlZCBkaXNwYXRjaCBhbmQgd2VcdTIwMTlyZSBkb25lIVxuICAgICAgLy8gT3RoZXJ3aXNlLCBjb3B5LW9uLXdyaXRlLlxuICAgICAgaWYgKG9uICE9PSBvbjApIHtcbiAgICAgICAgb24xID0gKG9uMCA9IG9uKS5jb3B5KCk7XG4gICAgICAgIG9uMS5fLmNhbmNlbC5wdXNoKGNhbmNlbCk7XG4gICAgICAgIG9uMS5fLmludGVycnVwdC5wdXNoKGNhbmNlbCk7XG4gICAgICAgIG9uMS5fLmVuZC5wdXNoKGVuZCk7XG4gICAgICB9XG5cbiAgICAgIHNjaGVkdWxlLm9uID0gb24xO1xuICAgIH0pO1xuXG4gICAgLy8gVGhlIHNlbGVjdGlvbiB3YXMgZW1wdHksIHJlc29sdmUgZW5kIGltbWVkaWF0ZWx5XG4gICAgaWYgKHNpemUgPT09IDApIHJlc29sdmUoKTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHtzZWxlY3Rpb259IGZyb20gXCJkMy1zZWxlY3Rpb25cIjtcbmltcG9ydCB0cmFuc2l0aW9uX2F0dHIgZnJvbSBcIi4vYXR0ci5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fYXR0clR3ZWVuIGZyb20gXCIuL2F0dHJUd2Vlbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZGVsYXkgZnJvbSBcIi4vZGVsYXkuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2R1cmF0aW9uIGZyb20gXCIuL2R1cmF0aW9uLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9lYXNlIGZyb20gXCIuL2Vhc2UuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX2Vhc2VWYXJ5aW5nIGZyb20gXCIuL2Vhc2VWYXJ5aW5nLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9maWx0ZXIgZnJvbSBcIi4vZmlsdGVyLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9tZXJnZSBmcm9tIFwiLi9tZXJnZS5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fb24gZnJvbSBcIi4vb24uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3JlbW92ZSBmcm9tIFwiLi9yZW1vdmUuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3NlbGVjdCBmcm9tIFwiLi9zZWxlY3QuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3NlbGVjdEFsbCBmcm9tIFwiLi9zZWxlY3RBbGwuanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3NlbGVjdGlvbiBmcm9tIFwiLi9zZWxlY3Rpb24uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3N0eWxlIGZyb20gXCIuL3N0eWxlLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl9zdHlsZVR3ZWVuIGZyb20gXCIuL3N0eWxlVHdlZW4uanNcIjtcbmltcG9ydCB0cmFuc2l0aW9uX3RleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fdGV4dFR3ZWVuIGZyb20gXCIuL3RleHRUd2Vlbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fdHJhbnNpdGlvbiBmcm9tIFwiLi90cmFuc2l0aW9uLmpzXCI7XG5pbXBvcnQgdHJhbnNpdGlvbl90d2VlbiBmcm9tIFwiLi90d2Vlbi5qc1wiO1xuaW1wb3J0IHRyYW5zaXRpb25fZW5kIGZyb20gXCIuL2VuZC5qc1wiO1xuXG52YXIgaWQgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gVHJhbnNpdGlvbihncm91cHMsIHBhcmVudHMsIG5hbWUsIGlkKSB7XG4gIHRoaXMuX2dyb3VwcyA9IGdyb3VwcztcbiAgdGhpcy5fcGFyZW50cyA9IHBhcmVudHM7XG4gIHRoaXMuX25hbWUgPSBuYW1lO1xuICB0aGlzLl9pZCA9IGlkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmFuc2l0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIHNlbGVjdGlvbigpLnRyYW5zaXRpb24obmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdJZCgpIHtcbiAgcmV0dXJuICsraWQ7XG59XG5cbnZhciBzZWxlY3Rpb25fcHJvdG90eXBlID0gc2VsZWN0aW9uLnByb3RvdHlwZTtcblxuVHJhbnNpdGlvbi5wcm90b3R5cGUgPSB0cmFuc2l0aW9uLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFRyYW5zaXRpb24sXG4gIHNlbGVjdDogdHJhbnNpdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogdHJhbnNpdGlvbl9zZWxlY3RBbGwsXG4gIHNlbGVjdENoaWxkOiBzZWxlY3Rpb25fcHJvdG90eXBlLnNlbGVjdENoaWxkLFxuICBzZWxlY3RDaGlsZHJlbjogc2VsZWN0aW9uX3Byb3RvdHlwZS5zZWxlY3RDaGlsZHJlbixcbiAgZmlsdGVyOiB0cmFuc2l0aW9uX2ZpbHRlcixcbiAgbWVyZ2U6IHRyYW5zaXRpb25fbWVyZ2UsXG4gIHNlbGVjdGlvbjogdHJhbnNpdGlvbl9zZWxlY3Rpb24sXG4gIHRyYW5zaXRpb246IHRyYW5zaXRpb25fdHJhbnNpdGlvbixcbiAgY2FsbDogc2VsZWN0aW9uX3Byb3RvdHlwZS5jYWxsLFxuICBub2Rlczogc2VsZWN0aW9uX3Byb3RvdHlwZS5ub2RlcyxcbiAgbm9kZTogc2VsZWN0aW9uX3Byb3RvdHlwZS5ub2RlLFxuICBzaXplOiBzZWxlY3Rpb25fcHJvdG90eXBlLnNpemUsXG4gIGVtcHR5OiBzZWxlY3Rpb25fcHJvdG90eXBlLmVtcHR5LFxuICBlYWNoOiBzZWxlY3Rpb25fcHJvdG90eXBlLmVhY2gsXG4gIG9uOiB0cmFuc2l0aW9uX29uLFxuICBhdHRyOiB0cmFuc2l0aW9uX2F0dHIsXG4gIGF0dHJUd2VlbjogdHJhbnNpdGlvbl9hdHRyVHdlZW4sXG4gIHN0eWxlOiB0cmFuc2l0aW9uX3N0eWxlLFxuICBzdHlsZVR3ZWVuOiB0cmFuc2l0aW9uX3N0eWxlVHdlZW4sXG4gIHRleHQ6IHRyYW5zaXRpb25fdGV4dCxcbiAgdGV4dFR3ZWVuOiB0cmFuc2l0aW9uX3RleHRUd2VlbixcbiAgcmVtb3ZlOiB0cmFuc2l0aW9uX3JlbW92ZSxcbiAgdHdlZW46IHRyYW5zaXRpb25fdHdlZW4sXG4gIGRlbGF5OiB0cmFuc2l0aW9uX2RlbGF5LFxuICBkdXJhdGlvbjogdHJhbnNpdGlvbl9kdXJhdGlvbixcbiAgZWFzZTogdHJhbnNpdGlvbl9lYXNlLFxuICBlYXNlVmFyeWluZzogdHJhbnNpdGlvbl9lYXNlVmFyeWluZyxcbiAgZW5kOiB0cmFuc2l0aW9uX2VuZCxcbiAgW1N5bWJvbC5pdGVyYXRvcl06IHNlbGVjdGlvbl9wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXVxufTtcbiIsICJleHBvcnQgZnVuY3Rpb24gY3ViaWNJbih0KSB7XG4gIHJldHVybiB0ICogdCAqIHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJpY091dCh0KSB7XG4gIHJldHVybiAtLXQgKiB0ICogdCArIDE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjdWJpY0luT3V0KHQpIHtcbiAgcmV0dXJuICgodCAqPSAyKSA8PSAxID8gdCAqIHQgKiB0IDogKHQgLT0gMikgKiB0ICogdCArIDIpIC8gMjtcbn1cbiIsICJpbXBvcnQge1RyYW5zaXRpb24sIG5ld0lkfSBmcm9tIFwiLi4vdHJhbnNpdGlvbi9pbmRleC5qc1wiO1xuaW1wb3J0IHNjaGVkdWxlIGZyb20gXCIuLi90cmFuc2l0aW9uL3NjaGVkdWxlLmpzXCI7XG5pbXBvcnQge2Vhc2VDdWJpY0luT3V0fSBmcm9tIFwiZDMtZWFzZVwiO1xuaW1wb3J0IHtub3d9IGZyb20gXCJkMy10aW1lclwiO1xuXG52YXIgZGVmYXVsdFRpbWluZyA9IHtcbiAgdGltZTogbnVsbCwgLy8gU2V0IG9uIHVzZS5cbiAgZGVsYXk6IDAsXG4gIGR1cmF0aW9uOiAyNTAsXG4gIGVhc2U6IGVhc2VDdWJpY0luT3V0XG59O1xuXG5mdW5jdGlvbiBpbmhlcml0KG5vZGUsIGlkKSB7XG4gIHZhciB0aW1pbmc7XG4gIHdoaWxlICghKHRpbWluZyA9IG5vZGUuX190cmFuc2l0aW9uKSB8fCAhKHRpbWluZyA9IHRpbWluZ1tpZF0pKSB7XG4gICAgaWYgKCEobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHJhbnNpdGlvbiAke2lkfSBub3QgZm91bmRgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRpbWluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmFtZSkge1xuICB2YXIgaWQsXG4gICAgICB0aW1pbmc7XG5cbiAgaWYgKG5hbWUgaW5zdGFuY2VvZiBUcmFuc2l0aW9uKSB7XG4gICAgaWQgPSBuYW1lLl9pZCwgbmFtZSA9IG5hbWUuX25hbWU7XG4gIH0gZWxzZSB7XG4gICAgaWQgPSBuZXdJZCgpLCAodGltaW5nID0gZGVmYXVsdFRpbWluZykudGltZSA9IG5vdygpLCBuYW1lID0gbmFtZSA9PSBudWxsID8gbnVsbCA6IG5hbWUgKyBcIlwiO1xuICB9XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXBbaV0pIHtcbiAgICAgICAgc2NoZWR1bGUobm9kZSwgbmFtZSwgaWQsIGksIGdyb3VwLCB0aW1pbmcgfHwgaW5oZXJpdChub2RlLCBpZCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgVHJhbnNpdGlvbihncm91cHMsIHRoaXMuX3BhcmVudHMsIG5hbWUsIGlkKTtcbn1cbiIsICJpbXBvcnQge3NlbGVjdGlvbn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHNlbGVjdGlvbl9pbnRlcnJ1cHQgZnJvbSBcIi4vaW50ZXJydXB0LmpzXCI7XG5pbXBvcnQgc2VsZWN0aW9uX3RyYW5zaXRpb24gZnJvbSBcIi4vdHJhbnNpdGlvbi5qc1wiO1xuXG5zZWxlY3Rpb24ucHJvdG90eXBlLmludGVycnVwdCA9IHNlbGVjdGlvbl9pbnRlcnJ1cHQ7XG5zZWxlY3Rpb24ucHJvdG90eXBlLnRyYW5zaXRpb24gPSBzZWxlY3Rpb25fdHJhbnNpdGlvbjtcbiIsICJpbXBvcnQge2Rpc3BhdGNofSBmcm9tIFwiZDMtZGlzcGF0Y2hcIjtcbmltcG9ydCB7ZHJhZ0Rpc2FibGUsIGRyYWdFbmFibGV9IGZyb20gXCJkMy1kcmFnXCI7XG5pbXBvcnQge2ludGVycG9sYXRlfSBmcm9tIFwiZDMtaW50ZXJwb2xhdGVcIjtcbmltcG9ydCB7cG9pbnRlciwgc2VsZWN0fSBmcm9tIFwiZDMtc2VsZWN0aW9uXCI7XG5pbXBvcnQge2ludGVycnVwdH0gZnJvbSBcImQzLXRyYW5zaXRpb25cIjtcbmltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IEJydXNoRXZlbnQgZnJvbSBcIi4vZXZlbnQuanNcIjtcbmltcG9ydCBub2V2ZW50LCB7bm9wcm9wYWdhdGlvbn0gZnJvbSBcIi4vbm9ldmVudC5qc1wiO1xuXG52YXIgTU9ERV9EUkFHID0ge25hbWU6IFwiZHJhZ1wifSxcbiAgICBNT0RFX1NQQUNFID0ge25hbWU6IFwic3BhY2VcIn0sXG4gICAgTU9ERV9IQU5ETEUgPSB7bmFtZTogXCJoYW5kbGVcIn0sXG4gICAgTU9ERV9DRU5URVIgPSB7bmFtZTogXCJjZW50ZXJcIn07XG5cbmNvbnN0IHthYnMsIG1heCwgbWlufSA9IE1hdGg7XG5cbmZ1bmN0aW9uIG51bWJlcjEoZSkge1xuICByZXR1cm4gWytlWzBdLCArZVsxXV07XG59XG5cbmZ1bmN0aW9uIG51bWJlcjIoZSkge1xuICByZXR1cm4gW251bWJlcjEoZVswXSksIG51bWJlcjEoZVsxXSldO1xufVxuXG52YXIgWCA9IHtcbiAgbmFtZTogXCJ4XCIsXG4gIGhhbmRsZXM6IFtcIndcIiwgXCJlXCJdLm1hcCh0eXBlKSxcbiAgaW5wdXQ6IGZ1bmN0aW9uKHgsIGUpIHsgcmV0dXJuIHggPT0gbnVsbCA/IG51bGwgOiBbWyt4WzBdLCBlWzBdWzFdXSwgWyt4WzFdLCBlWzFdWzFdXV07IH0sXG4gIG91dHB1dDogZnVuY3Rpb24oeHkpIHsgcmV0dXJuIHh5ICYmIFt4eVswXVswXSwgeHlbMV1bMF1dOyB9XG59O1xuXG52YXIgWSA9IHtcbiAgbmFtZTogXCJ5XCIsXG4gIGhhbmRsZXM6IFtcIm5cIiwgXCJzXCJdLm1hcCh0eXBlKSxcbiAgaW5wdXQ6IGZ1bmN0aW9uKHksIGUpIHsgcmV0dXJuIHkgPT0gbnVsbCA/IG51bGwgOiBbW2VbMF1bMF0sICt5WzBdXSwgW2VbMV1bMF0sICt5WzFdXV07IH0sXG4gIG91dHB1dDogZnVuY3Rpb24oeHkpIHsgcmV0dXJuIHh5ICYmIFt4eVswXVsxXSwgeHlbMV1bMV1dOyB9XG59O1xuXG52YXIgWFkgPSB7XG4gIG5hbWU6IFwieHlcIixcbiAgaGFuZGxlczogW1wiblwiLCBcIndcIiwgXCJlXCIsIFwic1wiLCBcIm53XCIsIFwibmVcIiwgXCJzd1wiLCBcInNlXCJdLm1hcCh0eXBlKSxcbiAgaW5wdXQ6IGZ1bmN0aW9uKHh5KSB7IHJldHVybiB4eSA9PSBudWxsID8gbnVsbCA6IG51bWJlcjIoeHkpOyB9LFxuICBvdXRwdXQ6IGZ1bmN0aW9uKHh5KSB7IHJldHVybiB4eTsgfVxufTtcblxudmFyIGN1cnNvcnMgPSB7XG4gIG92ZXJsYXk6IFwiY3Jvc3NoYWlyXCIsXG4gIHNlbGVjdGlvbjogXCJtb3ZlXCIsXG4gIG46IFwibnMtcmVzaXplXCIsXG4gIGU6IFwiZXctcmVzaXplXCIsXG4gIHM6IFwibnMtcmVzaXplXCIsXG4gIHc6IFwiZXctcmVzaXplXCIsXG4gIG53OiBcIm53c2UtcmVzaXplXCIsXG4gIG5lOiBcIm5lc3ctcmVzaXplXCIsXG4gIHNlOiBcIm53c2UtcmVzaXplXCIsXG4gIHN3OiBcIm5lc3ctcmVzaXplXCJcbn07XG5cbnZhciBmbGlwWCA9IHtcbiAgZTogXCJ3XCIsXG4gIHc6IFwiZVwiLFxuICBudzogXCJuZVwiLFxuICBuZTogXCJud1wiLFxuICBzZTogXCJzd1wiLFxuICBzdzogXCJzZVwiXG59O1xuXG52YXIgZmxpcFkgPSB7XG4gIG46IFwic1wiLFxuICBzOiBcIm5cIixcbiAgbnc6IFwic3dcIixcbiAgbmU6IFwic2VcIixcbiAgc2U6IFwibmVcIixcbiAgc3c6IFwibndcIlxufTtcblxudmFyIHNpZ25zWCA9IHtcbiAgb3ZlcmxheTogKzEsXG4gIHNlbGVjdGlvbjogKzEsXG4gIG46IG51bGwsXG4gIGU6ICsxLFxuICBzOiBudWxsLFxuICB3OiAtMSxcbiAgbnc6IC0xLFxuICBuZTogKzEsXG4gIHNlOiArMSxcbiAgc3c6IC0xXG59O1xuXG52YXIgc2lnbnNZID0ge1xuICBvdmVybGF5OiArMSxcbiAgc2VsZWN0aW9uOiArMSxcbiAgbjogLTEsXG4gIGU6IG51bGwsXG4gIHM6ICsxLFxuICB3OiBudWxsLFxuICBudzogLTEsXG4gIG5lOiAtMSxcbiAgc2U6ICsxLFxuICBzdzogKzFcbn07XG5cbmZ1bmN0aW9uIHR5cGUodCkge1xuICByZXR1cm4ge3R5cGU6IHR9O1xufVxuXG4vLyBJZ25vcmUgcmlnaHQtY2xpY2ssIHNpbmNlIHRoYXQgc2hvdWxkIG9wZW4gdGhlIGNvbnRleHQgbWVudS5cbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXIoZXZlbnQpIHtcbiAgcmV0dXJuICFldmVudC5jdHJsS2V5ICYmICFldmVudC5idXR0b247XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRFeHRlbnQoKSB7XG4gIHZhciBzdmcgPSB0aGlzLm93bmVyU1ZHRWxlbWVudCB8fCB0aGlzO1xuICBpZiAoc3ZnLmhhc0F0dHJpYnV0ZShcInZpZXdCb3hcIikpIHtcbiAgICBzdmcgPSBzdmcudmlld0JveC5iYXNlVmFsO1xuICAgIHJldHVybiBbW3N2Zy54LCBzdmcueV0sIFtzdmcueCArIHN2Zy53aWR0aCwgc3ZnLnkgKyBzdmcuaGVpZ2h0XV07XG4gIH1cbiAgcmV0dXJuIFtbMCwgMF0sIFtzdmcud2lkdGguYmFzZVZhbC52YWx1ZSwgc3ZnLmhlaWdodC5iYXNlVmFsLnZhbHVlXV07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRUb3VjaGFibGUoKSB7XG4gIHJldHVybiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgKFwib250b3VjaHN0YXJ0XCIgaW4gdGhpcyk7XG59XG5cbi8vIExpa2UgZDMubG9jYWwsIGJ1dCB3aXRoIHRoZSBuYW1lIFx1MjAxQ19fYnJ1c2hcdTIwMUQgcmF0aGVyIHRoYW4gYXV0by1nZW5lcmF0ZWQuXG5mdW5jdGlvbiBsb2NhbChub2RlKSB7XG4gIHdoaWxlICghbm9kZS5fX2JydXNoKSBpZiAoIShub2RlID0gbm9kZS5wYXJlbnROb2RlKSkgcmV0dXJuO1xuICByZXR1cm4gbm9kZS5fX2JydXNoO1xufVxuXG5mdW5jdGlvbiBlbXB0eShleHRlbnQpIHtcbiAgcmV0dXJuIGV4dGVudFswXVswXSA9PT0gZXh0ZW50WzFdWzBdXG4gICAgICB8fCBleHRlbnRbMF1bMV0gPT09IGV4dGVudFsxXVsxXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJydXNoU2VsZWN0aW9uKG5vZGUpIHtcbiAgdmFyIHN0YXRlID0gbm9kZS5fX2JydXNoO1xuICByZXR1cm4gc3RhdGUgPyBzdGF0ZS5kaW0ub3V0cHV0KHN0YXRlLnNlbGVjdGlvbikgOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnJ1c2hYKCkge1xuICByZXR1cm4gYnJ1c2goWCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBicnVzaFkoKSB7XG4gIHJldHVybiBicnVzaChZKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBicnVzaChYWSk7XG59XG5cbmZ1bmN0aW9uIGJydXNoKGRpbSkge1xuICB2YXIgZXh0ZW50ID0gZGVmYXVsdEV4dGVudCxcbiAgICAgIGZpbHRlciA9IGRlZmF1bHRGaWx0ZXIsXG4gICAgICB0b3VjaGFibGUgPSBkZWZhdWx0VG91Y2hhYmxlLFxuICAgICAga2V5cyA9IHRydWUsXG4gICAgICBsaXN0ZW5lcnMgPSBkaXNwYXRjaChcInN0YXJ0XCIsIFwiYnJ1c2hcIiwgXCJlbmRcIiksXG4gICAgICBoYW5kbGVTaXplID0gNixcbiAgICAgIHRvdWNoZW5kaW5nO1xuXG4gIGZ1bmN0aW9uIGJydXNoKGdyb3VwKSB7XG4gICAgdmFyIG92ZXJsYXkgPSBncm91cFxuICAgICAgICAucHJvcGVydHkoXCJfX2JydXNoXCIsIGluaXRpYWxpemUpXG4gICAgICAuc2VsZWN0QWxsKFwiLm92ZXJsYXlcIilcbiAgICAgIC5kYXRhKFt0eXBlKFwib3ZlcmxheVwiKV0pO1xuXG4gICAgb3ZlcmxheS5lbnRlcigpLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm92ZXJsYXlcIilcbiAgICAgICAgLmF0dHIoXCJwb2ludGVyLWV2ZW50c1wiLCBcImFsbFwiKVxuICAgICAgICAuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzLm92ZXJsYXkpXG4gICAgICAubWVyZ2Uob3ZlcmxheSlcbiAgICAgICAgLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGV4dGVudCA9IGxvY2FsKHRoaXMpLmV4dGVudDtcbiAgICAgICAgICBzZWxlY3QodGhpcylcbiAgICAgICAgICAgICAgLmF0dHIoXCJ4XCIsIGV4dGVudFswXVswXSlcbiAgICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGV4dGVudFswXVsxXSlcbiAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBleHRlbnRbMV1bMF0gLSBleHRlbnRbMF1bMF0pXG4gICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGV4dGVudFsxXVsxXSAtIGV4dGVudFswXVsxXSk7XG4gICAgICAgIH0pO1xuXG4gICAgZ3JvdXAuc2VsZWN0QWxsKFwiLnNlbGVjdGlvblwiKVxuICAgICAgLmRhdGEoW3R5cGUoXCJzZWxlY3Rpb25cIildKVxuICAgICAgLmVudGVyKCkuYXBwZW5kKFwicmVjdFwiKVxuICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwic2VsZWN0aW9uXCIpXG4gICAgICAgIC5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnMuc2VsZWN0aW9uKVxuICAgICAgICAuYXR0cihcImZpbGxcIiwgXCIjNzc3XCIpXG4gICAgICAgIC5hdHRyKFwiZmlsbC1vcGFjaXR5XCIsIDAuMylcbiAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCIjZmZmXCIpXG4gICAgICAgIC5hdHRyKFwic2hhcGUtcmVuZGVyaW5nXCIsIFwiY3Jpc3BFZGdlc1wiKTtcblxuICAgIHZhciBoYW5kbGUgPSBncm91cC5zZWxlY3RBbGwoXCIuaGFuZGxlXCIpXG4gICAgICAuZGF0YShkaW0uaGFuZGxlcywgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlOyB9KTtcblxuICAgIGhhbmRsZS5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICBoYW5kbGUuZW50ZXIoKS5hcHBlbmQoXCJyZWN0XCIpXG4gICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gXCJoYW5kbGUgaGFuZGxlLS1cIiArIGQudHlwZTsgfSlcbiAgICAgICAgLmF0dHIoXCJjdXJzb3JcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gY3Vyc29yc1tkLnR5cGVdOyB9KTtcblxuICAgIGdyb3VwXG4gICAgICAgIC5lYWNoKHJlZHJhdylcbiAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwiYWxsXCIpXG4gICAgICAgIC5vbihcIm1vdXNlZG93bi5icnVzaFwiLCBzdGFydGVkKVxuICAgICAgLmZpbHRlcih0b3VjaGFibGUpXG4gICAgICAgIC5vbihcInRvdWNoc3RhcnQuYnJ1c2hcIiwgc3RhcnRlZClcbiAgICAgICAgLm9uKFwidG91Y2htb3ZlLmJydXNoXCIsIHRvdWNobW92ZWQpXG4gICAgICAgIC5vbihcInRvdWNoZW5kLmJydXNoIHRvdWNoY2FuY2VsLmJydXNoXCIsIHRvdWNoZW5kZWQpXG4gICAgICAgIC5zdHlsZShcInRvdWNoLWFjdGlvblwiLCBcIm5vbmVcIilcbiAgICAgICAgLnN0eWxlKFwiLXdlYmtpdC10YXAtaGlnaGxpZ2h0LWNvbG9yXCIsIFwicmdiYSgwLDAsMCwwKVwiKTtcbiAgfVxuXG4gIGJydXNoLm1vdmUgPSBmdW5jdGlvbihncm91cCwgc2VsZWN0aW9uLCBldmVudCkge1xuICAgIGlmIChncm91cC50d2Vlbikge1xuICAgICAgZ3JvdXBcbiAgICAgICAgICAub24oXCJzdGFydC5icnVzaFwiLCBmdW5jdGlvbihldmVudCkgeyBlbWl0dGVyKHRoaXMsIGFyZ3VtZW50cykuYmVmb3Jlc3RhcnQoKS5zdGFydChldmVudCk7IH0pXG4gICAgICAgICAgLm9uKFwiaW50ZXJydXB0LmJydXNoIGVuZC5icnVzaFwiLCBmdW5jdGlvbihldmVudCkgeyBlbWl0dGVyKHRoaXMsIGFyZ3VtZW50cykuZW5kKGV2ZW50KTsgfSlcbiAgICAgICAgICAudHdlZW4oXCJicnVzaFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHRoYXQuX19icnVzaCxcbiAgICAgICAgICAgICAgICBlbWl0ID0gZW1pdHRlcih0aGF0LCBhcmd1bWVudHMpLFxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbjAgPSBzdGF0ZS5zZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uMSA9IGRpbS5pbnB1dCh0eXBlb2Ygc2VsZWN0aW9uID09PSBcImZ1bmN0aW9uXCIgPyBzZWxlY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHNlbGVjdGlvbiwgc3RhdGUuZXh0ZW50KSxcbiAgICAgICAgICAgICAgICBpID0gaW50ZXJwb2xhdGUoc2VsZWN0aW9uMCwgc2VsZWN0aW9uMSk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHR3ZWVuKHQpIHtcbiAgICAgICAgICAgICAgc3RhdGUuc2VsZWN0aW9uID0gdCA9PT0gMSAmJiBzZWxlY3Rpb24xID09PSBudWxsID8gbnVsbCA6IGkodCk7XG4gICAgICAgICAgICAgIHJlZHJhdy5jYWxsKHRoYXQpO1xuICAgICAgICAgICAgICBlbWl0LmJydXNoKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Rpb24wICE9PSBudWxsICYmIHNlbGVjdGlvbjEgIT09IG51bGwgPyB0d2VlbiA6IHR3ZWVuKDEpO1xuICAgICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBncm91cFxuICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0aGF0Ll9fYnJ1c2gsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uMSA9IGRpbS5pbnB1dCh0eXBlb2Ygc2VsZWN0aW9uID09PSBcImZ1bmN0aW9uXCIgPyBzZWxlY3Rpb24uYXBwbHkodGhhdCwgYXJncykgOiBzZWxlY3Rpb24sIHN0YXRlLmV4dGVudCksXG4gICAgICAgICAgICAgICAgZW1pdCA9IGVtaXR0ZXIodGhhdCwgYXJncykuYmVmb3Jlc3RhcnQoKTtcblxuICAgICAgICAgICAgaW50ZXJydXB0KHRoYXQpO1xuICAgICAgICAgICAgc3RhdGUuc2VsZWN0aW9uID0gc2VsZWN0aW9uMSA9PT0gbnVsbCA/IG51bGwgOiBzZWxlY3Rpb24xO1xuICAgICAgICAgICAgcmVkcmF3LmNhbGwodGhhdCk7XG4gICAgICAgICAgICBlbWl0LnN0YXJ0KGV2ZW50KS5icnVzaChldmVudCkuZW5kKGV2ZW50KTtcbiAgICAgICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgYnJ1c2guY2xlYXIgPSBmdW5jdGlvbihncm91cCwgZXZlbnQpIHtcbiAgICBicnVzaC5tb3ZlKGdyb3VwLCBudWxsLCBldmVudCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVkcmF3KCkge1xuICAgIHZhciBncm91cCA9IHNlbGVjdCh0aGlzKSxcbiAgICAgICAgc2VsZWN0aW9uID0gbG9jYWwodGhpcykuc2VsZWN0aW9uO1xuXG4gICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgZ3JvdXAuc2VsZWN0QWxsKFwiLnNlbGVjdGlvblwiKVxuICAgICAgICAgIC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAgICAgICAuYXR0cihcInhcIiwgc2VsZWN0aW9uWzBdWzBdKVxuICAgICAgICAgIC5hdHRyKFwieVwiLCBzZWxlY3Rpb25bMF1bMV0pXG4gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBzZWxlY3Rpb25bMV1bMF0gLSBzZWxlY3Rpb25bMF1bMF0pXG4gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgc2VsZWN0aW9uWzFdWzFdIC0gc2VsZWN0aW9uWzBdWzFdKTtcblxuICAgICAgZ3JvdXAuc2VsZWN0QWxsKFwiLmhhbmRsZVwiKVxuICAgICAgICAgIC5zdHlsZShcImRpc3BsYXlcIiwgbnVsbClcbiAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlW2QudHlwZS5sZW5ndGggLSAxXSA9PT0gXCJlXCIgPyBzZWxlY3Rpb25bMV1bMF0gLSBoYW5kbGVTaXplIC8gMiA6IHNlbGVjdGlvblswXVswXSAtIGhhbmRsZVNpemUgLyAyOyB9KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLnR5cGVbMF0gPT09IFwic1wiID8gc2VsZWN0aW9uWzFdWzFdIC0gaGFuZGxlU2l6ZSAvIDIgOiBzZWxlY3Rpb25bMF1bMV0gLSBoYW5kbGVTaXplIC8gMjsgfSlcbiAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZSA9PT0gXCJuXCIgfHwgZC50eXBlID09PSBcInNcIiA/IHNlbGVjdGlvblsxXVswXSAtIHNlbGVjdGlvblswXVswXSArIGhhbmRsZVNpemUgOiBoYW5kbGVTaXplOyB9KVxuICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZSA9PT0gXCJlXCIgfHwgZC50eXBlID09PSBcIndcIiA/IHNlbGVjdGlvblsxXVsxXSAtIHNlbGVjdGlvblswXVsxXSArIGhhbmRsZVNpemUgOiBoYW5kbGVTaXplOyB9KTtcbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgIGdyb3VwLnNlbGVjdEFsbChcIi5zZWxlY3Rpb24sLmhhbmRsZVwiKVxuICAgICAgICAgIC5zdHlsZShcImRpc3BsYXlcIiwgXCJub25lXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIG51bGwpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIG51bGwpXG4gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBudWxsKVxuICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGVtaXR0ZXIodGhhdCwgYXJncywgY2xlYW4pIHtcbiAgICB2YXIgZW1pdCA9IHRoYXQuX19icnVzaC5lbWl0dGVyO1xuICAgIHJldHVybiBlbWl0ICYmICghY2xlYW4gfHwgIWVtaXQuY2xlYW4pID8gZW1pdCA6IG5ldyBFbWl0dGVyKHRoYXQsIGFyZ3MsIGNsZWFuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEVtaXR0ZXIodGhhdCwgYXJncywgY2xlYW4pIHtcbiAgICB0aGlzLnRoYXQgPSB0aGF0O1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgdGhpcy5zdGF0ZSA9IHRoYXQuX19icnVzaDtcbiAgICB0aGlzLmFjdGl2ZSA9IDA7XG4gICAgdGhpcy5jbGVhbiA9IGNsZWFuO1xuICB9XG5cbiAgRW1pdHRlci5wcm90b3R5cGUgPSB7XG4gICAgYmVmb3Jlc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCsrdGhpcy5hY3RpdmUgPT09IDEpIHRoaXMuc3RhdGUuZW1pdHRlciA9IHRoaXMsIHRoaXMuc3RhcnRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIG1vZGUpIHtcbiAgICAgIGlmICh0aGlzLnN0YXJ0aW5nKSB0aGlzLnN0YXJ0aW5nID0gZmFsc2UsIHRoaXMuZW1pdChcInN0YXJ0XCIsIGV2ZW50LCBtb2RlKTtcbiAgICAgIGVsc2UgdGhpcy5lbWl0KFwiYnJ1c2hcIiwgZXZlbnQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBicnVzaDogZnVuY3Rpb24oZXZlbnQsIG1vZGUpIHtcbiAgICAgIHRoaXMuZW1pdChcImJydXNoXCIsIGV2ZW50LCBtb2RlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbihldmVudCwgbW9kZSkge1xuICAgICAgaWYgKC0tdGhpcy5hY3RpdmUgPT09IDApIGRlbGV0ZSB0aGlzLnN0YXRlLmVtaXR0ZXIsIHRoaXMuZW1pdChcImVuZFwiLCBldmVudCwgbW9kZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVtaXQ6IGZ1bmN0aW9uKHR5cGUsIGV2ZW50LCBtb2RlKSB7XG4gICAgICB2YXIgZCA9IHNlbGVjdCh0aGlzLnRoYXQpLmRhdHVtKCk7XG4gICAgICBsaXN0ZW5lcnMuY2FsbChcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdGhpcy50aGF0LFxuICAgICAgICBuZXcgQnJ1c2hFdmVudCh0eXBlLCB7XG4gICAgICAgICAgc291cmNlRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgIHRhcmdldDogYnJ1c2gsXG4gICAgICAgICAgc2VsZWN0aW9uOiBkaW0ub3V0cHV0KHRoaXMuc3RhdGUuc2VsZWN0aW9uKSxcbiAgICAgICAgICBtb2RlLFxuICAgICAgICAgIGRpc3BhdGNoOiBsaXN0ZW5lcnNcbiAgICAgICAgfSksXG4gICAgICAgIGRcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHN0YXJ0ZWQoZXZlbnQpIHtcbiAgICBpZiAodG91Y2hlbmRpbmcgJiYgIWV2ZW50LnRvdWNoZXMpIHJldHVybjtcbiAgICBpZiAoIWZpbHRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSByZXR1cm47XG5cbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIHR5cGUgPSBldmVudC50YXJnZXQuX19kYXRhX18udHlwZSxcbiAgICAgICAgbW9kZSA9IChrZXlzICYmIGV2ZW50Lm1ldGFLZXkgPyB0eXBlID0gXCJvdmVybGF5XCIgOiB0eXBlKSA9PT0gXCJzZWxlY3Rpb25cIiA/IE1PREVfRFJBRyA6IChrZXlzICYmIGV2ZW50LmFsdEtleSA/IE1PREVfQ0VOVEVSIDogTU9ERV9IQU5ETEUpLFxuICAgICAgICBzaWduWCA9IGRpbSA9PT0gWSA/IG51bGwgOiBzaWduc1hbdHlwZV0sXG4gICAgICAgIHNpZ25ZID0gZGltID09PSBYID8gbnVsbCA6IHNpZ25zWVt0eXBlXSxcbiAgICAgICAgc3RhdGUgPSBsb2NhbCh0aGF0KSxcbiAgICAgICAgZXh0ZW50ID0gc3RhdGUuZXh0ZW50LFxuICAgICAgICBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb24sXG4gICAgICAgIFcgPSBleHRlbnRbMF1bMF0sIHcwLCB3MSxcbiAgICAgICAgTiA9IGV4dGVudFswXVsxXSwgbjAsIG4xLFxuICAgICAgICBFID0gZXh0ZW50WzFdWzBdLCBlMCwgZTEsXG4gICAgICAgIFMgPSBleHRlbnRbMV1bMV0sIHMwLCBzMSxcbiAgICAgICAgZHggPSAwLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIG1vdmluZyxcbiAgICAgICAgc2hpZnRpbmcgPSBzaWduWCAmJiBzaWduWSAmJiBrZXlzICYmIGV2ZW50LnNoaWZ0S2V5LFxuICAgICAgICBsb2NrWCxcbiAgICAgICAgbG9ja1ksXG4gICAgICAgIHBvaW50cyA9IEFycmF5LmZyb20oZXZlbnQudG91Y2hlcyB8fCBbZXZlbnRdLCB0ID0+IHtcbiAgICAgICAgICBjb25zdCBpID0gdC5pZGVudGlmaWVyO1xuICAgICAgICAgIHQgPSBwb2ludGVyKHQsIHRoYXQpO1xuICAgICAgICAgIHQucG9pbnQwID0gdC5zbGljZSgpO1xuICAgICAgICAgIHQuaWRlbnRpZmllciA9IGk7XG4gICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgIH0pO1xuXG4gICAgaW50ZXJydXB0KHRoYXQpO1xuICAgIHZhciBlbWl0ID0gZW1pdHRlcih0aGF0LCBhcmd1bWVudHMsIHRydWUpLmJlZm9yZXN0YXJ0KCk7XG5cbiAgICBpZiAodHlwZSA9PT0gXCJvdmVybGF5XCIpIHtcbiAgICAgIGlmIChzZWxlY3Rpb24pIG1vdmluZyA9IHRydWU7XG4gICAgICBjb25zdCBwdHMgPSBbcG9pbnRzWzBdLCBwb2ludHNbMV0gfHwgcG9pbnRzWzBdXTtcbiAgICAgIHN0YXRlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbiA9IFtbXG4gICAgICAgICAgdzAgPSBkaW0gPT09IFkgPyBXIDogbWluKHB0c1swXVswXSwgcHRzWzFdWzBdKSxcbiAgICAgICAgICBuMCA9IGRpbSA9PT0gWCA/IE4gOiBtaW4ocHRzWzBdWzFdLCBwdHNbMV1bMV0pXG4gICAgICAgIF0sIFtcbiAgICAgICAgICBlMCA9IGRpbSA9PT0gWSA/IEUgOiBtYXgocHRzWzBdWzBdLCBwdHNbMV1bMF0pLFxuICAgICAgICAgIHMwID0gZGltID09PSBYID8gUyA6IG1heChwdHNbMF1bMV0sIHB0c1sxXVsxXSlcbiAgICAgICAgXV07XG4gICAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDEpIG1vdmUoZXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3MCA9IHNlbGVjdGlvblswXVswXTtcbiAgICAgIG4wID0gc2VsZWN0aW9uWzBdWzFdO1xuICAgICAgZTAgPSBzZWxlY3Rpb25bMV1bMF07XG4gICAgICBzMCA9IHNlbGVjdGlvblsxXVsxXTtcbiAgICB9XG5cbiAgICB3MSA9IHcwO1xuICAgIG4xID0gbjA7XG4gICAgZTEgPSBlMDtcbiAgICBzMSA9IHMwO1xuXG4gICAgdmFyIGdyb3VwID0gc2VsZWN0KHRoYXQpXG4gICAgICAgIC5hdHRyKFwicG9pbnRlci1ldmVudHNcIiwgXCJub25lXCIpO1xuXG4gICAgdmFyIG92ZXJsYXkgPSBncm91cC5zZWxlY3RBbGwoXCIub3ZlcmxheVwiKVxuICAgICAgICAuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzW3R5cGVdKTtcblxuICAgIGlmIChldmVudC50b3VjaGVzKSB7XG4gICAgICBlbWl0Lm1vdmVkID0gbW92ZWQ7XG4gICAgICBlbWl0LmVuZGVkID0gZW5kZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gc2VsZWN0KGV2ZW50LnZpZXcpXG4gICAgICAgICAgLm9uKFwibW91c2Vtb3ZlLmJydXNoXCIsIG1vdmVkLCB0cnVlKVxuICAgICAgICAgIC5vbihcIm1vdXNldXAuYnJ1c2hcIiwgZW5kZWQsIHRydWUpO1xuICAgICAgaWYgKGtleXMpIHZpZXdcbiAgICAgICAgICAub24oXCJrZXlkb3duLmJydXNoXCIsIGtleWRvd25lZCwgdHJ1ZSlcbiAgICAgICAgICAub24oXCJrZXl1cC5icnVzaFwiLCBrZXl1cHBlZCwgdHJ1ZSlcblxuICAgICAgZHJhZ0Rpc2FibGUoZXZlbnQudmlldyk7XG4gICAgfVxuXG4gICAgcmVkcmF3LmNhbGwodGhhdCk7XG4gICAgZW1pdC5zdGFydChldmVudCwgbW9kZS5uYW1lKTtcblxuICAgIGZ1bmN0aW9uIG1vdmVkKGV2ZW50KSB7XG4gICAgICBmb3IgKGNvbnN0IHAgb2YgZXZlbnQuY2hhbmdlZFRvdWNoZXMgfHwgW2V2ZW50XSkge1xuICAgICAgICBmb3IgKGNvbnN0IGQgb2YgcG9pbnRzKVxuICAgICAgICAgIGlmIChkLmlkZW50aWZpZXIgPT09IHAuaWRlbnRpZmllcikgZC5jdXIgPSBwb2ludGVyKHAsIHRoYXQpO1xuICAgICAgfVxuICAgICAgaWYgKHNoaWZ0aW5nICYmICFsb2NrWCAmJiAhbG9ja1kgJiYgcG9pbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBwb2ludCA9IHBvaW50c1swXTtcbiAgICAgICAgaWYgKGFicyhwb2ludC5jdXJbMF0gLSBwb2ludFswXSkgPiBhYnMocG9pbnQuY3VyWzFdIC0gcG9pbnRbMV0pKVxuICAgICAgICAgIGxvY2tZID0gdHJ1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxvY2tYID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRzKVxuICAgICAgICBpZiAocG9pbnQuY3VyKSBwb2ludFswXSA9IHBvaW50LmN1clswXSwgcG9pbnRbMV0gPSBwb2ludC5jdXJbMV07XG4gICAgICBtb3ZpbmcgPSB0cnVlO1xuICAgICAgbm9ldmVudChldmVudCk7XG4gICAgICBtb3ZlKGV2ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlKGV2ZW50KSB7XG4gICAgICBjb25zdCBwb2ludCA9IHBvaW50c1swXSwgcG9pbnQwID0gcG9pbnQucG9pbnQwO1xuICAgICAgdmFyIHQ7XG5cbiAgICAgIGR4ID0gcG9pbnRbMF0gLSBwb2ludDBbMF07XG4gICAgICBkeSA9IHBvaW50WzFdIC0gcG9pbnQwWzFdO1xuXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgY2FzZSBNT0RFX1NQQUNFOlxuICAgICAgICBjYXNlIE1PREVfRFJBRzoge1xuICAgICAgICAgIGlmIChzaWduWCkgZHggPSBtYXgoVyAtIHcwLCBtaW4oRSAtIGUwLCBkeCkpLCB3MSA9IHcwICsgZHgsIGUxID0gZTAgKyBkeDtcbiAgICAgICAgICBpZiAoc2lnblkpIGR5ID0gbWF4KE4gLSBuMCwgbWluKFMgLSBzMCwgZHkpKSwgbjEgPSBuMCArIGR5LCBzMSA9IHMwICsgZHk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBNT0RFX0hBTkRMRToge1xuICAgICAgICAgIGlmIChwb2ludHNbMV0pIHtcbiAgICAgICAgICAgIGlmIChzaWduWCkgdzEgPSBtYXgoVywgbWluKEUsIHBvaW50c1swXVswXSkpLCBlMSA9IG1heChXLCBtaW4oRSwgcG9pbnRzWzFdWzBdKSksIHNpZ25YID0gMTtcbiAgICAgICAgICAgIGlmIChzaWduWSkgbjEgPSBtYXgoTiwgbWluKFMsIHBvaW50c1swXVsxXSkpLCBzMSA9IG1heChOLCBtaW4oUywgcG9pbnRzWzFdWzFdKSksIHNpZ25ZID0gMTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNpZ25YIDwgMCkgZHggPSBtYXgoVyAtIHcwLCBtaW4oRSAtIHcwLCBkeCkpLCB3MSA9IHcwICsgZHgsIGUxID0gZTA7XG4gICAgICAgICAgICBlbHNlIGlmIChzaWduWCA+IDApIGR4ID0gbWF4KFcgLSBlMCwgbWluKEUgLSBlMCwgZHgpKSwgdzEgPSB3MCwgZTEgPSBlMCArIGR4O1xuICAgICAgICAgICAgaWYgKHNpZ25ZIDwgMCkgZHkgPSBtYXgoTiAtIG4wLCBtaW4oUyAtIG4wLCBkeSkpLCBuMSA9IG4wICsgZHksIHMxID0gczA7XG4gICAgICAgICAgICBlbHNlIGlmIChzaWduWSA+IDApIGR5ID0gbWF4KE4gLSBzMCwgbWluKFMgLSBzMCwgZHkpKSwgbjEgPSBuMCwgczEgPSBzMCArIGR5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIE1PREVfQ0VOVEVSOiB7XG4gICAgICAgICAgaWYgKHNpZ25YKSB3MSA9IG1heChXLCBtaW4oRSwgdzAgLSBkeCAqIHNpZ25YKSksIGUxID0gbWF4KFcsIG1pbihFLCBlMCArIGR4ICogc2lnblgpKTtcbiAgICAgICAgICBpZiAoc2lnblkpIG4xID0gbWF4KE4sIG1pbihTLCBuMCAtIGR5ICogc2lnblkpKSwgczEgPSBtYXgoTiwgbWluKFMsIHMwICsgZHkgKiBzaWduWSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChlMSA8IHcxKSB7XG4gICAgICAgIHNpZ25YICo9IC0xO1xuICAgICAgICB0ID0gdzAsIHcwID0gZTAsIGUwID0gdDtcbiAgICAgICAgdCA9IHcxLCB3MSA9IGUxLCBlMSA9IHQ7XG4gICAgICAgIGlmICh0eXBlIGluIGZsaXBYKSBvdmVybGF5LmF0dHIoXCJjdXJzb3JcIiwgY3Vyc29yc1t0eXBlID0gZmxpcFhbdHlwZV1dKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMxIDwgbjEpIHtcbiAgICAgICAgc2lnblkgKj0gLTE7XG4gICAgICAgIHQgPSBuMCwgbjAgPSBzMCwgczAgPSB0O1xuICAgICAgICB0ID0gbjEsIG4xID0gczEsIHMxID0gdDtcbiAgICAgICAgaWYgKHR5cGUgaW4gZmxpcFkpIG92ZXJsYXkuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzW3R5cGUgPSBmbGlwWVt0eXBlXV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUuc2VsZWN0aW9uKSBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb247IC8vIE1heSBiZSBzZXQgYnkgYnJ1c2gubW92ZSFcbiAgICAgIGlmIChsb2NrWCkgdzEgPSBzZWxlY3Rpb25bMF1bMF0sIGUxID0gc2VsZWN0aW9uWzFdWzBdO1xuICAgICAgaWYgKGxvY2tZKSBuMSA9IHNlbGVjdGlvblswXVsxXSwgczEgPSBzZWxlY3Rpb25bMV1bMV07XG5cbiAgICAgIGlmIChzZWxlY3Rpb25bMF1bMF0gIT09IHcxXG4gICAgICAgICAgfHwgc2VsZWN0aW9uWzBdWzFdICE9PSBuMVxuICAgICAgICAgIHx8IHNlbGVjdGlvblsxXVswXSAhPT0gZTFcbiAgICAgICAgICB8fCBzZWxlY3Rpb25bMV1bMV0gIT09IHMxKSB7XG4gICAgICAgIHN0YXRlLnNlbGVjdGlvbiA9IFtbdzEsIG4xXSwgW2UxLCBzMV1dO1xuICAgICAgICByZWRyYXcuY2FsbCh0aGF0KTtcbiAgICAgICAgZW1pdC5icnVzaChldmVudCwgbW9kZS5uYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmRlZChldmVudCkge1xuICAgICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgICBpZiAoZXZlbnQudG91Y2hlcykge1xuICAgICAgICBpZiAoZXZlbnQudG91Y2hlcy5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgaWYgKHRvdWNoZW5kaW5nKSBjbGVhclRpbWVvdXQodG91Y2hlbmRpbmcpO1xuICAgICAgICB0b3VjaGVuZGluZyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRvdWNoZW5kaW5nID0gbnVsbDsgfSwgNTAwKTsgLy8gR2hvc3QgY2xpY2tzIGFyZSBkZWxheWVkIVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhZ0VuYWJsZShldmVudC52aWV3LCBtb3ZpbmcpO1xuICAgICAgICB2aWV3Lm9uKFwia2V5ZG93bi5icnVzaCBrZXl1cC5icnVzaCBtb3VzZW1vdmUuYnJ1c2ggbW91c2V1cC5icnVzaFwiLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIGdyb3VwLmF0dHIoXCJwb2ludGVyLWV2ZW50c1wiLCBcImFsbFwiKTtcbiAgICAgIG92ZXJsYXkuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzLm92ZXJsYXkpO1xuICAgICAgaWYgKHN0YXRlLnNlbGVjdGlvbikgc2VsZWN0aW9uID0gc3RhdGUuc2VsZWN0aW9uOyAvLyBNYXkgYmUgc2V0IGJ5IGJydXNoLm1vdmUgKG9uIHN0YXJ0KSFcbiAgICAgIGlmIChlbXB0eShzZWxlY3Rpb24pKSBzdGF0ZS5zZWxlY3Rpb24gPSBudWxsLCByZWRyYXcuY2FsbCh0aGF0KTtcbiAgICAgIGVtaXQuZW5kKGV2ZW50LCBtb2RlLm5hbWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleWRvd25lZChldmVudCkge1xuICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMTY6IHsgLy8gU0hJRlRcbiAgICAgICAgICBzaGlmdGluZyA9IHNpZ25YICYmIHNpZ25ZO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMTg6IHsgLy8gQUxUXG4gICAgICAgICAgaWYgKG1vZGUgPT09IE1PREVfSEFORExFKSB7XG4gICAgICAgICAgICBpZiAoc2lnblgpIGUwID0gZTEgLSBkeCAqIHNpZ25YLCB3MCA9IHcxICsgZHggKiBzaWduWDtcbiAgICAgICAgICAgIGlmIChzaWduWSkgczAgPSBzMSAtIGR5ICogc2lnblksIG4wID0gbjEgKyBkeSAqIHNpZ25ZO1xuICAgICAgICAgICAgbW9kZSA9IE1PREVfQ0VOVEVSO1xuICAgICAgICAgICAgbW92ZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMzI6IHsgLy8gU1BBQ0U7IHRha2VzIHByaW9yaXR5IG92ZXIgQUxUXG4gICAgICAgICAgaWYgKG1vZGUgPT09IE1PREVfSEFORExFIHx8IG1vZGUgPT09IE1PREVfQ0VOVEVSKSB7XG4gICAgICAgICAgICBpZiAoc2lnblggPCAwKSBlMCA9IGUxIC0gZHg7IGVsc2UgaWYgKHNpZ25YID4gMCkgdzAgPSB3MSAtIGR4O1xuICAgICAgICAgICAgaWYgKHNpZ25ZIDwgMCkgczAgPSBzMSAtIGR5OyBlbHNlIGlmIChzaWduWSA+IDApIG4wID0gbjEgLSBkeTtcbiAgICAgICAgICAgIG1vZGUgPSBNT0RFX1NQQUNFO1xuICAgICAgICAgICAgb3ZlcmxheS5hdHRyKFwiY3Vyc29yXCIsIGN1cnNvcnMuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIG1vdmUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgICB9XG4gICAgICBub2V2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBrZXl1cHBlZChldmVudCkge1xuICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgIGNhc2UgMTY6IHsgLy8gU0hJRlRcbiAgICAgICAgICBpZiAoc2hpZnRpbmcpIHtcbiAgICAgICAgICAgIGxvY2tYID0gbG9ja1kgPSBzaGlmdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgbW92ZShldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgMTg6IHsgLy8gQUxUXG4gICAgICAgICAgaWYgKG1vZGUgPT09IE1PREVfQ0VOVEVSKSB7XG4gICAgICAgICAgICBpZiAoc2lnblggPCAwKSBlMCA9IGUxOyBlbHNlIGlmIChzaWduWCA+IDApIHcwID0gdzE7XG4gICAgICAgICAgICBpZiAoc2lnblkgPCAwKSBzMCA9IHMxOyBlbHNlIGlmIChzaWduWSA+IDApIG4wID0gbjE7XG4gICAgICAgICAgICBtb2RlID0gTU9ERV9IQU5ETEU7XG4gICAgICAgICAgICBtb3ZlKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAzMjogeyAvLyBTUEFDRVxuICAgICAgICAgIGlmIChtb2RlID09PSBNT0RFX1NQQUNFKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICAgIGlmIChzaWduWCkgZTAgPSBlMSAtIGR4ICogc2lnblgsIHcwID0gdzEgKyBkeCAqIHNpZ25YO1xuICAgICAgICAgICAgICBpZiAoc2lnblkpIHMwID0gczEgLSBkeSAqIHNpZ25ZLCBuMCA9IG4xICsgZHkgKiBzaWduWTtcbiAgICAgICAgICAgICAgbW9kZSA9IE1PREVfQ0VOVEVSO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25YIDwgMCkgZTAgPSBlMTsgZWxzZSBpZiAoc2lnblggPiAwKSB3MCA9IHcxO1xuICAgICAgICAgICAgICBpZiAoc2lnblkgPCAwKSBzMCA9IHMxOyBlbHNlIGlmIChzaWduWSA+IDApIG4wID0gbjE7XG4gICAgICAgICAgICAgIG1vZGUgPSBNT0RFX0hBTkRMRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG92ZXJsYXkuYXR0cihcImN1cnNvclwiLCBjdXJzb3JzW3R5cGVdKTtcbiAgICAgICAgICAgIG1vdmUoZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgICB9XG4gICAgICBub2V2ZW50KGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaG1vdmVkKGV2ZW50KSB7XG4gICAgZW1pdHRlcih0aGlzLCBhcmd1bWVudHMpLm1vdmVkKGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoZW5kZWQoZXZlbnQpIHtcbiAgICBlbWl0dGVyKHRoaXMsIGFyZ3VtZW50cykuZW5kZWQoZXZlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9fYnJ1c2ggfHwge3NlbGVjdGlvbjogbnVsbH07XG4gICAgc3RhdGUuZXh0ZW50ID0gbnVtYmVyMihleHRlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgc3RhdGUuZGltID0gZGltO1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGJydXNoLmV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChleHRlbnQgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KG51bWJlcjIoXykpLCBicnVzaCkgOiBleHRlbnQ7XG4gIH07XG5cbiAgYnJ1c2guZmlsdGVyID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGZpbHRlciA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgYnJ1c2gpIDogZmlsdGVyO1xuICB9O1xuXG4gIGJydXNoLnRvdWNoYWJsZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0b3VjaGFibGUgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIGJydXNoKSA6IHRvdWNoYWJsZTtcbiAgfTtcblxuICBicnVzaC5oYW5kbGVTaXplID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGhhbmRsZVNpemUgPSArXywgYnJ1c2gpIDogaGFuZGxlU2l6ZTtcbiAgfTtcblxuICBicnVzaC5rZXlNb2RpZmllcnMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoa2V5cyA9ICEhXywgYnJ1c2gpIDoga2V5cztcbiAgfTtcblxuICBicnVzaC5vbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2YWx1ZSA9IGxpc3RlbmVycy5vbi5hcHBseShsaXN0ZW5lcnMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHZhbHVlID09PSBsaXN0ZW5lcnMgPyBicnVzaCA6IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBicnVzaDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkKSB7XG4gIGNvbnN0IHggPSArdGhpcy5feC5jYWxsKG51bGwsIGQpLFxuICAgICAgeSA9ICt0aGlzLl95LmNhbGwobnVsbCwgZCk7XG4gIHJldHVybiBhZGQodGhpcy5jb3Zlcih4LCB5KSwgeCwgeSwgZCk7XG59XG5cbmZ1bmN0aW9uIGFkZCh0cmVlLCB4LCB5LCBkKSB7XG4gIGlmIChpc05hTih4KSB8fCBpc05hTih5KSkgcmV0dXJuIHRyZWU7IC8vIGlnbm9yZSBpbnZhbGlkIHBvaW50c1xuXG4gIHZhciBwYXJlbnQsXG4gICAgICBub2RlID0gdHJlZS5fcm9vdCxcbiAgICAgIGxlYWYgPSB7ZGF0YTogZH0sXG4gICAgICB4MCA9IHRyZWUuX3gwLFxuICAgICAgeTAgPSB0cmVlLl95MCxcbiAgICAgIHgxID0gdHJlZS5feDEsXG4gICAgICB5MSA9IHRyZWUuX3kxLFxuICAgICAgeG0sXG4gICAgICB5bSxcbiAgICAgIHhwLFxuICAgICAgeXAsXG4gICAgICByaWdodCxcbiAgICAgIGJvdHRvbSxcbiAgICAgIGksXG4gICAgICBqO1xuXG4gIC8vIElmIHRoZSB0cmVlIGlzIGVtcHR5LCBpbml0aWFsaXplIHRoZSByb290IGFzIGEgbGVhZi5cbiAgaWYgKCFub2RlKSByZXR1cm4gdHJlZS5fcm9vdCA9IGxlYWYsIHRyZWU7XG5cbiAgLy8gRmluZCB0aGUgZXhpc3RpbmcgbGVhZiBmb3IgdGhlIG5ldyBwb2ludCwgb3IgYWRkIGl0LlxuICB3aGlsZSAobm9kZS5sZW5ndGgpIHtcbiAgICBpZiAocmlnaHQgPSB4ID49ICh4bSA9ICh4MCArIHgxKSAvIDIpKSB4MCA9IHhtOyBlbHNlIHgxID0geG07XG4gICAgaWYgKGJvdHRvbSA9IHkgPj0gKHltID0gKHkwICsgeTEpIC8gMikpIHkwID0geW07IGVsc2UgeTEgPSB5bTtcbiAgICBpZiAocGFyZW50ID0gbm9kZSwgIShub2RlID0gbm9kZVtpID0gYm90dG9tIDw8IDEgfCByaWdodF0pKSByZXR1cm4gcGFyZW50W2ldID0gbGVhZiwgdHJlZTtcbiAgfVxuXG4gIC8vIElzIHRoZSBuZXcgcG9pbnQgaXMgZXhhY3RseSBjb2luY2lkZW50IHdpdGggdGhlIGV4aXN0aW5nIHBvaW50P1xuICB4cCA9ICt0cmVlLl94LmNhbGwobnVsbCwgbm9kZS5kYXRhKTtcbiAgeXAgPSArdHJlZS5feS5jYWxsKG51bGwsIG5vZGUuZGF0YSk7XG4gIGlmICh4ID09PSB4cCAmJiB5ID09PSB5cCkgcmV0dXJuIGxlYWYubmV4dCA9IG5vZGUsIHBhcmVudCA/IHBhcmVudFtpXSA9IGxlYWYgOiB0cmVlLl9yb290ID0gbGVhZiwgdHJlZTtcblxuICAvLyBPdGhlcndpc2UsIHNwbGl0IHRoZSBsZWFmIG5vZGUgdW50aWwgdGhlIG9sZCBhbmQgbmV3IHBvaW50IGFyZSBzZXBhcmF0ZWQuXG4gIGRvIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQgPyBwYXJlbnRbaV0gPSBuZXcgQXJyYXkoNCkgOiB0cmVlLl9yb290ID0gbmV3IEFycmF5KDQpO1xuICAgIGlmIChyaWdodCA9IHggPj0gKHhtID0gKHgwICsgeDEpIC8gMikpIHgwID0geG07IGVsc2UgeDEgPSB4bTtcbiAgICBpZiAoYm90dG9tID0geSA+PSAoeW0gPSAoeTAgKyB5MSkgLyAyKSkgeTAgPSB5bTsgZWxzZSB5MSA9IHltO1xuICB9IHdoaWxlICgoaSA9IGJvdHRvbSA8PCAxIHwgcmlnaHQpID09PSAoaiA9ICh5cCA+PSB5bSkgPDwgMSB8ICh4cCA+PSB4bSkpKTtcbiAgcmV0dXJuIHBhcmVudFtqXSA9IG5vZGUsIHBhcmVudFtpXSA9IGxlYWYsIHRyZWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBbGwoZGF0YSkge1xuICB2YXIgZCwgaSwgbiA9IGRhdGEubGVuZ3RoLFxuICAgICAgeCxcbiAgICAgIHksXG4gICAgICB4eiA9IG5ldyBBcnJheShuKSxcbiAgICAgIHl6ID0gbmV3IEFycmF5KG4pLFxuICAgICAgeDAgPSBJbmZpbml0eSxcbiAgICAgIHkwID0gSW5maW5pdHksXG4gICAgICB4MSA9IC1JbmZpbml0eSxcbiAgICAgIHkxID0gLUluZmluaXR5O1xuXG4gIC8vIENvbXB1dGUgdGhlIHBvaW50cyBhbmQgdGhlaXIgZXh0ZW50LlxuICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKGlzTmFOKHggPSArdGhpcy5feC5jYWxsKG51bGwsIGQgPSBkYXRhW2ldKSkgfHwgaXNOYU4oeSA9ICt0aGlzLl95LmNhbGwobnVsbCwgZCkpKSBjb250aW51ZTtcbiAgICB4eltpXSA9IHg7XG4gICAgeXpbaV0gPSB5O1xuICAgIGlmICh4IDwgeDApIHgwID0geDtcbiAgICBpZiAoeCA+IHgxKSB4MSA9IHg7XG4gICAgaWYgKHkgPCB5MCkgeTAgPSB5O1xuICAgIGlmICh5ID4geTEpIHkxID0geTtcbiAgfVxuXG4gIC8vIElmIHRoZXJlIHdlcmUgbm8gKHZhbGlkKSBwb2ludHMsIGFib3J0LlxuICBpZiAoeDAgPiB4MSB8fCB5MCA+IHkxKSByZXR1cm4gdGhpcztcblxuICAvLyBFeHBhbmQgdGhlIHRyZWUgdG8gY292ZXIgdGhlIG5ldyBwb2ludHMuXG4gIHRoaXMuY292ZXIoeDAsIHkwKS5jb3Zlcih4MSwgeTEpO1xuXG4gIC8vIEFkZCB0aGUgbmV3IHBvaW50cy5cbiAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgIGFkZCh0aGlzLCB4eltpXSwgeXpbaV0sIGRhdGFbaV0pO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeCwgeSkge1xuICBpZiAoaXNOYU4oeCA9ICt4KSB8fCBpc05hTih5ID0gK3kpKSByZXR1cm4gdGhpczsgLy8gaWdub3JlIGludmFsaWQgcG9pbnRzXG5cbiAgdmFyIHgwID0gdGhpcy5feDAsXG4gICAgICB5MCA9IHRoaXMuX3kwLFxuICAgICAgeDEgPSB0aGlzLl94MSxcbiAgICAgIHkxID0gdGhpcy5feTE7XG5cbiAgLy8gSWYgdGhlIHF1YWR0cmVlIGhhcyBubyBleHRlbnQsIGluaXRpYWxpemUgdGhlbS5cbiAgLy8gSW50ZWdlciBleHRlbnQgYXJlIG5lY2Vzc2FyeSBzbyB0aGF0IGlmIHdlIGxhdGVyIGRvdWJsZSB0aGUgZXh0ZW50LFxuICAvLyB0aGUgZXhpc3RpbmcgcXVhZHJhbnQgYm91bmRhcmllcyBkb25cdTIwMTl0IGNoYW5nZSBkdWUgdG8gZmxvYXRpbmcgcG9pbnQgZXJyb3IhXG4gIGlmIChpc05hTih4MCkpIHtcbiAgICB4MSA9ICh4MCA9IE1hdGguZmxvb3IoeCkpICsgMTtcbiAgICB5MSA9ICh5MCA9IE1hdGguZmxvb3IoeSkpICsgMTtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgZG91YmxlIHJlcGVhdGVkbHkgdG8gY292ZXIuXG4gIGVsc2Uge1xuICAgIHZhciB6ID0geDEgLSB4MCB8fCAxLFxuICAgICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBpO1xuXG4gICAgd2hpbGUgKHgwID4geCB8fCB4ID49IHgxIHx8IHkwID4geSB8fCB5ID49IHkxKSB7XG4gICAgICBpID0gKHkgPCB5MCkgPDwgMSB8ICh4IDwgeDApO1xuICAgICAgcGFyZW50ID0gbmV3IEFycmF5KDQpLCBwYXJlbnRbaV0gPSBub2RlLCBub2RlID0gcGFyZW50LCB6ICo9IDI7XG4gICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgY2FzZSAwOiB4MSA9IHgwICsgeiwgeTEgPSB5MCArIHo7IGJyZWFrO1xuICAgICAgICBjYXNlIDE6IHgwID0geDEgLSB6LCB5MSA9IHkwICsgejsgYnJlYWs7XG4gICAgICAgIGNhc2UgMjogeDEgPSB4MCArIHosIHkwID0geTEgLSB6OyBicmVhaztcbiAgICAgICAgY2FzZSAzOiB4MCA9IHgxIC0geiwgeTAgPSB5MSAtIHo7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9yb290ICYmIHRoaXMuX3Jvb3QubGVuZ3RoKSB0aGlzLl9yb290ID0gbm9kZTtcbiAgfVxuXG4gIHRoaXMuX3gwID0geDA7XG4gIHRoaXMuX3kwID0geTA7XG4gIHRoaXMuX3gxID0geDE7XG4gIHRoaXMuX3kxID0geTE7XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YSA9IFtdO1xuICB0aGlzLnZpc2l0KGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUubGVuZ3RoKSBkbyBkYXRhLnB1c2gobm9kZS5kYXRhKTsgd2hpbGUgKG5vZGUgPSBub2RlLm5leHQpXG4gIH0pO1xuICByZXR1cm4gZGF0YTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoXG4gICAgICA/IHRoaXMuY292ZXIoK19bMF1bMF0sICtfWzBdWzFdKS5jb3ZlcigrX1sxXVswXSwgK19bMV1bMV0pXG4gICAgICA6IGlzTmFOKHRoaXMuX3gwKSA/IHVuZGVmaW5lZCA6IFtbdGhpcy5feDAsIHRoaXMuX3kwXSwgW3RoaXMuX3gxLCB0aGlzLl95MV1dO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5vZGUsIHgwLCB5MCwgeDEsIHkxKSB7XG4gIHRoaXMubm9kZSA9IG5vZGU7XG4gIHRoaXMueDAgPSB4MDtcbiAgdGhpcy55MCA9IHkwO1xuICB0aGlzLngxID0geDE7XG4gIHRoaXMueTEgPSB5MTtcbn1cbiIsICJpbXBvcnQgUXVhZCBmcm9tIFwiLi9xdWFkLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHksIHJhZGl1cykge1xuICB2YXIgZGF0YSxcbiAgICAgIHgwID0gdGhpcy5feDAsXG4gICAgICB5MCA9IHRoaXMuX3kwLFxuICAgICAgeDEsXG4gICAgICB5MSxcbiAgICAgIHgyLFxuICAgICAgeTIsXG4gICAgICB4MyA9IHRoaXMuX3gxLFxuICAgICAgeTMgPSB0aGlzLl95MSxcbiAgICAgIHF1YWRzID0gW10sXG4gICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgIHEsXG4gICAgICBpO1xuXG4gIGlmIChub2RlKSBxdWFkcy5wdXNoKG5ldyBRdWFkKG5vZGUsIHgwLCB5MCwgeDMsIHkzKSk7XG4gIGlmIChyYWRpdXMgPT0gbnVsbCkgcmFkaXVzID0gSW5maW5pdHk7XG4gIGVsc2Uge1xuICAgIHgwID0geCAtIHJhZGl1cywgeTAgPSB5IC0gcmFkaXVzO1xuICAgIHgzID0geCArIHJhZGl1cywgeTMgPSB5ICsgcmFkaXVzO1xuICAgIHJhZGl1cyAqPSByYWRpdXM7XG4gIH1cblxuICB3aGlsZSAocSA9IHF1YWRzLnBvcCgpKSB7XG5cbiAgICAvLyBTdG9wIHNlYXJjaGluZyBpZiB0aGlzIHF1YWRyYW50IGNhblx1MjAxOXQgY29udGFpbiBhIGNsb3NlciBub2RlLlxuICAgIGlmICghKG5vZGUgPSBxLm5vZGUpXG4gICAgICAgIHx8ICh4MSA9IHEueDApID4geDNcbiAgICAgICAgfHwgKHkxID0gcS55MCkgPiB5M1xuICAgICAgICB8fCAoeDIgPSBxLngxKSA8IHgwXG4gICAgICAgIHx8ICh5MiA9IHEueTEpIDwgeTApIGNvbnRpbnVlO1xuXG4gICAgLy8gQmlzZWN0IHRoZSBjdXJyZW50IHF1YWRyYW50LlxuICAgIGlmIChub2RlLmxlbmd0aCkge1xuICAgICAgdmFyIHhtID0gKHgxICsgeDIpIC8gMixcbiAgICAgICAgICB5bSA9ICh5MSArIHkyKSAvIDI7XG5cbiAgICAgIHF1YWRzLnB1c2goXG4gICAgICAgIG5ldyBRdWFkKG5vZGVbM10sIHhtLCB5bSwgeDIsIHkyKSxcbiAgICAgICAgbmV3IFF1YWQobm9kZVsyXSwgeDEsIHltLCB4bSwgeTIpLFxuICAgICAgICBuZXcgUXVhZChub2RlWzFdLCB4bSwgeTEsIHgyLCB5bSksXG4gICAgICAgIG5ldyBRdWFkKG5vZGVbMF0sIHgxLCB5MSwgeG0sIHltKVxuICAgICAgKTtcblxuICAgICAgLy8gVmlzaXQgdGhlIGNsb3Nlc3QgcXVhZHJhbnQgZmlyc3QuXG4gICAgICBpZiAoaSA9ICh5ID49IHltKSA8PCAxIHwgKHggPj0geG0pKSB7XG4gICAgICAgIHEgPSBxdWFkc1txdWFkcy5sZW5ndGggLSAxXTtcbiAgICAgICAgcXVhZHNbcXVhZHMubGVuZ3RoIC0gMV0gPSBxdWFkc1txdWFkcy5sZW5ndGggLSAxIC0gaV07XG4gICAgICAgIHF1YWRzW3F1YWRzLmxlbmd0aCAtIDEgLSBpXSA9IHE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVmlzaXQgdGhpcyBwb2ludC4gKFZpc2l0aW5nIGNvaW5jaWRlbnQgcG9pbnRzIGlzblx1MjAxOXQgbmVjZXNzYXJ5ISlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBkeCA9IHggLSArdGhpcy5feC5jYWxsKG51bGwsIG5vZGUuZGF0YSksXG4gICAgICAgICAgZHkgPSB5IC0gK3RoaXMuX3kuY2FsbChudWxsLCBub2RlLmRhdGEpLFxuICAgICAgICAgIGQyID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICBpZiAoZDIgPCByYWRpdXMpIHtcbiAgICAgICAgdmFyIGQgPSBNYXRoLnNxcnQocmFkaXVzID0gZDIpO1xuICAgICAgICB4MCA9IHggLSBkLCB5MCA9IHkgLSBkO1xuICAgICAgICB4MyA9IHggKyBkLCB5MyA9IHkgKyBkO1xuICAgICAgICBkYXRhID0gbm9kZS5kYXRhO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGQpIHtcbiAgaWYgKGlzTmFOKHggPSArdGhpcy5feC5jYWxsKG51bGwsIGQpKSB8fCBpc05hTih5ID0gK3RoaXMuX3kuY2FsbChudWxsLCBkKSkpIHJldHVybiB0aGlzOyAvLyBpZ25vcmUgaW52YWxpZCBwb2ludHNcblxuICB2YXIgcGFyZW50LFxuICAgICAgbm9kZSA9IHRoaXMuX3Jvb3QsXG4gICAgICByZXRhaW5lcixcbiAgICAgIHByZXZpb3VzLFxuICAgICAgbmV4dCxcbiAgICAgIHgwID0gdGhpcy5feDAsXG4gICAgICB5MCA9IHRoaXMuX3kwLFxuICAgICAgeDEgPSB0aGlzLl94MSxcbiAgICAgIHkxID0gdGhpcy5feTEsXG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHhtLFxuICAgICAgeW0sXG4gICAgICByaWdodCxcbiAgICAgIGJvdHRvbSxcbiAgICAgIGksXG4gICAgICBqO1xuXG4gIC8vIElmIHRoZSB0cmVlIGlzIGVtcHR5LCBpbml0aWFsaXplIHRoZSByb290IGFzIGEgbGVhZi5cbiAgaWYgKCFub2RlKSByZXR1cm4gdGhpcztcblxuICAvLyBGaW5kIHRoZSBsZWFmIG5vZGUgZm9yIHRoZSBwb2ludC5cbiAgLy8gV2hpbGUgZGVzY2VuZGluZywgYWxzbyByZXRhaW4gdGhlIGRlZXBlc3QgcGFyZW50IHdpdGggYSBub24tcmVtb3ZlZCBzaWJsaW5nLlxuICBpZiAobm9kZS5sZW5ndGgpIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKHJpZ2h0ID0geCA+PSAoeG0gPSAoeDAgKyB4MSkgLyAyKSkgeDAgPSB4bTsgZWxzZSB4MSA9IHhtO1xuICAgIGlmIChib3R0b20gPSB5ID49ICh5bSA9ICh5MCArIHkxKSAvIDIpKSB5MCA9IHltOyBlbHNlIHkxID0geW07XG4gICAgaWYgKCEocGFyZW50ID0gbm9kZSwgbm9kZSA9IG5vZGVbaSA9IGJvdHRvbSA8PCAxIHwgcmlnaHRdKSkgcmV0dXJuIHRoaXM7XG4gICAgaWYgKCFub2RlLmxlbmd0aCkgYnJlYWs7XG4gICAgaWYgKHBhcmVudFsoaSArIDEpICYgM10gfHwgcGFyZW50WyhpICsgMikgJiAzXSB8fCBwYXJlbnRbKGkgKyAzKSAmIDNdKSByZXRhaW5lciA9IHBhcmVudCwgaiA9IGk7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBwb2ludCB0byByZW1vdmUuXG4gIHdoaWxlIChub2RlLmRhdGEgIT09IGQpIGlmICghKHByZXZpb3VzID0gbm9kZSwgbm9kZSA9IG5vZGUubmV4dCkpIHJldHVybiB0aGlzO1xuICBpZiAobmV4dCA9IG5vZGUubmV4dCkgZGVsZXRlIG5vZGUubmV4dDtcblxuICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgY29pbmNpZGVudCBwb2ludHMsIHJlbW92ZSBqdXN0IHRoZSBwb2ludC5cbiAgaWYgKHByZXZpb3VzKSByZXR1cm4gKG5leHQgPyBwcmV2aW91cy5uZXh0ID0gbmV4dCA6IGRlbGV0ZSBwcmV2aW91cy5uZXh0KSwgdGhpcztcblxuICAvLyBJZiB0aGlzIGlzIHRoZSByb290IHBvaW50LCByZW1vdmUgaXQuXG4gIGlmICghcGFyZW50KSByZXR1cm4gdGhpcy5fcm9vdCA9IG5leHQsIHRoaXM7XG5cbiAgLy8gUmVtb3ZlIHRoaXMgbGVhZi5cbiAgbmV4dCA/IHBhcmVudFtpXSA9IG5leHQgOiBkZWxldGUgcGFyZW50W2ldO1xuXG4gIC8vIElmIHRoZSBwYXJlbnQgbm93IGNvbnRhaW5zIGV4YWN0bHkgb25lIGxlYWYsIGNvbGxhcHNlIHN1cGVyZmx1b3VzIHBhcmVudHMuXG4gIGlmICgobm9kZSA9IHBhcmVudFswXSB8fCBwYXJlbnRbMV0gfHwgcGFyZW50WzJdIHx8IHBhcmVudFszXSlcbiAgICAgICYmIG5vZGUgPT09IChwYXJlbnRbM10gfHwgcGFyZW50WzJdIHx8IHBhcmVudFsxXSB8fCBwYXJlbnRbMF0pXG4gICAgICAmJiAhbm9kZS5sZW5ndGgpIHtcbiAgICBpZiAocmV0YWluZXIpIHJldGFpbmVyW2pdID0gbm9kZTtcbiAgICBlbHNlIHRoaXMuX3Jvb3QgPSBub2RlO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBbGwoZGF0YSkge1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGRhdGEubGVuZ3RoOyBpIDwgbjsgKytpKSB0aGlzLnJlbW92ZShkYXRhW2ldKTtcbiAgcmV0dXJuIHRoaXM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9yb290O1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIHRoaXMudmlzaXQoZnVuY3Rpb24obm9kZSkge1xuICAgIGlmICghbm9kZS5sZW5ndGgpIGRvICsrc2l6ZTsgd2hpbGUgKG5vZGUgPSBub2RlLm5leHQpXG4gIH0pO1xuICByZXR1cm4gc2l6ZTtcbn1cbiIsICJpbXBvcnQgUXVhZCBmcm9tIFwiLi9xdWFkLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBxdWFkcyA9IFtdLCBxLCBub2RlID0gdGhpcy5fcm9vdCwgY2hpbGQsIHgwLCB5MCwgeDEsIHkxO1xuICBpZiAobm9kZSkgcXVhZHMucHVzaChuZXcgUXVhZChub2RlLCB0aGlzLl94MCwgdGhpcy5feTAsIHRoaXMuX3gxLCB0aGlzLl95MSkpO1xuICB3aGlsZSAocSA9IHF1YWRzLnBvcCgpKSB7XG4gICAgaWYgKCFjYWxsYmFjayhub2RlID0gcS5ub2RlLCB4MCA9IHEueDAsIHkwID0gcS55MCwgeDEgPSBxLngxLCB5MSA9IHEueTEpICYmIG5vZGUubGVuZ3RoKSB7XG4gICAgICB2YXIgeG0gPSAoeDAgKyB4MSkgLyAyLCB5bSA9ICh5MCArIHkxKSAvIDI7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzNdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4bSwgeW0sIHgxLCB5MSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVsyXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeDAsIHltLCB4bSwgeTEpKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMV0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5MCwgeDEsIHltKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzBdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4MCwgeTAsIHhtLCB5bSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbiIsICJpbXBvcnQgUXVhZCBmcm9tIFwiLi9xdWFkLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciBxdWFkcyA9IFtdLCBuZXh0ID0gW10sIHE7XG4gIGlmICh0aGlzLl9yb290KSBxdWFkcy5wdXNoKG5ldyBRdWFkKHRoaXMuX3Jvb3QsIHRoaXMuX3gwLCB0aGlzLl95MCwgdGhpcy5feDEsIHRoaXMuX3kxKSk7XG4gIHdoaWxlIChxID0gcXVhZHMucG9wKCkpIHtcbiAgICB2YXIgbm9kZSA9IHEubm9kZTtcbiAgICBpZiAobm9kZS5sZW5ndGgpIHtcbiAgICAgIHZhciBjaGlsZCwgeDAgPSBxLngwLCB5MCA9IHEueTAsIHgxID0gcS54MSwgeTEgPSBxLnkxLCB4bSA9ICh4MCArIHgxKSAvIDIsIHltID0gKHkwICsgeTEpIC8gMjtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbMF0pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHgwLCB5MCwgeG0sIHltKSk7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlWzFdKSBxdWFkcy5wdXNoKG5ldyBRdWFkKGNoaWxkLCB4bSwgeTAsIHgxLCB5bSkpO1xuICAgICAgaWYgKGNoaWxkID0gbm9kZVsyXSkgcXVhZHMucHVzaChuZXcgUXVhZChjaGlsZCwgeDAsIHltLCB4bSwgeTEpKTtcbiAgICAgIGlmIChjaGlsZCA9IG5vZGVbM10pIHF1YWRzLnB1c2gobmV3IFF1YWQoY2hpbGQsIHhtLCB5bSwgeDEsIHkxKSk7XG4gICAgfVxuICAgIG5leHQucHVzaChxKTtcbiAgfVxuICB3aGlsZSAocSA9IG5leHQucG9wKCkpIHtcbiAgICBjYWxsYmFjayhxLm5vZGUsIHEueDAsIHEueTAsIHEueDEsIHEueTEpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0WChkKSB7XG4gIHJldHVybiBkWzBdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihfKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRoaXMuX3ggPSBfLCB0aGlzKSA6IHRoaXMuX3g7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRZKGQpIHtcbiAgcmV0dXJuIGRbMV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGhpcy5feSA9IF8sIHRoaXMpIDogdGhpcy5feTtcbn1cbiIsICJpbXBvcnQgdHJlZV9hZGQsIHthZGRBbGwgYXMgdHJlZV9hZGRBbGx9IGZyb20gXCIuL2FkZC5qc1wiO1xuaW1wb3J0IHRyZWVfY292ZXIgZnJvbSBcIi4vY292ZXIuanNcIjtcbmltcG9ydCB0cmVlX2RhdGEgZnJvbSBcIi4vZGF0YS5qc1wiO1xuaW1wb3J0IHRyZWVfZXh0ZW50IGZyb20gXCIuL2V4dGVudC5qc1wiO1xuaW1wb3J0IHRyZWVfZmluZCBmcm9tIFwiLi9maW5kLmpzXCI7XG5pbXBvcnQgdHJlZV9yZW1vdmUsIHtyZW1vdmVBbGwgYXMgdHJlZV9yZW1vdmVBbGx9IGZyb20gXCIuL3JlbW92ZS5qc1wiO1xuaW1wb3J0IHRyZWVfcm9vdCBmcm9tIFwiLi9yb290LmpzXCI7XG5pbXBvcnQgdHJlZV9zaXplIGZyb20gXCIuL3NpemUuanNcIjtcbmltcG9ydCB0cmVlX3Zpc2l0IGZyb20gXCIuL3Zpc2l0LmpzXCI7XG5pbXBvcnQgdHJlZV92aXNpdEFmdGVyIGZyb20gXCIuL3Zpc2l0QWZ0ZXIuanNcIjtcbmltcG9ydCB0cmVlX3gsIHtkZWZhdWx0WH0gZnJvbSBcIi4veC5qc1wiO1xuaW1wb3J0IHRyZWVfeSwge2RlZmF1bHRZfSBmcm9tIFwiLi95LmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHF1YWR0cmVlKG5vZGVzLCB4LCB5KSB7XG4gIHZhciB0cmVlID0gbmV3IFF1YWR0cmVlKHggPT0gbnVsbCA/IGRlZmF1bHRYIDogeCwgeSA9PSBudWxsID8gZGVmYXVsdFkgOiB5LCBOYU4sIE5hTiwgTmFOLCBOYU4pO1xuICByZXR1cm4gbm9kZXMgPT0gbnVsbCA/IHRyZWUgOiB0cmVlLmFkZEFsbChub2Rlcyk7XG59XG5cbmZ1bmN0aW9uIFF1YWR0cmVlKHgsIHksIHgwLCB5MCwgeDEsIHkxKSB7XG4gIHRoaXMuX3ggPSB4O1xuICB0aGlzLl95ID0geTtcbiAgdGhpcy5feDAgPSB4MDtcbiAgdGhpcy5feTAgPSB5MDtcbiAgdGhpcy5feDEgPSB4MTtcbiAgdGhpcy5feTEgPSB5MTtcbiAgdGhpcy5fcm9vdCA9IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gbGVhZl9jb3B5KGxlYWYpIHtcbiAgdmFyIGNvcHkgPSB7ZGF0YTogbGVhZi5kYXRhfSwgbmV4dCA9IGNvcHk7XG4gIHdoaWxlIChsZWFmID0gbGVhZi5uZXh0KSBuZXh0ID0gbmV4dC5uZXh0ID0ge2RhdGE6IGxlYWYuZGF0YX07XG4gIHJldHVybiBjb3B5O1xufVxuXG52YXIgdHJlZVByb3RvID0gcXVhZHRyZWUucHJvdG90eXBlID0gUXVhZHRyZWUucHJvdG90eXBlO1xuXG50cmVlUHJvdG8uY29weSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29weSA9IG5ldyBRdWFkdHJlZSh0aGlzLl94LCB0aGlzLl95LCB0aGlzLl94MCwgdGhpcy5feTAsIHRoaXMuX3gxLCB0aGlzLl95MSksXG4gICAgICBub2RlID0gdGhpcy5fcm9vdCxcbiAgICAgIG5vZGVzLFxuICAgICAgY2hpbGQ7XG5cbiAgaWYgKCFub2RlKSByZXR1cm4gY29weTtcblxuICBpZiAoIW5vZGUubGVuZ3RoKSByZXR1cm4gY29weS5fcm9vdCA9IGxlYWZfY29weShub2RlKSwgY29weTtcblxuICBub2RlcyA9IFt7c291cmNlOiBub2RlLCB0YXJnZXQ6IGNvcHkuX3Jvb3QgPSBuZXcgQXJyYXkoNCl9XTtcbiAgd2hpbGUgKG5vZGUgPSBub2Rlcy5wb3AoKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICBpZiAoY2hpbGQgPSBub2RlLnNvdXJjZVtpXSkge1xuICAgICAgICBpZiAoY2hpbGQubGVuZ3RoKSBub2Rlcy5wdXNoKHtzb3VyY2U6IGNoaWxkLCB0YXJnZXQ6IG5vZGUudGFyZ2V0W2ldID0gbmV3IEFycmF5KDQpfSk7XG4gICAgICAgIGVsc2Ugbm9kZS50YXJnZXRbaV0gPSBsZWFmX2NvcHkoY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3B5O1xufTtcblxudHJlZVByb3RvLmFkZCA9IHRyZWVfYWRkO1xudHJlZVByb3RvLmFkZEFsbCA9IHRyZWVfYWRkQWxsO1xudHJlZVByb3RvLmNvdmVyID0gdHJlZV9jb3ZlcjtcbnRyZWVQcm90by5kYXRhID0gdHJlZV9kYXRhO1xudHJlZVByb3RvLmV4dGVudCA9IHRyZWVfZXh0ZW50O1xudHJlZVByb3RvLmZpbmQgPSB0cmVlX2ZpbmQ7XG50cmVlUHJvdG8ucmVtb3ZlID0gdHJlZV9yZW1vdmU7XG50cmVlUHJvdG8ucmVtb3ZlQWxsID0gdHJlZV9yZW1vdmVBbGw7XG50cmVlUHJvdG8ucm9vdCA9IHRyZWVfcm9vdDtcbnRyZWVQcm90by5zaXplID0gdHJlZV9zaXplO1xudHJlZVByb3RvLnZpc2l0ID0gdHJlZV92aXNpdDtcbnRyZWVQcm90by52aXNpdEFmdGVyID0gdHJlZV92aXNpdEFmdGVyO1xudHJlZVByb3RvLnggPSB0cmVlX3g7XG50cmVlUHJvdG8ueSA9IHRyZWVfeTtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihyYW5kb20pIHtcbiAgcmV0dXJuIChyYW5kb20oKSAtIDAuNSkgKiAxZS02O1xufVxuIiwgImltcG9ydCB7cXVhZHRyZWV9IGZyb20gXCJkMy1xdWFkdHJlZVwiO1xuaW1wb3J0IGNvbnN0YW50IGZyb20gXCIuL2NvbnN0YW50LmpzXCI7XG5pbXBvcnQgamlnZ2xlIGZyb20gXCIuL2ppZ2dsZS5qc1wiO1xuXG5mdW5jdGlvbiB4KGQpIHtcbiAgcmV0dXJuIGQueCArIGQudng7XG59XG5cbmZ1bmN0aW9uIHkoZCkge1xuICByZXR1cm4gZC55ICsgZC52eTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ocmFkaXVzKSB7XG4gIHZhciBub2RlcyxcbiAgICAgIHJhZGlpLFxuICAgICAgcmFuZG9tLFxuICAgICAgc3RyZW5ndGggPSAxLFxuICAgICAgaXRlcmF0aW9ucyA9IDE7XG5cbiAgaWYgKHR5cGVvZiByYWRpdXMgIT09IFwiZnVuY3Rpb25cIikgcmFkaXVzID0gY29uc3RhbnQocmFkaXVzID09IG51bGwgPyAxIDogK3JhZGl1cyk7XG5cbiAgZnVuY3Rpb24gZm9yY2UoKSB7XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgIHRyZWUsXG4gICAgICAgIG5vZGUsXG4gICAgICAgIHhpLFxuICAgICAgICB5aSxcbiAgICAgICAgcmksXG4gICAgICAgIHJpMjtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgaXRlcmF0aW9uczsgKytrKSB7XG4gICAgICB0cmVlID0gcXVhZHRyZWUobm9kZXMsIHgsIHkpLnZpc2l0QWZ0ZXIocHJlcGFyZSk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgcmkgPSByYWRpaVtub2RlLmluZGV4XSwgcmkyID0gcmkgKiByaTtcbiAgICAgICAgeGkgPSBub2RlLnggKyBub2RlLnZ4O1xuICAgICAgICB5aSA9IG5vZGUueSArIG5vZGUudnk7XG4gICAgICAgIHRyZWUudmlzaXQoYXBwbHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5KHF1YWQsIHgwLCB5MCwgeDEsIHkxKSB7XG4gICAgICB2YXIgZGF0YSA9IHF1YWQuZGF0YSwgcmogPSBxdWFkLnIsIHIgPSByaSArIHJqO1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuaW5kZXggPiBub2RlLmluZGV4KSB7XG4gICAgICAgICAgdmFyIHggPSB4aSAtIGRhdGEueCAtIGRhdGEudngsXG4gICAgICAgICAgICAgIHkgPSB5aSAtIGRhdGEueSAtIGRhdGEudnksXG4gICAgICAgICAgICAgIGwgPSB4ICogeCArIHkgKiB5O1xuICAgICAgICAgIGlmIChsIDwgciAqIHIpIHtcbiAgICAgICAgICAgIGlmICh4ID09PSAwKSB4ID0gamlnZ2xlKHJhbmRvbSksIGwgKz0geCAqIHg7XG4gICAgICAgICAgICBpZiAoeSA9PT0gMCkgeSA9IGppZ2dsZShyYW5kb20pLCBsICs9IHkgKiB5O1xuICAgICAgICAgICAgbCA9IChyIC0gKGwgPSBNYXRoLnNxcnQobCkpKSAvIGwgKiBzdHJlbmd0aDtcbiAgICAgICAgICAgIG5vZGUudnggKz0gKHggKj0gbCkgKiAociA9IChyaiAqPSByaikgLyAocmkyICsgcmopKTtcbiAgICAgICAgICAgIG5vZGUudnkgKz0gKHkgKj0gbCkgKiByO1xuICAgICAgICAgICAgZGF0YS52eCAtPSB4ICogKHIgPSAxIC0gcik7XG4gICAgICAgICAgICBkYXRhLnZ5IC09IHkgKiByO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4geDAgPiB4aSArIHIgfHwgeDEgPCB4aSAtIHIgfHwgeTAgPiB5aSArIHIgfHwgeTEgPCB5aSAtIHI7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJlcGFyZShxdWFkKSB7XG4gICAgaWYgKHF1YWQuZGF0YSkgcmV0dXJuIHF1YWQuciA9IHJhZGlpW3F1YWQuZGF0YS5pbmRleF07XG4gICAgZm9yICh2YXIgaSA9IHF1YWQuciA9IDA7IGkgPCA0OyArK2kpIHtcbiAgICAgIGlmIChxdWFkW2ldICYmIHF1YWRbaV0uciA+IHF1YWQucikge1xuICAgICAgICBxdWFkLnIgPSBxdWFkW2ldLnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7XG4gICAgcmFkaWkgPSBuZXcgQXJyYXkobik7XG4gICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkgbm9kZSA9IG5vZGVzW2ldLCByYWRpaVtub2RlLmluZGV4XSA9ICtyYWRpdXMobm9kZSwgaSwgbm9kZXMpO1xuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF9ub2RlcywgX3JhbmRvbSkge1xuICAgIG5vZGVzID0gX25vZGVzO1xuICAgIHJhbmRvbSA9IF9yYW5kb207XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLml0ZXJhdGlvbnMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaXRlcmF0aW9ucyA9ICtfLCBmb3JjZSkgOiBpdGVyYXRpb25zO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gK18sIGZvcmNlKSA6IHN0cmVuZ3RoO1xuICB9O1xuXG4gIGZvcmNlLnJhZGl1cyA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChyYWRpdXMgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCtfKSwgaW5pdGlhbGl6ZSgpLCBmb3JjZSkgOiByYWRpdXM7XG4gIH07XG5cbiAgcmV0dXJuIGZvcmNlO1xufVxuIiwgImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuaW1wb3J0IGppZ2dsZSBmcm9tIFwiLi9qaWdnbGUuanNcIjtcblxuZnVuY3Rpb24gaW5kZXgoZCkge1xuICByZXR1cm4gZC5pbmRleDtcbn1cblxuZnVuY3Rpb24gZmluZChub2RlQnlJZCwgbm9kZUlkKSB7XG4gIHZhciBub2RlID0gbm9kZUJ5SWQuZ2V0KG5vZGVJZCk7XG4gIGlmICghbm9kZSkgdGhyb3cgbmV3IEVycm9yKFwibm9kZSBub3QgZm91bmQ6IFwiICsgbm9kZUlkKTtcbiAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGxpbmtzKSB7XG4gIHZhciBpZCA9IGluZGV4LFxuICAgICAgc3RyZW5ndGggPSBkZWZhdWx0U3RyZW5ndGgsXG4gICAgICBzdHJlbmd0aHMsXG4gICAgICBkaXN0YW5jZSA9IGNvbnN0YW50KDMwKSxcbiAgICAgIGRpc3RhbmNlcyxcbiAgICAgIG5vZGVzLFxuICAgICAgY291bnQsXG4gICAgICBiaWFzLFxuICAgICAgcmFuZG9tLFxuICAgICAgaXRlcmF0aW9ucyA9IDE7XG5cbiAgaWYgKGxpbmtzID09IG51bGwpIGxpbmtzID0gW107XG5cbiAgZnVuY3Rpb24gZGVmYXVsdFN0cmVuZ3RoKGxpbmspIHtcbiAgICByZXR1cm4gMSAvIE1hdGgubWluKGNvdW50W2xpbmsuc291cmNlLmluZGV4XSwgY291bnRbbGluay50YXJnZXQuaW5kZXhdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcmNlKGFscGhhKSB7XG4gICAgZm9yICh2YXIgayA9IDAsIG4gPSBsaW5rcy5sZW5ndGg7IGsgPCBpdGVyYXRpb25zOyArK2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsaW5rLCBzb3VyY2UsIHRhcmdldCwgeCwgeSwgbCwgYjsgaSA8IG47ICsraSkge1xuICAgICAgICBsaW5rID0gbGlua3NbaV0sIHNvdXJjZSA9IGxpbmsuc291cmNlLCB0YXJnZXQgPSBsaW5rLnRhcmdldDtcbiAgICAgICAgeCA9IHRhcmdldC54ICsgdGFyZ2V0LnZ4IC0gc291cmNlLnggLSBzb3VyY2UudnggfHwgamlnZ2xlKHJhbmRvbSk7XG4gICAgICAgIHkgPSB0YXJnZXQueSArIHRhcmdldC52eSAtIHNvdXJjZS55IC0gc291cmNlLnZ5IHx8IGppZ2dsZShyYW5kb20pO1xuICAgICAgICBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgICAgICBsID0gKGwgLSBkaXN0YW5jZXNbaV0pIC8gbCAqIGFscGhhICogc3RyZW5ndGhzW2ldO1xuICAgICAgICB4ICo9IGwsIHkgKj0gbDtcbiAgICAgICAgdGFyZ2V0LnZ4IC09IHggKiAoYiA9IGJpYXNbaV0pO1xuICAgICAgICB0YXJnZXQudnkgLT0geSAqIGI7XG4gICAgICAgIHNvdXJjZS52eCArPSB4ICogKGIgPSAxIC0gYik7XG4gICAgICAgIHNvdXJjZS52eSArPSB5ICogYjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGlmICghbm9kZXMpIHJldHVybjtcblxuICAgIHZhciBpLFxuICAgICAgICBuID0gbm9kZXMubGVuZ3RoLFxuICAgICAgICBtID0gbGlua3MubGVuZ3RoLFxuICAgICAgICBub2RlQnlJZCA9IG5ldyBNYXAobm9kZXMubWFwKChkLCBpKSA9PiBbaWQoZCwgaSwgbm9kZXMpLCBkXSkpLFxuICAgICAgICBsaW5rO1xuXG4gICAgZm9yIChpID0gMCwgY291bnQgPSBuZXcgQXJyYXkobik7IGkgPCBtOyArK2kpIHtcbiAgICAgIGxpbmsgPSBsaW5rc1tpXSwgbGluay5pbmRleCA9IGk7XG4gICAgICBpZiAodHlwZW9mIGxpbmsuc291cmNlICE9PSBcIm9iamVjdFwiKSBsaW5rLnNvdXJjZSA9IGZpbmQobm9kZUJ5SWQsIGxpbmsuc291cmNlKTtcbiAgICAgIGlmICh0eXBlb2YgbGluay50YXJnZXQgIT09IFwib2JqZWN0XCIpIGxpbmsudGFyZ2V0ID0gZmluZChub2RlQnlJZCwgbGluay50YXJnZXQpO1xuICAgICAgY291bnRbbGluay5zb3VyY2UuaW5kZXhdID0gKGNvdW50W2xpbmsuc291cmNlLmluZGV4XSB8fCAwKSArIDE7XG4gICAgICBjb3VudFtsaW5rLnRhcmdldC5pbmRleF0gPSAoY291bnRbbGluay50YXJnZXQuaW5kZXhdIHx8IDApICsgMTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBiaWFzID0gbmV3IEFycmF5KG0pOyBpIDwgbTsgKytpKSB7XG4gICAgICBsaW5rID0gbGlua3NbaV0sIGJpYXNbaV0gPSBjb3VudFtsaW5rLnNvdXJjZS5pbmRleF0gLyAoY291bnRbbGluay5zb3VyY2UuaW5kZXhdICsgY291bnRbbGluay50YXJnZXQuaW5kZXhdKTtcbiAgICB9XG5cbiAgICBzdHJlbmd0aHMgPSBuZXcgQXJyYXkobSksIGluaXRpYWxpemVTdHJlbmd0aCgpO1xuICAgIGRpc3RhbmNlcyA9IG5ldyBBcnJheShtKSwgaW5pdGlhbGl6ZURpc3RhbmNlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplU3RyZW5ndGgoKSB7XG4gICAgaWYgKCFub2RlcykgcmV0dXJuO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBsaW5rcy5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHN0cmVuZ3Roc1tpXSA9ICtzdHJlbmd0aChsaW5rc1tpXSwgaSwgbGlua3MpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVEaXN0YW5jZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGxpbmtzLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgZGlzdGFuY2VzW2ldID0gK2Rpc3RhbmNlKGxpbmtzW2ldLCBpLCBsaW5rcyk7XG4gICAgfVxuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF9ub2RlcywgX3JhbmRvbSkge1xuICAgIG5vZGVzID0gX25vZGVzO1xuICAgIHJhbmRvbSA9IF9yYW5kb207XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLmxpbmtzID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGxpbmtzID0gXywgaW5pdGlhbGl6ZSgpLCBmb3JjZSkgOiBsaW5rcztcbiAgfTtcblxuICBmb3JjZS5pZCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChpZCA9IF8sIGZvcmNlKSA6IGlkO1xuICB9O1xuXG4gIGZvcmNlLml0ZXJhdGlvbnMgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaXRlcmF0aW9ucyA9ICtfLCBmb3JjZSkgOiBpdGVyYXRpb25zO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemVTdHJlbmd0aCgpLCBmb3JjZSkgOiBzdHJlbmd0aDtcbiAgfTtcblxuICBmb3JjZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkaXN0YW5jZSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplRGlzdGFuY2UoKSwgZm9yY2UpIDogZGlzdGFuY2U7XG4gIH07XG5cbiAgcmV0dXJuIGZvcmNlO1xufVxuIiwgIi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xpbmVhcl9jb25ncnVlbnRpYWxfZ2VuZXJhdG9yI1BhcmFtZXRlcnNfaW5fY29tbW9uX3VzZVxuY29uc3QgYSA9IDE2NjQ1MjU7XG5jb25zdCBjID0gMTAxMzkwNDIyMztcbmNvbnN0IG0gPSA0Mjk0OTY3Mjk2OyAvLyAyXjMyXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICBsZXQgcyA9IDE7XG4gIHJldHVybiAoKSA9PiAocyA9IChhICogcyArIGMpICUgbSkgLyBtO1xufVxuIiwgImltcG9ydCB7ZGlzcGF0Y2h9IGZyb20gXCJkMy1kaXNwYXRjaFwiO1xuaW1wb3J0IHt0aW1lcn0gZnJvbSBcImQzLXRpbWVyXCI7XG5pbXBvcnQgbGNnIGZyb20gXCIuL2xjZy5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24geChkKSB7XG4gIHJldHVybiBkLng7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB5KGQpIHtcbiAgcmV0dXJuIGQueTtcbn1cblxudmFyIGluaXRpYWxSYWRpdXMgPSAxMCxcbiAgICBpbml0aWFsQW5nbGUgPSBNYXRoLlBJICogKDMgLSBNYXRoLnNxcnQoNSkpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihub2Rlcykge1xuICB2YXIgc2ltdWxhdGlvbixcbiAgICAgIGFscGhhID0gMSxcbiAgICAgIGFscGhhTWluID0gMC4wMDEsXG4gICAgICBhbHBoYURlY2F5ID0gMSAtIE1hdGgucG93KGFscGhhTWluLCAxIC8gMzAwKSxcbiAgICAgIGFscGhhVGFyZ2V0ID0gMCxcbiAgICAgIHZlbG9jaXR5RGVjYXkgPSAwLjYsXG4gICAgICBmb3JjZXMgPSBuZXcgTWFwKCksXG4gICAgICBzdGVwcGVyID0gdGltZXIoc3RlcCksXG4gICAgICBldmVudCA9IGRpc3BhdGNoKFwidGlja1wiLCBcImVuZFwiKSxcbiAgICAgIHJhbmRvbSA9IGxjZygpO1xuXG4gIGlmIChub2RlcyA9PSBudWxsKSBub2RlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIHN0ZXAoKSB7XG4gICAgdGljaygpO1xuICAgIGV2ZW50LmNhbGwoXCJ0aWNrXCIsIHNpbXVsYXRpb24pO1xuICAgIGlmIChhbHBoYSA8IGFscGhhTWluKSB7XG4gICAgICBzdGVwcGVyLnN0b3AoKTtcbiAgICAgIGV2ZW50LmNhbGwoXCJlbmRcIiwgc2ltdWxhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGljayhpdGVyYXRpb25zKSB7XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7XG5cbiAgICBpZiAoaXRlcmF0aW9ucyA9PT0gdW5kZWZpbmVkKSBpdGVyYXRpb25zID0gMTtcblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgaXRlcmF0aW9uczsgKytrKSB7XG4gICAgICBhbHBoYSArPSAoYWxwaGFUYXJnZXQgLSBhbHBoYSkgKiBhbHBoYURlY2F5O1xuXG4gICAgICBmb3JjZXMuZm9yRWFjaChmdW5jdGlvbihmb3JjZSkge1xuICAgICAgICBmb3JjZShhbHBoYSk7XG4gICAgICB9KTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgICBub2RlID0gbm9kZXNbaV07XG4gICAgICAgIGlmIChub2RlLmZ4ID09IG51bGwpIG5vZGUueCArPSBub2RlLnZ4ICo9IHZlbG9jaXR5RGVjYXk7XG4gICAgICAgIGVsc2Ugbm9kZS54ID0gbm9kZS5meCwgbm9kZS52eCA9IDA7XG4gICAgICAgIGlmIChub2RlLmZ5ID09IG51bGwpIG5vZGUueSArPSBub2RlLnZ5ICo9IHZlbG9jaXR5RGVjYXk7XG4gICAgICAgIGVsc2Ugbm9kZS55ID0gbm9kZS5meSwgbm9kZS52eSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpbXVsYXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplTm9kZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7IGkgPCBuOyArK2kpIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tpXSwgbm9kZS5pbmRleCA9IGk7XG4gICAgICBpZiAobm9kZS5meCAhPSBudWxsKSBub2RlLnggPSBub2RlLmZ4O1xuICAgICAgaWYgKG5vZGUuZnkgIT0gbnVsbCkgbm9kZS55ID0gbm9kZS5meTtcbiAgICAgIGlmIChpc05hTihub2RlLngpIHx8IGlzTmFOKG5vZGUueSkpIHtcbiAgICAgICAgdmFyIHJhZGl1cyA9IGluaXRpYWxSYWRpdXMgKiBNYXRoLnNxcnQoMC41ICsgaSksIGFuZ2xlID0gaSAqIGluaXRpYWxBbmdsZTtcbiAgICAgICAgbm9kZS54ID0gcmFkaXVzICogTWF0aC5jb3MoYW5nbGUpO1xuICAgICAgICBub2RlLnkgPSByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNOYU4obm9kZS52eCkgfHwgaXNOYU4obm9kZS52eSkpIHtcbiAgICAgICAgbm9kZS52eCA9IG5vZGUudnkgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemVGb3JjZShmb3JjZSkge1xuICAgIGlmIChmb3JjZS5pbml0aWFsaXplKSBmb3JjZS5pbml0aWFsaXplKG5vZGVzLCByYW5kb20pO1xuICAgIHJldHVybiBmb3JjZTtcbiAgfVxuXG4gIGluaXRpYWxpemVOb2RlcygpO1xuXG4gIHJldHVybiBzaW11bGF0aW9uID0ge1xuICAgIHRpY2s6IHRpY2ssXG5cbiAgICByZXN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzdGVwcGVyLnJlc3RhcnQoc3RlcCksIHNpbXVsYXRpb247XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN0ZXBwZXIuc3RvcCgpLCBzaW11bGF0aW9uO1xuICAgIH0sXG5cbiAgICBub2RlczogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAobm9kZXMgPSBfLCBpbml0aWFsaXplTm9kZXMoKSwgZm9yY2VzLmZvckVhY2goaW5pdGlhbGl6ZUZvcmNlKSwgc2ltdWxhdGlvbikgOiBub2RlcztcbiAgICB9LFxuXG4gICAgYWxwaGE6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGFscGhhID0gK18sIHNpbXVsYXRpb24pIDogYWxwaGE7XG4gICAgfSxcblxuICAgIGFscGhhTWluOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbHBoYU1pbiA9ICtfLCBzaW11bGF0aW9uKSA6IGFscGhhTWluO1xuICAgIH0sXG5cbiAgICBhbHBoYURlY2F5OiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbHBoYURlY2F5ID0gK18sIHNpbXVsYXRpb24pIDogK2FscGhhRGVjYXk7XG4gICAgfSxcblxuICAgIGFscGhhVGFyZ2V0OiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChhbHBoYVRhcmdldCA9ICtfLCBzaW11bGF0aW9uKSA6IGFscGhhVGFyZ2V0O1xuICAgIH0sXG5cbiAgICB2ZWxvY2l0eURlY2F5OiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh2ZWxvY2l0eURlY2F5ID0gMSAtIF8sIHNpbXVsYXRpb24pIDogMSAtIHZlbG9jaXR5RGVjYXk7XG4gICAgfSxcblxuICAgIHJhbmRvbVNvdXJjZTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAocmFuZG9tID0gXywgZm9yY2VzLmZvckVhY2goaW5pdGlhbGl6ZUZvcmNlKSwgc2ltdWxhdGlvbikgOiByYW5kb207XG4gICAgfSxcblxuICAgIGZvcmNlOiBmdW5jdGlvbihuYW1lLCBfKSB7XG4gICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyAoKF8gPT0gbnVsbCA/IGZvcmNlcy5kZWxldGUobmFtZSkgOiBmb3JjZXMuc2V0KG5hbWUsIGluaXRpYWxpemVGb3JjZShfKSkpLCBzaW11bGF0aW9uKSA6IGZvcmNlcy5nZXQobmFtZSk7XG4gICAgfSxcblxuICAgIGZpbmQ6IGZ1bmN0aW9uKHgsIHksIHJhZGl1cykge1xuICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgIG4gPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgZHgsXG4gICAgICAgICAgZHksXG4gICAgICAgICAgZDIsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBjbG9zZXN0O1xuXG4gICAgICBpZiAocmFkaXVzID09IG51bGwpIHJhZGl1cyA9IEluZmluaXR5O1xuICAgICAgZWxzZSByYWRpdXMgKj0gcmFkaXVzO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgZHggPSB4IC0gbm9kZS54O1xuICAgICAgICBkeSA9IHkgLSBub2RlLnk7XG4gICAgICAgIGQyID0gZHggKiBkeCArIGR5ICogZHk7XG4gICAgICAgIGlmIChkMiA8IHJhZGl1cykgY2xvc2VzdCA9IG5vZGUsIHJhZGl1cyA9IGQyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2xvc2VzdDtcbiAgICB9LFxuXG4gICAgb246IGZ1bmN0aW9uKG5hbWUsIF8pIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMSA/IChldmVudC5vbihuYW1lLCBfKSwgc2ltdWxhdGlvbikgOiBldmVudC5vbihuYW1lKTtcbiAgICB9XG4gIH07XG59XG4iLCAiaW1wb3J0IHtxdWFkdHJlZX0gZnJvbSBcImQzLXF1YWR0cmVlXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBqaWdnbGUgZnJvbSBcIi4vamlnZ2xlLmpzXCI7XG5pbXBvcnQge3gsIHl9IGZyb20gXCIuL3NpbXVsYXRpb24uanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHZhciBub2RlcyxcbiAgICAgIG5vZGUsXG4gICAgICByYW5kb20sXG4gICAgICBhbHBoYSxcbiAgICAgIHN0cmVuZ3RoID0gY29uc3RhbnQoLTMwKSxcbiAgICAgIHN0cmVuZ3RocyxcbiAgICAgIGRpc3RhbmNlTWluMiA9IDEsXG4gICAgICBkaXN0YW5jZU1heDIgPSBJbmZpbml0eSxcbiAgICAgIHRoZXRhMiA9IDAuODE7XG5cbiAgZnVuY3Rpb24gZm9yY2UoXykge1xuICAgIHZhciBpLCBuID0gbm9kZXMubGVuZ3RoLCB0cmVlID0gcXVhZHRyZWUobm9kZXMsIHgsIHkpLnZpc2l0QWZ0ZXIoYWNjdW11bGF0ZSk7XG4gICAgZm9yIChhbHBoYSA9IF8sIGkgPSAwOyBpIDwgbjsgKytpKSBub2RlID0gbm9kZXNbaV0sIHRyZWUudmlzaXQoYXBwbHkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIW5vZGVzKSByZXR1cm47XG4gICAgdmFyIGksIG4gPSBub2Rlcy5sZW5ndGgsIG5vZGU7XG4gICAgc3RyZW5ndGhzID0gbmV3IEFycmF5KG4pO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIG5vZGUgPSBub2Rlc1tpXSwgc3RyZW5ndGhzW25vZGUuaW5kZXhdID0gK3N0cmVuZ3RoKG5vZGUsIGksIG5vZGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFjY3VtdWxhdGUocXVhZCkge1xuICAgIHZhciBzdHJlbmd0aCA9IDAsIHEsIGMsIHdlaWdodCA9IDAsIHgsIHksIGk7XG5cbiAgICAvLyBGb3IgaW50ZXJuYWwgbm9kZXMsIGFjY3VtdWxhdGUgZm9yY2VzIGZyb20gY2hpbGQgcXVhZHJhbnRzLlxuICAgIGlmIChxdWFkLmxlbmd0aCkge1xuICAgICAgZm9yICh4ID0geSA9IGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICAgIGlmICgocSA9IHF1YWRbaV0pICYmIChjID0gTWF0aC5hYnMocS52YWx1ZSkpKSB7XG4gICAgICAgICAgc3RyZW5ndGggKz0gcS52YWx1ZSwgd2VpZ2h0ICs9IGMsIHggKz0gYyAqIHEueCwgeSArPSBjICogcS55O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBxdWFkLnggPSB4IC8gd2VpZ2h0O1xuICAgICAgcXVhZC55ID0geSAvIHdlaWdodDtcbiAgICB9XG5cbiAgICAvLyBGb3IgbGVhZiBub2RlcywgYWNjdW11bGF0ZSBmb3JjZXMgZnJvbSBjb2luY2lkZW50IHF1YWRyYW50cy5cbiAgICBlbHNlIHtcbiAgICAgIHEgPSBxdWFkO1xuICAgICAgcS54ID0gcS5kYXRhLng7XG4gICAgICBxLnkgPSBxLmRhdGEueTtcbiAgICAgIGRvIHN0cmVuZ3RoICs9IHN0cmVuZ3Roc1txLmRhdGEuaW5kZXhdO1xuICAgICAgd2hpbGUgKHEgPSBxLm5leHQpO1xuICAgIH1cblxuICAgIHF1YWQudmFsdWUgPSBzdHJlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5KHF1YWQsIHgxLCBfLCB4Mikge1xuICAgIGlmICghcXVhZC52YWx1ZSkgcmV0dXJuIHRydWU7XG5cbiAgICB2YXIgeCA9IHF1YWQueCAtIG5vZGUueCxcbiAgICAgICAgeSA9IHF1YWQueSAtIG5vZGUueSxcbiAgICAgICAgdyA9IHgyIC0geDEsXG4gICAgICAgIGwgPSB4ICogeCArIHkgKiB5O1xuXG4gICAgLy8gQXBwbHkgdGhlIEJhcm5lcy1IdXQgYXBwcm94aW1hdGlvbiBpZiBwb3NzaWJsZS5cbiAgICAvLyBMaW1pdCBmb3JjZXMgZm9yIHZlcnkgY2xvc2Ugbm9kZXM7IHJhbmRvbWl6ZSBkaXJlY3Rpb24gaWYgY29pbmNpZGVudC5cbiAgICBpZiAodyAqIHcgLyB0aGV0YTIgPCBsKSB7XG4gICAgICBpZiAobCA8IGRpc3RhbmNlTWF4Mikge1xuICAgICAgICBpZiAoeCA9PT0gMCkgeCA9IGppZ2dsZShyYW5kb20pLCBsICs9IHggKiB4O1xuICAgICAgICBpZiAoeSA9PT0gMCkgeSA9IGppZ2dsZShyYW5kb20pLCBsICs9IHkgKiB5O1xuICAgICAgICBpZiAobCA8IGRpc3RhbmNlTWluMikgbCA9IE1hdGguc3FydChkaXN0YW5jZU1pbjIgKiBsKTtcbiAgICAgICAgbm9kZS52eCArPSB4ICogcXVhZC52YWx1ZSAqIGFscGhhIC8gbDtcbiAgICAgICAgbm9kZS52eSArPSB5ICogcXVhZC52YWx1ZSAqIGFscGhhIC8gbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgcHJvY2VzcyBwb2ludHMgZGlyZWN0bHkuXG4gICAgZWxzZSBpZiAocXVhZC5sZW5ndGggfHwgbCA+PSBkaXN0YW5jZU1heDIpIHJldHVybjtcblxuICAgIC8vIExpbWl0IGZvcmNlcyBmb3IgdmVyeSBjbG9zZSBub2RlczsgcmFuZG9taXplIGRpcmVjdGlvbiBpZiBjb2luY2lkZW50LlxuICAgIGlmIChxdWFkLmRhdGEgIT09IG5vZGUgfHwgcXVhZC5uZXh0KSB7XG4gICAgICBpZiAoeCA9PT0gMCkgeCA9IGppZ2dsZShyYW5kb20pLCBsICs9IHggKiB4O1xuICAgICAgaWYgKHkgPT09IDApIHkgPSBqaWdnbGUocmFuZG9tKSwgbCArPSB5ICogeTtcbiAgICAgIGlmIChsIDwgZGlzdGFuY2VNaW4yKSBsID0gTWF0aC5zcXJ0KGRpc3RhbmNlTWluMiAqIGwpO1xuICAgIH1cblxuICAgIGRvIGlmIChxdWFkLmRhdGEgIT09IG5vZGUpIHtcbiAgICAgIHcgPSBzdHJlbmd0aHNbcXVhZC5kYXRhLmluZGV4XSAqIGFscGhhIC8gbDtcbiAgICAgIG5vZGUudnggKz0geCAqIHc7XG4gICAgICBub2RlLnZ5ICs9IHkgKiB3O1xuICAgIH0gd2hpbGUgKHF1YWQgPSBxdWFkLm5leHQpO1xuICB9XG5cbiAgZm9yY2UuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKF9ub2RlcywgX3JhbmRvbSkge1xuICAgIG5vZGVzID0gX25vZGVzO1xuICAgIHJhbmRvbSA9IF9yYW5kb207XG4gICAgaW5pdGlhbGl6ZSgpO1xuICB9O1xuXG4gIGZvcmNlLnN0cmVuZ3RoID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHN0cmVuZ3RoID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIGluaXRpYWxpemUoKSwgZm9yY2UpIDogc3RyZW5ndGg7XG4gIH07XG5cbiAgZm9yY2UuZGlzdGFuY2VNaW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZGlzdGFuY2VNaW4yID0gXyAqIF8sIGZvcmNlKSA6IE1hdGguc3FydChkaXN0YW5jZU1pbjIpO1xuICB9O1xuXG4gIGZvcmNlLmRpc3RhbmNlTWF4ID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKGRpc3RhbmNlTWF4MiA9IF8gKiBfLCBmb3JjZSkgOiBNYXRoLnNxcnQoZGlzdGFuY2VNYXgyKTtcbiAgfTtcblxuICBmb3JjZS50aGV0YSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0aGV0YTIgPSBfICogXywgZm9yY2UpIDogTWF0aC5zcXJ0KHRoZXRhMik7XG4gIH07XG5cbiAgcmV0dXJuIGZvcmNlO1xufVxuIiwgImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih4KSB7XG4gIHZhciBzdHJlbmd0aCA9IGNvbnN0YW50KDAuMSksXG4gICAgICBub2RlcyxcbiAgICAgIHN0cmVuZ3RocyxcbiAgICAgIHh6O1xuXG4gIGlmICh0eXBlb2YgeCAhPT0gXCJmdW5jdGlvblwiKSB4ID0gY29uc3RhbnQoeCA9PSBudWxsID8gMCA6ICt4KTtcblxuICBmdW5jdGlvbiBmb3JjZShhbHBoYSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbm9kZXMubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBub2RlID0gbm9kZXNbaV0sIG5vZGUudnggKz0gKHh6W2ldIC0gbm9kZS54KSAqIHN0cmVuZ3Roc1tpXSAqIGFscGhhO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCFub2RlcykgcmV0dXJuO1xuICAgIHZhciBpLCBuID0gbm9kZXMubGVuZ3RoO1xuICAgIHN0cmVuZ3RocyA9IG5ldyBBcnJheShuKTtcbiAgICB4eiA9IG5ldyBBcnJheShuKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBzdHJlbmd0aHNbaV0gPSBpc05hTih4eltpXSA9ICt4KG5vZGVzW2ldLCBpLCBub2RlcykpID8gMCA6ICtzdHJlbmd0aChub2Rlc1tpXSwgaSwgbm9kZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZvcmNlLmluaXRpYWxpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgbm9kZXMgPSBfO1xuICAgIGluaXRpYWxpemUoKTtcbiAgfTtcblxuICBmb3JjZS5zdHJlbmd0aCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzdHJlbmd0aCA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHN0cmVuZ3RoO1xuICB9O1xuXG4gIGZvcmNlLnggPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeCA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHg7XG4gIH07XG5cbiAgcmV0dXJuIGZvcmNlO1xufVxuIiwgImltcG9ydCBjb25zdGFudCBmcm9tIFwiLi9jb25zdGFudC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih5KSB7XG4gIHZhciBzdHJlbmd0aCA9IGNvbnN0YW50KDAuMSksXG4gICAgICBub2RlcyxcbiAgICAgIHN0cmVuZ3RocyxcbiAgICAgIHl6O1xuXG4gIGlmICh0eXBlb2YgeSAhPT0gXCJmdW5jdGlvblwiKSB5ID0gY29uc3RhbnQoeSA9PSBudWxsID8gMCA6ICt5KTtcblxuICBmdW5jdGlvbiBmb3JjZShhbHBoYSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBuID0gbm9kZXMubGVuZ3RoLCBub2RlOyBpIDwgbjsgKytpKSB7XG4gICAgICBub2RlID0gbm9kZXNbaV0sIG5vZGUudnkgKz0gKHl6W2ldIC0gbm9kZS55KSAqIHN0cmVuZ3Roc1tpXSAqIGFscGhhO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCFub2RlcykgcmV0dXJuO1xuICAgIHZhciBpLCBuID0gbm9kZXMubGVuZ3RoO1xuICAgIHN0cmVuZ3RocyA9IG5ldyBBcnJheShuKTtcbiAgICB5eiA9IG5ldyBBcnJheShuKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICBzdHJlbmd0aHNbaV0gPSBpc05hTih5eltpXSA9ICt5KG5vZGVzW2ldLCBpLCBub2RlcykpID8gMCA6ICtzdHJlbmd0aChub2Rlc1tpXSwgaSwgbm9kZXMpO1xuICAgIH1cbiAgfVxuXG4gIGZvcmNlLmluaXRpYWxpemUgPSBmdW5jdGlvbihfKSB7XG4gICAgbm9kZXMgPSBfO1xuICAgIGluaXRpYWxpemUoKTtcbiAgfTtcblxuICBmb3JjZS5zdHJlbmd0aCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChzdHJlbmd0aCA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHN0cmVuZ3RoO1xuICB9O1xuXG4gIGZvcmNlLnkgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoeSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoK18pLCBpbml0aWFsaXplKCksIGZvcmNlKSA6IHk7XG4gIH07XG5cbiAgcmV0dXJuIGZvcmNlO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IHggPT4gKCkgPT4geDtcbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBab29tRXZlbnQodHlwZSwge1xuICBzb3VyY2VFdmVudCxcbiAgdGFyZ2V0LFxuICB0cmFuc2Zvcm0sXG4gIGRpc3BhdGNoXG59KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICB0eXBlOiB7dmFsdWU6IHR5cGUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgc291cmNlRXZlbnQ6IHt2YWx1ZTogc291cmNlRXZlbnQsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX0sXG4gICAgdGFyZ2V0OiB7dmFsdWU6IHRhcmdldCwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfSxcbiAgICB0cmFuc2Zvcm06IHt2YWx1ZTogdHJhbnNmb3JtLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWV9LFxuICAgIF86IHt2YWx1ZTogZGlzcGF0Y2h9XG4gIH0pO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBUcmFuc2Zvcm0oaywgeCwgeSkge1xuICB0aGlzLmsgPSBrO1xuICB0aGlzLnggPSB4O1xuICB0aGlzLnkgPSB5O1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogVHJhbnNmb3JtLFxuICBzY2FsZTogZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBrID09PSAxID8gdGhpcyA6IG5ldyBUcmFuc2Zvcm0odGhpcy5rICogaywgdGhpcy54LCB0aGlzLnkpO1xuICB9LFxuICB0cmFuc2xhdGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICByZXR1cm4geCA9PT0gMCAmIHkgPT09IDAgPyB0aGlzIDogbmV3IFRyYW5zZm9ybSh0aGlzLmssIHRoaXMueCArIHRoaXMuayAqIHgsIHRoaXMueSArIHRoaXMuayAqIHkpO1xuICB9LFxuICBhcHBseTogZnVuY3Rpb24ocG9pbnQpIHtcbiAgICByZXR1cm4gW3BvaW50WzBdICogdGhpcy5rICsgdGhpcy54LCBwb2ludFsxXSAqIHRoaXMuayArIHRoaXMueV07XG4gIH0sXG4gIGFwcGx5WDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB4ICogdGhpcy5rICsgdGhpcy54O1xuICB9LFxuICBhcHBseVk6IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4geSAqIHRoaXMuayArIHRoaXMueTtcbiAgfSxcbiAgaW52ZXJ0OiBmdW5jdGlvbihsb2NhdGlvbikge1xuICAgIHJldHVybiBbKGxvY2F0aW9uWzBdIC0gdGhpcy54KSAvIHRoaXMuaywgKGxvY2F0aW9uWzFdIC0gdGhpcy55KSAvIHRoaXMua107XG4gIH0sXG4gIGludmVydFg6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gKHggLSB0aGlzLngpIC8gdGhpcy5rO1xuICB9LFxuICBpbnZlcnRZOiBmdW5jdGlvbih5KSB7XG4gICAgcmV0dXJuICh5IC0gdGhpcy55KSAvIHRoaXMuaztcbiAgfSxcbiAgcmVzY2FsZVg6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4geC5jb3B5KCkuZG9tYWluKHgucmFuZ2UoKS5tYXAodGhpcy5pbnZlcnRYLCB0aGlzKS5tYXAoeC5pbnZlcnQsIHgpKTtcbiAgfSxcbiAgcmVzY2FsZVk6IGZ1bmN0aW9uKHkpIHtcbiAgICByZXR1cm4geS5jb3B5KCkuZG9tYWluKHkucmFuZ2UoKS5tYXAodGhpcy5pbnZlcnRZLCB0aGlzKS5tYXAoeS5pbnZlcnQsIHkpKTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpIHNjYWxlKFwiICsgdGhpcy5rICsgXCIpXCI7XG4gIH1cbn07XG5cbmV4cG9ydCB2YXIgaWRlbnRpdHkgPSBuZXcgVHJhbnNmb3JtKDEsIDAsIDApO1xuXG50cmFuc2Zvcm0ucHJvdG90eXBlID0gVHJhbnNmb3JtLnByb3RvdHlwZTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhbnNmb3JtKG5vZGUpIHtcbiAgd2hpbGUgKCFub2RlLl9fem9vbSkgaWYgKCEobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkpIHJldHVybiBpZGVudGl0eTtcbiAgcmV0dXJuIG5vZGUuX196b29tO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBub3Byb3BhZ2F0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihldmVudCkge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbn1cbiIsICJpbXBvcnQge2Rpc3BhdGNofSBmcm9tIFwiZDMtZGlzcGF0Y2hcIjtcbmltcG9ydCB7ZHJhZ0Rpc2FibGUsIGRyYWdFbmFibGV9IGZyb20gXCJkMy1kcmFnXCI7XG5pbXBvcnQge2ludGVycG9sYXRlWm9vbX0gZnJvbSBcImQzLWludGVycG9sYXRlXCI7XG5pbXBvcnQge3NlbGVjdCwgcG9pbnRlcn0gZnJvbSBcImQzLXNlbGVjdGlvblwiO1xuaW1wb3J0IHtpbnRlcnJ1cHR9IGZyb20gXCJkMy10cmFuc2l0aW9uXCI7XG5pbXBvcnQgY29uc3RhbnQgZnJvbSBcIi4vY29uc3RhbnQuanNcIjtcbmltcG9ydCBab29tRXZlbnQgZnJvbSBcIi4vZXZlbnQuanNcIjtcbmltcG9ydCB7VHJhbnNmb3JtLCBpZGVudGl0eX0gZnJvbSBcIi4vdHJhbnNmb3JtLmpzXCI7XG5pbXBvcnQgbm9ldmVudCwge25vcHJvcGFnYXRpb259IGZyb20gXCIuL25vZXZlbnQuanNcIjtcblxuLy8gSWdub3JlIHJpZ2h0LWNsaWNrLCBzaW5jZSB0aGF0IHNob3VsZCBvcGVuIHRoZSBjb250ZXh0IG1lbnUuXG4vLyBleGNlcHQgZm9yIHBpbmNoLXRvLXpvb20sIHdoaWNoIGlzIHNlbnQgYXMgYSB3aGVlbCtjdHJsS2V5IGV2ZW50XG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyKGV2ZW50KSB7XG4gIHJldHVybiAoIWV2ZW50LmN0cmxLZXkgfHwgZXZlbnQudHlwZSA9PT0gJ3doZWVsJykgJiYgIWV2ZW50LmJ1dHRvbjtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdEV4dGVudCgpIHtcbiAgdmFyIGUgPSB0aGlzO1xuICBpZiAoZSBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICBlID0gZS5vd25lclNWR0VsZW1lbnQgfHwgZTtcbiAgICBpZiAoZS5oYXNBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpKSB7XG4gICAgICBlID0gZS52aWV3Qm94LmJhc2VWYWw7XG4gICAgICByZXR1cm4gW1tlLngsIGUueV0sIFtlLnggKyBlLndpZHRoLCBlLnkgKyBlLmhlaWdodF1dO1xuICAgIH1cbiAgICByZXR1cm4gW1swLCAwXSwgW2Uud2lkdGguYmFzZVZhbC52YWx1ZSwgZS5oZWlnaHQuYmFzZVZhbC52YWx1ZV1dO1xuICB9XG4gIHJldHVybiBbWzAsIDBdLCBbZS5jbGllbnRXaWR0aCwgZS5jbGllbnRIZWlnaHRdXTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRyYW5zZm9ybSgpIHtcbiAgcmV0dXJuIHRoaXMuX196b29tIHx8IGlkZW50aXR5O1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0V2hlZWxEZWx0YShldmVudCkge1xuICByZXR1cm4gLWV2ZW50LmRlbHRhWSAqIChldmVudC5kZWx0YU1vZGUgPT09IDEgPyAwLjA1IDogZXZlbnQuZGVsdGFNb2RlID8gMSA6IDAuMDAyKSAqIChldmVudC5jdHJsS2V5ID8gMTAgOiAxKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdFRvdWNoYWJsZSgpIHtcbiAgcmV0dXJuIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyB8fCAoXCJvbnRvdWNoc3RhcnRcIiBpbiB0aGlzKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbnN0cmFpbih0cmFuc2Zvcm0sIGV4dGVudCwgdHJhbnNsYXRlRXh0ZW50KSB7XG4gIHZhciBkeDAgPSB0cmFuc2Zvcm0uaW52ZXJ0WChleHRlbnRbMF1bMF0pIC0gdHJhbnNsYXRlRXh0ZW50WzBdWzBdLFxuICAgICAgZHgxID0gdHJhbnNmb3JtLmludmVydFgoZXh0ZW50WzFdWzBdKSAtIHRyYW5zbGF0ZUV4dGVudFsxXVswXSxcbiAgICAgIGR5MCA9IHRyYW5zZm9ybS5pbnZlcnRZKGV4dGVudFswXVsxXSkgLSB0cmFuc2xhdGVFeHRlbnRbMF1bMV0sXG4gICAgICBkeTEgPSB0cmFuc2Zvcm0uaW52ZXJ0WShleHRlbnRbMV1bMV0pIC0gdHJhbnNsYXRlRXh0ZW50WzFdWzFdO1xuICByZXR1cm4gdHJhbnNmb3JtLnRyYW5zbGF0ZShcbiAgICBkeDEgPiBkeDAgPyAoZHgwICsgZHgxKSAvIDIgOiBNYXRoLm1pbigwLCBkeDApIHx8IE1hdGgubWF4KDAsIGR4MSksXG4gICAgZHkxID4gZHkwID8gKGR5MCArIGR5MSkgLyAyIDogTWF0aC5taW4oMCwgZHkwKSB8fCBNYXRoLm1heCgwLCBkeTEpXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICB2YXIgZmlsdGVyID0gZGVmYXVsdEZpbHRlcixcbiAgICAgIGV4dGVudCA9IGRlZmF1bHRFeHRlbnQsXG4gICAgICBjb25zdHJhaW4gPSBkZWZhdWx0Q29uc3RyYWluLFxuICAgICAgd2hlZWxEZWx0YSA9IGRlZmF1bHRXaGVlbERlbHRhLFxuICAgICAgdG91Y2hhYmxlID0gZGVmYXVsdFRvdWNoYWJsZSxcbiAgICAgIHNjYWxlRXh0ZW50ID0gWzAsIEluZmluaXR5XSxcbiAgICAgIHRyYW5zbGF0ZUV4dGVudCA9IFtbLUluZmluaXR5LCAtSW5maW5pdHldLCBbSW5maW5pdHksIEluZmluaXR5XV0sXG4gICAgICBkdXJhdGlvbiA9IDI1MCxcbiAgICAgIGludGVycG9sYXRlID0gaW50ZXJwb2xhdGVab29tLFxuICAgICAgbGlzdGVuZXJzID0gZGlzcGF0Y2goXCJzdGFydFwiLCBcInpvb21cIiwgXCJlbmRcIiksXG4gICAgICB0b3VjaHN0YXJ0aW5nLFxuICAgICAgdG91Y2hmaXJzdCxcbiAgICAgIHRvdWNoZW5kaW5nLFxuICAgICAgdG91Y2hEZWxheSA9IDUwMCxcbiAgICAgIHdoZWVsRGVsYXkgPSAxNTAsXG4gICAgICBjbGlja0Rpc3RhbmNlMiA9IDAsXG4gICAgICB0YXBEaXN0YW5jZSA9IDEwO1xuXG4gIGZ1bmN0aW9uIHpvb20oc2VsZWN0aW9uKSB7XG4gICAgc2VsZWN0aW9uXG4gICAgICAgIC5wcm9wZXJ0eShcIl9fem9vbVwiLCBkZWZhdWx0VHJhbnNmb3JtKVxuICAgICAgICAub24oXCJ3aGVlbC56b29tXCIsIHdoZWVsZWQsIHtwYXNzaXZlOiBmYWxzZX0pXG4gICAgICAgIC5vbihcIm1vdXNlZG93bi56b29tXCIsIG1vdXNlZG93bmVkKVxuICAgICAgICAub24oXCJkYmxjbGljay56b29tXCIsIGRibGNsaWNrZWQpXG4gICAgICAuZmlsdGVyKHRvdWNoYWJsZSlcbiAgICAgICAgLm9uKFwidG91Y2hzdGFydC56b29tXCIsIHRvdWNoc3RhcnRlZClcbiAgICAgICAgLm9uKFwidG91Y2htb3ZlLnpvb21cIiwgdG91Y2htb3ZlZClcbiAgICAgICAgLm9uKFwidG91Y2hlbmQuem9vbSB0b3VjaGNhbmNlbC56b29tXCIsIHRvdWNoZW5kZWQpXG4gICAgICAgIC5zdHlsZShcIi13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvclwiLCBcInJnYmEoMCwwLDAsMClcIik7XG4gIH1cblxuICB6b29tLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHRyYW5zZm9ybSwgcG9pbnQsIGV2ZW50KSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGNvbGxlY3Rpb24uc2VsZWN0aW9uID8gY29sbGVjdGlvbi5zZWxlY3Rpb24oKSA6IGNvbGxlY3Rpb247XG4gICAgc2VsZWN0aW9uLnByb3BlcnR5KFwiX196b29tXCIsIGRlZmF1bHRUcmFuc2Zvcm0pO1xuICAgIGlmIChjb2xsZWN0aW9uICE9PSBzZWxlY3Rpb24pIHtcbiAgICAgIHNjaGVkdWxlKGNvbGxlY3Rpb24sIHRyYW5zZm9ybSwgcG9pbnQsIGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0aW9uLmludGVycnVwdCgpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGdlc3R1cmUodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIC5ldmVudChldmVudClcbiAgICAgICAgICAuc3RhcnQoKVxuICAgICAgICAgIC56b29tKG51bGwsIHR5cGVvZiB0cmFuc2Zvcm0gPT09IFwiZnVuY3Rpb25cIiA/IHRyYW5zZm9ybS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogdHJhbnNmb3JtKVxuICAgICAgICAgIC5lbmQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB6b29tLnNjYWxlQnkgPSBmdW5jdGlvbihzZWxlY3Rpb24sIGssIHAsIGV2ZW50KSB7XG4gICAgem9vbS5zY2FsZVRvKHNlbGVjdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgazAgPSB0aGlzLl9fem9vbS5rLFxuICAgICAgICAgIGsxID0gdHlwZW9mIGsgPT09IFwiZnVuY3Rpb25cIiA/IGsuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGs7XG4gICAgICByZXR1cm4gazAgKiBrMTtcbiAgICB9LCBwLCBldmVudCk7XG4gIH07XG5cbiAgem9vbS5zY2FsZVRvID0gZnVuY3Rpb24oc2VsZWN0aW9uLCBrLCBwLCBldmVudCkge1xuICAgIHpvb20udHJhbnNmb3JtKHNlbGVjdGlvbiwgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSA9IGV4dGVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpLFxuICAgICAgICAgIHQwID0gdGhpcy5fX3pvb20sXG4gICAgICAgICAgcDAgPSBwID09IG51bGwgPyBjZW50cm9pZChlKSA6IHR5cGVvZiBwID09PSBcImZ1bmN0aW9uXCIgPyBwLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBwLFxuICAgICAgICAgIHAxID0gdDAuaW52ZXJ0KHAwKSxcbiAgICAgICAgICBrMSA9IHR5cGVvZiBrID09PSBcImZ1bmN0aW9uXCIgPyBrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrO1xuICAgICAgcmV0dXJuIGNvbnN0cmFpbih0cmFuc2xhdGUoc2NhbGUodDAsIGsxKSwgcDAsIHAxKSwgZSwgdHJhbnNsYXRlRXh0ZW50KTtcbiAgICB9LCBwLCBldmVudCk7XG4gIH07XG5cbiAgem9vbS50cmFuc2xhdGVCeSA9IGZ1bmN0aW9uKHNlbGVjdGlvbiwgeCwgeSwgZXZlbnQpIHtcbiAgICB6b29tLnRyYW5zZm9ybShzZWxlY3Rpb24sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnN0cmFpbih0aGlzLl9fem9vbS50cmFuc2xhdGUoXG4gICAgICAgIHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyB4LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiB4LFxuICAgICAgICB0eXBlb2YgeSA9PT0gXCJmdW5jdGlvblwiID8geS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogeVxuICAgICAgKSwgZXh0ZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRyYW5zbGF0ZUV4dGVudCk7XG4gICAgfSwgbnVsbCwgZXZlbnQpO1xuICB9O1xuXG4gIHpvb20udHJhbnNsYXRlVG8gPSBmdW5jdGlvbihzZWxlY3Rpb24sIHgsIHksIHAsIGV2ZW50KSB7XG4gICAgem9vbS50cmFuc2Zvcm0oc2VsZWN0aW9uLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlID0gZXh0ZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksXG4gICAgICAgICAgdCA9IHRoaXMuX196b29tLFxuICAgICAgICAgIHAwID0gcCA9PSBudWxsID8gY2VudHJvaWQoZSkgOiB0eXBlb2YgcCA9PT0gXCJmdW5jdGlvblwiID8gcC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogcDtcbiAgICAgIHJldHVybiBjb25zdHJhaW4oaWRlbnRpdHkudHJhbnNsYXRlKHAwWzBdLCBwMFsxXSkuc2NhbGUodC5rKS50cmFuc2xhdGUoXG4gICAgICAgIHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgPyAteC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogLXgsXG4gICAgICAgIHR5cGVvZiB5ID09PSBcImZ1bmN0aW9uXCIgPyAteS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogLXlcbiAgICAgICksIGUsIHRyYW5zbGF0ZUV4dGVudCk7XG4gICAgfSwgcCwgZXZlbnQpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHNjYWxlKHRyYW5zZm9ybSwgaykge1xuICAgIGsgPSBNYXRoLm1heChzY2FsZUV4dGVudFswXSwgTWF0aC5taW4oc2NhbGVFeHRlbnRbMV0sIGspKTtcbiAgICByZXR1cm4gayA9PT0gdHJhbnNmb3JtLmsgPyB0cmFuc2Zvcm0gOiBuZXcgVHJhbnNmb3JtKGssIHRyYW5zZm9ybS54LCB0cmFuc2Zvcm0ueSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2xhdGUodHJhbnNmb3JtLCBwMCwgcDEpIHtcbiAgICB2YXIgeCA9IHAwWzBdIC0gcDFbMF0gKiB0cmFuc2Zvcm0uaywgeSA9IHAwWzFdIC0gcDFbMV0gKiB0cmFuc2Zvcm0uaztcbiAgICByZXR1cm4geCA9PT0gdHJhbnNmb3JtLnggJiYgeSA9PT0gdHJhbnNmb3JtLnkgPyB0cmFuc2Zvcm0gOiBuZXcgVHJhbnNmb3JtKHRyYW5zZm9ybS5rLCB4LCB5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNlbnRyb2lkKGV4dGVudCkge1xuICAgIHJldHVybiBbKCtleHRlbnRbMF1bMF0gKyArZXh0ZW50WzFdWzBdKSAvIDIsICgrZXh0ZW50WzBdWzFdICsgK2V4dGVudFsxXVsxXSkgLyAyXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlKHRyYW5zaXRpb24sIHRyYW5zZm9ybSwgcG9pbnQsIGV2ZW50KSB7XG4gICAgdHJhbnNpdGlvblxuICAgICAgICAub24oXCJzdGFydC56b29tXCIsIGZ1bmN0aW9uKCkgeyBnZXN0dXJlKHRoaXMsIGFyZ3VtZW50cykuZXZlbnQoZXZlbnQpLnN0YXJ0KCk7IH0pXG4gICAgICAgIC5vbihcImludGVycnVwdC56b29tIGVuZC56b29tXCIsIGZ1bmN0aW9uKCkgeyBnZXN0dXJlKHRoaXMsIGFyZ3VtZW50cykuZXZlbnQoZXZlbnQpLmVuZCgpOyB9KVxuICAgICAgICAudHdlZW4oXCJ6b29tXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgICAgZyA9IGdlc3R1cmUodGhhdCwgYXJncykuZXZlbnQoZXZlbnQpLFxuICAgICAgICAgICAgICBlID0gZXh0ZW50LmFwcGx5KHRoYXQsIGFyZ3MpLFxuICAgICAgICAgICAgICBwID0gcG9pbnQgPT0gbnVsbCA/IGNlbnRyb2lkKGUpIDogdHlwZW9mIHBvaW50ID09PSBcImZ1bmN0aW9uXCIgPyBwb2ludC5hcHBseSh0aGF0LCBhcmdzKSA6IHBvaW50LFxuICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoZVsxXVswXSAtIGVbMF1bMF0sIGVbMV1bMV0gLSBlWzBdWzFdKSxcbiAgICAgICAgICAgICAgYSA9IHRoYXQuX196b29tLFxuICAgICAgICAgICAgICBiID0gdHlwZW9mIHRyYW5zZm9ybSA9PT0gXCJmdW5jdGlvblwiID8gdHJhbnNmb3JtLmFwcGx5KHRoYXQsIGFyZ3MpIDogdHJhbnNmb3JtLFxuICAgICAgICAgICAgICBpID0gaW50ZXJwb2xhdGUoYS5pbnZlcnQocCkuY29uY2F0KHcgLyBhLmspLCBiLmludmVydChwKS5jb25jYXQodyAvIGIuaykpO1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgICAgICBpZiAodCA9PT0gMSkgdCA9IGI7IC8vIEF2b2lkIHJvdW5kaW5nIGVycm9yIG9uIGVuZC5cbiAgICAgICAgICAgIGVsc2UgeyB2YXIgbCA9IGkodCksIGsgPSB3IC8gbFsyXTsgdCA9IG5ldyBUcmFuc2Zvcm0oaywgcFswXSAtIGxbMF0gKiBrLCBwWzFdIC0gbFsxXSAqIGspOyB9XG4gICAgICAgICAgICBnLnpvb20obnVsbCwgdCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXN0dXJlKHRoYXQsIGFyZ3MsIGNsZWFuKSB7XG4gICAgcmV0dXJuICghY2xlYW4gJiYgdGhhdC5fX3pvb21pbmcpIHx8IG5ldyBHZXN0dXJlKHRoYXQsIGFyZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gR2VzdHVyZSh0aGF0LCBhcmdzKSB7XG4gICAgdGhpcy50aGF0ID0gdGhhdDtcbiAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIHRoaXMuYWN0aXZlID0gMDtcbiAgICB0aGlzLnNvdXJjZUV2ZW50ID0gbnVsbDtcbiAgICB0aGlzLmV4dGVudCA9IGV4dGVudC5hcHBseSh0aGF0LCBhcmdzKTtcbiAgICB0aGlzLnRhcHMgPSAwO1xuICB9XG5cbiAgR2VzdHVyZS5wcm90b3R5cGUgPSB7XG4gICAgZXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQpIHRoaXMuc291cmNlRXZlbnQgPSBldmVudDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCsrdGhpcy5hY3RpdmUgPT09IDEpIHtcbiAgICAgICAgdGhpcy50aGF0Ll9fem9vbWluZyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZW1pdChcInN0YXJ0XCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB6b29tOiBmdW5jdGlvbihrZXksIHRyYW5zZm9ybSkge1xuICAgICAgaWYgKHRoaXMubW91c2UgJiYga2V5ICE9PSBcIm1vdXNlXCIpIHRoaXMubW91c2VbMV0gPSB0cmFuc2Zvcm0uaW52ZXJ0KHRoaXMubW91c2VbMF0pO1xuICAgICAgaWYgKHRoaXMudG91Y2gwICYmIGtleSAhPT0gXCJ0b3VjaFwiKSB0aGlzLnRvdWNoMFsxXSA9IHRyYW5zZm9ybS5pbnZlcnQodGhpcy50b3VjaDBbMF0pO1xuICAgICAgaWYgKHRoaXMudG91Y2gxICYmIGtleSAhPT0gXCJ0b3VjaFwiKSB0aGlzLnRvdWNoMVsxXSA9IHRyYW5zZm9ybS5pbnZlcnQodGhpcy50b3VjaDFbMF0pO1xuICAgICAgdGhpcy50aGF0Ll9fem9vbSA9IHRyYW5zZm9ybTtcbiAgICAgIHRoaXMuZW1pdChcInpvb21cIik7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgICBkZWxldGUgdGhpcy50aGF0Ll9fem9vbWluZztcbiAgICAgICAgdGhpcy5lbWl0KFwiZW5kXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBlbWl0OiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICB2YXIgZCA9IHNlbGVjdCh0aGlzLnRoYXQpLmRhdHVtKCk7XG4gICAgICBsaXN0ZW5lcnMuY2FsbChcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdGhpcy50aGF0LFxuICAgICAgICBuZXcgWm9vbUV2ZW50KHR5cGUsIHtcbiAgICAgICAgICBzb3VyY2VFdmVudDogdGhpcy5zb3VyY2VFdmVudCxcbiAgICAgICAgICB0YXJnZXQ6IHpvb20sXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMudGhhdC5fX3pvb20sXG4gICAgICAgICAgZGlzcGF0Y2g6IGxpc3RlbmVyc1xuICAgICAgICB9KSxcbiAgICAgICAgZFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gd2hlZWxlZChldmVudCwgLi4uYXJncykge1xuICAgIGlmICghZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybjtcbiAgICB2YXIgZyA9IGdlc3R1cmUodGhpcywgYXJncykuZXZlbnQoZXZlbnQpLFxuICAgICAgICB0ID0gdGhpcy5fX3pvb20sXG4gICAgICAgIGsgPSBNYXRoLm1heChzY2FsZUV4dGVudFswXSwgTWF0aC5taW4oc2NhbGVFeHRlbnRbMV0sIHQuayAqIE1hdGgucG93KDIsIHdoZWVsRGVsdGEuYXBwbHkodGhpcywgYXJndW1lbnRzKSkpKSxcbiAgICAgICAgcCA9IHBvaW50ZXIoZXZlbnQpO1xuXG4gICAgLy8gSWYgdGhlIG1vdXNlIGlzIGluIHRoZSBzYW1lIGxvY2F0aW9uIGFzIGJlZm9yZSwgcmV1c2UgaXQuXG4gICAgLy8gSWYgdGhlcmUgd2VyZSByZWNlbnQgd2hlZWwgZXZlbnRzLCByZXNldCB0aGUgd2hlZWwgaWRsZSB0aW1lb3V0LlxuICAgIGlmIChnLndoZWVsKSB7XG4gICAgICBpZiAoZy5tb3VzZVswXVswXSAhPT0gcFswXSB8fCBnLm1vdXNlWzBdWzFdICE9PSBwWzFdKSB7XG4gICAgICAgIGcubW91c2VbMV0gPSB0LmludmVydChnLm1vdXNlWzBdID0gcCk7XG4gICAgICB9XG4gICAgICBjbGVhclRpbWVvdXQoZy53aGVlbCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3aGVlbCBldmVudCB3b25cdTIwMTl0IHRyaWdnZXIgYSB0cmFuc2Zvcm0gY2hhbmdlLCBpZ25vcmUgaXQuXG4gICAgZWxzZSBpZiAodC5rID09PSBrKSByZXR1cm47XG5cbiAgICAvLyBPdGhlcndpc2UsIGNhcHR1cmUgdGhlIG1vdXNlIHBvaW50IGFuZCBsb2NhdGlvbiBhdCB0aGUgc3RhcnQuXG4gICAgZWxzZSB7XG4gICAgICBnLm1vdXNlID0gW3AsIHQuaW52ZXJ0KHApXTtcbiAgICAgIGludGVycnVwdCh0aGlzKTtcbiAgICAgIGcuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBub2V2ZW50KGV2ZW50KTtcbiAgICBnLndoZWVsID0gc2V0VGltZW91dCh3aGVlbGlkbGVkLCB3aGVlbERlbGF5KTtcbiAgICBnLnpvb20oXCJtb3VzZVwiLCBjb25zdHJhaW4odHJhbnNsYXRlKHNjYWxlKHQsIGspLCBnLm1vdXNlWzBdLCBnLm1vdXNlWzFdKSwgZy5leHRlbnQsIHRyYW5zbGF0ZUV4dGVudCkpO1xuXG4gICAgZnVuY3Rpb24gd2hlZWxpZGxlZCgpIHtcbiAgICAgIGcud2hlZWwgPSBudWxsO1xuICAgICAgZy5lbmQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZWRvd25lZChldmVudCwgLi4uYXJncykge1xuICAgIGlmICh0b3VjaGVuZGluZyB8fCAhZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRhcmdldCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIGcgPSBnZXN0dXJlKHRoaXMsIGFyZ3MsIHRydWUpLmV2ZW50KGV2ZW50KSxcbiAgICAgICAgdiA9IHNlbGVjdChldmVudC52aWV3KS5vbihcIm1vdXNlbW92ZS56b29tXCIsIG1vdXNlbW92ZWQsIHRydWUpLm9uKFwibW91c2V1cC56b29tXCIsIG1vdXNldXBwZWQsIHRydWUpLFxuICAgICAgICBwID0gcG9pbnRlcihldmVudCwgY3VycmVudFRhcmdldCksXG4gICAgICAgIHgwID0gZXZlbnQuY2xpZW50WCxcbiAgICAgICAgeTAgPSBldmVudC5jbGllbnRZO1xuXG4gICAgZHJhZ0Rpc2FibGUoZXZlbnQudmlldyk7XG4gICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgZy5tb3VzZSA9IFtwLCB0aGlzLl9fem9vbS5pbnZlcnQocCldO1xuICAgIGludGVycnVwdCh0aGlzKTtcbiAgICBnLnN0YXJ0KCk7XG5cbiAgICBmdW5jdGlvbiBtb3VzZW1vdmVkKGV2ZW50KSB7XG4gICAgICBub2V2ZW50KGV2ZW50KTtcbiAgICAgIGlmICghZy5tb3ZlZCkge1xuICAgICAgICB2YXIgZHggPSBldmVudC5jbGllbnRYIC0geDAsIGR5ID0gZXZlbnQuY2xpZW50WSAtIHkwO1xuICAgICAgICBnLm1vdmVkID0gZHggKiBkeCArIGR5ICogZHkgPiBjbGlja0Rpc3RhbmNlMjtcbiAgICAgIH1cbiAgICAgIGcuZXZlbnQoZXZlbnQpXG4gICAgICAgLnpvb20oXCJtb3VzZVwiLCBjb25zdHJhaW4odHJhbnNsYXRlKGcudGhhdC5fX3pvb20sIGcubW91c2VbMF0gPSBwb2ludGVyKGV2ZW50LCBjdXJyZW50VGFyZ2V0KSwgZy5tb3VzZVsxXSksIGcuZXh0ZW50LCB0cmFuc2xhdGVFeHRlbnQpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZXVwcGVkKGV2ZW50KSB7XG4gICAgICB2Lm9uKFwibW91c2Vtb3ZlLnpvb20gbW91c2V1cC56b29tXCIsIG51bGwpO1xuICAgICAgZHJhZ0VuYWJsZShldmVudC52aWV3LCBnLm1vdmVkKTtcbiAgICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgICAgZy5ldmVudChldmVudCkuZW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGJsY2xpY2tlZChldmVudCwgLi4uYXJncykge1xuICAgIGlmICghZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybjtcbiAgICB2YXIgdDAgPSB0aGlzLl9fem9vbSxcbiAgICAgICAgcDAgPSBwb2ludGVyKGV2ZW50LmNoYW5nZWRUb3VjaGVzID8gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0gOiBldmVudCwgdGhpcyksXG4gICAgICAgIHAxID0gdDAuaW52ZXJ0KHAwKSxcbiAgICAgICAgazEgPSB0MC5rICogKGV2ZW50LnNoaWZ0S2V5ID8gMC41IDogMiksXG4gICAgICAgIHQxID0gY29uc3RyYWluKHRyYW5zbGF0ZShzY2FsZSh0MCwgazEpLCBwMCwgcDEpLCBleHRlbnQuYXBwbHkodGhpcywgYXJncyksIHRyYW5zbGF0ZUV4dGVudCk7XG5cbiAgICBub2V2ZW50KGV2ZW50KTtcbiAgICBpZiAoZHVyYXRpb24gPiAwKSBzZWxlY3QodGhpcykudHJhbnNpdGlvbigpLmR1cmF0aW9uKGR1cmF0aW9uKS5jYWxsKHNjaGVkdWxlLCB0MSwgcDAsIGV2ZW50KTtcbiAgICBlbHNlIHNlbGVjdCh0aGlzKS5jYWxsKHpvb20udHJhbnNmb3JtLCB0MSwgcDAsIGV2ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvdWNoc3RhcnRlZChldmVudCwgLi4uYXJncykge1xuICAgIGlmICghZmlsdGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHJldHVybjtcbiAgICB2YXIgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXMsXG4gICAgICAgIG4gPSB0b3VjaGVzLmxlbmd0aCxcbiAgICAgICAgZyA9IGdlc3R1cmUodGhpcywgYXJncywgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID09PSBuKS5ldmVudChldmVudCksXG4gICAgICAgIHN0YXJ0ZWQsIGksIHQsIHA7XG5cbiAgICBub3Byb3BhZ2F0aW9uKGV2ZW50KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICB0ID0gdG91Y2hlc1tpXSwgcCA9IHBvaW50ZXIodCwgdGhpcyk7XG4gICAgICBwID0gW3AsIHRoaXMuX196b29tLmludmVydChwKSwgdC5pZGVudGlmaWVyXTtcbiAgICAgIGlmICghZy50b3VjaDApIGcudG91Y2gwID0gcCwgc3RhcnRlZCA9IHRydWUsIGcudGFwcyA9IDEgKyAhIXRvdWNoc3RhcnRpbmc7XG4gICAgICBlbHNlIGlmICghZy50b3VjaDEgJiYgZy50b3VjaDBbMl0gIT09IHBbMl0pIGcudG91Y2gxID0gcCwgZy50YXBzID0gMDtcbiAgICB9XG5cbiAgICBpZiAodG91Y2hzdGFydGluZykgdG91Y2hzdGFydGluZyA9IGNsZWFyVGltZW91dCh0b3VjaHN0YXJ0aW5nKTtcblxuICAgIGlmIChzdGFydGVkKSB7XG4gICAgICBpZiAoZy50YXBzIDwgMikgdG91Y2hmaXJzdCA9IHBbMF0sIHRvdWNoc3RhcnRpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0b3VjaHN0YXJ0aW5nID0gbnVsbDsgfSwgdG91Y2hEZWxheSk7XG4gICAgICBpbnRlcnJ1cHQodGhpcyk7XG4gICAgICBnLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG91Y2htb3ZlZChldmVudCwgLi4uYXJncykge1xuICAgIGlmICghdGhpcy5fX3pvb21pbmcpIHJldHVybjtcbiAgICB2YXIgZyA9IGdlc3R1cmUodGhpcywgYXJncykuZXZlbnQoZXZlbnQpLFxuICAgICAgICB0b3VjaGVzID0gZXZlbnQuY2hhbmdlZFRvdWNoZXMsXG4gICAgICAgIG4gPSB0b3VjaGVzLmxlbmd0aCwgaSwgdCwgcCwgbDtcblxuICAgIG5vZXZlbnQoZXZlbnQpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIHQgPSB0b3VjaGVzW2ldLCBwID0gcG9pbnRlcih0LCB0aGlzKTtcbiAgICAgIGlmIChnLnRvdWNoMCAmJiBnLnRvdWNoMFsyXSA9PT0gdC5pZGVudGlmaWVyKSBnLnRvdWNoMFswXSA9IHA7XG4gICAgICBlbHNlIGlmIChnLnRvdWNoMSAmJiBnLnRvdWNoMVsyXSA9PT0gdC5pZGVudGlmaWVyKSBnLnRvdWNoMVswXSA9IHA7XG4gICAgfVxuICAgIHQgPSBnLnRoYXQuX196b29tO1xuICAgIGlmIChnLnRvdWNoMSkge1xuICAgICAgdmFyIHAwID0gZy50b3VjaDBbMF0sIGwwID0gZy50b3VjaDBbMV0sXG4gICAgICAgICAgcDEgPSBnLnRvdWNoMVswXSwgbDEgPSBnLnRvdWNoMVsxXSxcbiAgICAgICAgICBkcCA9IChkcCA9IHAxWzBdIC0gcDBbMF0pICogZHAgKyAoZHAgPSBwMVsxXSAtIHAwWzFdKSAqIGRwLFxuICAgICAgICAgIGRsID0gKGRsID0gbDFbMF0gLSBsMFswXSkgKiBkbCArIChkbCA9IGwxWzFdIC0gbDBbMV0pICogZGw7XG4gICAgICB0ID0gc2NhbGUodCwgTWF0aC5zcXJ0KGRwIC8gZGwpKTtcbiAgICAgIHAgPSBbKHAwWzBdICsgcDFbMF0pIC8gMiwgKHAwWzFdICsgcDFbMV0pIC8gMl07XG4gICAgICBsID0gWyhsMFswXSArIGwxWzBdKSAvIDIsIChsMFsxXSArIGwxWzFdKSAvIDJdO1xuICAgIH1cbiAgICBlbHNlIGlmIChnLnRvdWNoMCkgcCA9IGcudG91Y2gwWzBdLCBsID0gZy50b3VjaDBbMV07XG4gICAgZWxzZSByZXR1cm47XG5cbiAgICBnLnpvb20oXCJ0b3VjaFwiLCBjb25zdHJhaW4odHJhbnNsYXRlKHQsIHAsIGwpLCBnLmV4dGVudCwgdHJhbnNsYXRlRXh0ZW50KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0b3VjaGVuZGVkKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLl9fem9vbWluZykgcmV0dXJuO1xuICAgIHZhciBnID0gZ2VzdHVyZSh0aGlzLCBhcmdzKS5ldmVudChldmVudCksXG4gICAgICAgIHRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcyxcbiAgICAgICAgbiA9IHRvdWNoZXMubGVuZ3RoLCBpLCB0O1xuXG4gICAgbm9wcm9wYWdhdGlvbihldmVudCk7XG4gICAgaWYgKHRvdWNoZW5kaW5nKSBjbGVhclRpbWVvdXQodG91Y2hlbmRpbmcpO1xuICAgIHRvdWNoZW5kaW5nID0gc2V0VGltZW91dChmdW5jdGlvbigpIHsgdG91Y2hlbmRpbmcgPSBudWxsOyB9LCB0b3VjaERlbGF5KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICB0ID0gdG91Y2hlc1tpXTtcbiAgICAgIGlmIChnLnRvdWNoMCAmJiBnLnRvdWNoMFsyXSA9PT0gdC5pZGVudGlmaWVyKSBkZWxldGUgZy50b3VjaDA7XG4gICAgICBlbHNlIGlmIChnLnRvdWNoMSAmJiBnLnRvdWNoMVsyXSA9PT0gdC5pZGVudGlmaWVyKSBkZWxldGUgZy50b3VjaDE7XG4gICAgfVxuICAgIGlmIChnLnRvdWNoMSAmJiAhZy50b3VjaDApIGcudG91Y2gwID0gZy50b3VjaDEsIGRlbGV0ZSBnLnRvdWNoMTtcbiAgICBpZiAoZy50b3VjaDApIGcudG91Y2gwWzFdID0gdGhpcy5fX3pvb20uaW52ZXJ0KGcudG91Y2gwWzBdKTtcbiAgICBlbHNlIHtcbiAgICAgIGcuZW5kKCk7XG4gICAgICAvLyBJZiB0aGlzIHdhcyBhIGRibHRhcCwgcmVyb3V0ZSB0byB0aGUgKG9wdGlvbmFsKSBkYmxjbGljay56b29tIGhhbmRsZXIuXG4gICAgICBpZiAoZy50YXBzID09PSAyKSB7XG4gICAgICAgIHQgPSBwb2ludGVyKHQsIHRoaXMpO1xuICAgICAgICBpZiAoTWF0aC5oeXBvdCh0b3VjaGZpcnN0WzBdIC0gdFswXSwgdG91Y2hmaXJzdFsxXSAtIHRbMV0pIDwgdGFwRGlzdGFuY2UpIHtcbiAgICAgICAgICB2YXIgcCA9IHNlbGVjdCh0aGlzKS5vbihcImRibGNsaWNrLnpvb21cIik7XG4gICAgICAgICAgaWYgKHApIHAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHpvb20ud2hlZWxEZWx0YSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh3aGVlbERlbHRhID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudCgrXyksIHpvb20pIDogd2hlZWxEZWx0YTtcbiAgfTtcblxuICB6b29tLmZpbHRlciA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChmaWx0ZXIgPSB0eXBlb2YgXyA9PT0gXCJmdW5jdGlvblwiID8gXyA6IGNvbnN0YW50KCEhXyksIHpvb20pIDogZmlsdGVyO1xuICB9O1xuXG4gIHpvb20udG91Y2hhYmxlID0gZnVuY3Rpb24oXykge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID8gKHRvdWNoYWJsZSA9IHR5cGVvZiBfID09PSBcImZ1bmN0aW9uXCIgPyBfIDogY29uc3RhbnQoISFfKSwgem9vbSkgOiB0b3VjaGFibGU7XG4gIH07XG5cbiAgem9vbS5leHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoZXh0ZW50ID0gdHlwZW9mIF8gPT09IFwiZnVuY3Rpb25cIiA/IF8gOiBjb25zdGFudChbWytfWzBdWzBdLCArX1swXVsxXV0sIFsrX1sxXVswXSwgK19bMV1bMV1dXSksIHpvb20pIDogZXh0ZW50O1xuICB9O1xuXG4gIHpvb20uc2NhbGVFeHRlbnQgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoc2NhbGVFeHRlbnRbMF0gPSArX1swXSwgc2NhbGVFeHRlbnRbMV0gPSArX1sxXSwgem9vbSkgOiBbc2NhbGVFeHRlbnRbMF0sIHNjYWxlRXh0ZW50WzFdXTtcbiAgfTtcblxuICB6b29tLnRyYW5zbGF0ZUV4dGVudCA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/ICh0cmFuc2xhdGVFeHRlbnRbMF1bMF0gPSArX1swXVswXSwgdHJhbnNsYXRlRXh0ZW50WzFdWzBdID0gK19bMV1bMF0sIHRyYW5zbGF0ZUV4dGVudFswXVsxXSA9ICtfWzBdWzFdLCB0cmFuc2xhdGVFeHRlbnRbMV1bMV0gPSArX1sxXVsxXSwgem9vbSkgOiBbW3RyYW5zbGF0ZUV4dGVudFswXVswXSwgdHJhbnNsYXRlRXh0ZW50WzBdWzFdXSwgW3RyYW5zbGF0ZUV4dGVudFsxXVswXSwgdHJhbnNsYXRlRXh0ZW50WzFdWzFdXV07XG4gIH07XG5cbiAgem9vbS5jb25zdHJhaW4gPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoY29uc3RyYWluID0gXywgem9vbSkgOiBjb25zdHJhaW47XG4gIH07XG5cbiAgem9vbS5kdXJhdGlvbiA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChkdXJhdGlvbiA9ICtfLCB6b29tKSA6IGR1cmF0aW9uO1xuICB9O1xuXG4gIHpvb20uaW50ZXJwb2xhdGUgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAoaW50ZXJwb2xhdGUgPSBfLCB6b29tKSA6IGludGVycG9sYXRlO1xuICB9O1xuXG4gIHpvb20ub24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWUgPSBsaXN0ZW5lcnMub24uYXBwbHkobGlzdGVuZXJzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbGlzdGVuZXJzID8gem9vbSA6IHZhbHVlO1xuICB9O1xuXG4gIHpvb20uY2xpY2tEaXN0YW5jZSA9IGZ1bmN0aW9uKF8pIHtcbiAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA/IChjbGlja0Rpc3RhbmNlMiA9IChfID0gK18pICogXywgem9vbSkgOiBNYXRoLnNxcnQoY2xpY2tEaXN0YW5jZTIpO1xuICB9O1xuXG4gIHpvb20udGFwRGlzdGFuY2UgPSBmdW5jdGlvbihfKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPyAodGFwRGlzdGFuY2UgPSArXywgem9vbSkgOiB0YXBEaXN0YW5jZTtcbiAgfTtcblxuICByZXR1cm4gem9vbTtcbn1cbiIsICJpbXBvcnQgKiBhcyBkMyBmcm9tIFwiZDNcIjtcclxuXHJcbi8qID09PT09PT09PT09IFBhbGV0dGVzID09PT09PT09PT09ICovXHJcbmNvbnN0IENPTE9SUyA9IHtcclxuICBibHVlOiAgIFwiIzYwYTVmYVwiLFxyXG4gIGdyZWVuOiAgXCIjMzRkMzk5XCIsXHJcbiAgYW1iZXI6ICBcIiNmNTllMGJcIixcclxuICByZWQ6ICAgIFwiI2VmNDQ0NFwiLFxyXG4gIHB1cnBsZTogXCIjYTc4YmZhXCIsXHJcbiAgc2xhdGU6ICBcIiM5NGEzYjhcIixcclxuICBsaWdodDogIFwiI2NiZDVlMVwiXHJcbn07XHJcblxyXG5jb25zdCBFREdFX1RZUEVTID0gW1wiY2FsbFwiLCBcInVzZVwiLCBcIm1vZHVsZS1wcm9jZWR1cmUtb2ZcIiwgXCJiaW5kcy10b1wiLCBcInVzZXMtdHlwZVwiXTtcclxuY29uc3QgVFlQRV9BTElBUyA9IG5ldyBNYXAoW1tcIm1vZHVsZV9wcm9jZWR1cmVfb2ZcIiwgXCJtb2R1bGUtcHJvY2VkdXJlLW9mXCJdXSk7XHJcblxyXG5jb25zdCBFREdFX0NPTE9SUyA9IHtcclxuICBcImNhbGxcIjogICAgICAgICAgICAgICAgQ09MT1JTLmJsdWUsXHJcbiAgXCJ1c2VcIjogICAgICAgICAgICAgICAgIENPTE9SUy5ncmVlbixcclxuICBcIm1vZHVsZS1wcm9jZWR1cmUtb2ZcIjogQ09MT1JTLmFtYmVyLFxyXG4gIFwiYmluZHMtdG9cIjogICAgICAgICAgICBDT0xPUlMucmVkLFxyXG4gIFwidXNlcy10eXBlXCI6ICAgICAgICAgICBDT0xPUlMucHVycGxlXHJcbn07XHJcblxyXG4vLyBOb2RlIHBhbGV0dGUgYWxpZ25lZCB0byBlZGdlIHNlbWFudGljc1xyXG5mdW5jdGlvbiBjb2xvckJ5S2luZChraW5kKSB7XHJcbiAgc3dpdGNoICgoa2luZCB8fCBcInVua25vd25cIikudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XHJcbiAgICBjYXNlIFwic3Vicm91dGluZVwiOiByZXR1cm4gQ09MT1JTLmJsdWU7ICAgIC8vIGFsaWducyB3aXRoIGNhbGxcclxuICAgIGNhc2UgXCJtb2R1bGVcIjogICAgIHJldHVybiBDT0xPUlMuZ3JlZW47ICAgLy8gYWxpZ25zIHdpdGggdXNlXHJcbiAgICBjYXNlIFwiaW50ZXJmYWNlXCI6XHJcbiAgICBjYXNlIFwiZ2VuZXJpY1wiOiAgICByZXR1cm4gQ09MT1JTLmFtYmVyOyAgIC8vIGFsaWducyB3aXRoIG1vZHVsZS1wcm9jZWR1cmUtb2ZcclxuICAgIGNhc2UgXCJ0eXBlXCI6ICAgICAgIHJldHVybiBDT0xPUlMucHVycGxlOyAgLy8gYWxpZ25zIHdpdGggdXNlcy10eXBlXHJcbiAgICBjYXNlIFwicHJvZ3JhbVwiOiAgICByZXR1cm4gQ09MT1JTLnNsYXRlO1xyXG4gICAgZGVmYXVsdDogICAgICAgICAgIHJldHVybiBDT0xPUlMubGlnaHQ7XHJcbiAgfVxyXG59XHJcbmNvbnN0IGNvbG9yQnlUeXBlID0gKHQpID0+IEVER0VfQ09MT1JTW3RdIHx8IFwiIzk5OVwiO1xyXG5cclxuLyogPT09PT09PT09PT0gRGlyZWN0aW9uYWwgc2l6aW5nIG9wdGlvbiAoT3B0aW9uIDEgb25seSkgPT09PT09PT09PT0gKi9cclxuLyoqIFNldCBob3cgbm9kZXMgYXJlIHNpemVkOiBcImluXCIgfCBcIm91dFwiIHwgXCJib3RoXCIgKGluK291dCkuICovXHJcbmNvbnN0IFNJWkVfTU9ERSA9IFwiaW5cIjtcclxuXHJcbi8qID09PT09PT09PT09IFNtYWxsIHV0aWxpdGllcyA9PT09PT09PT09PSAqL1xyXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgd2FpdCA9IDIwMCkge1xyXG4gIGxldCB0OyByZXR1cm4gKC4uLmFyZ3MpID0+IHsgY2xlYXJUaW1lb3V0KHQpOyB0ID0gc2V0VGltZW91dCgoKSA9PiBmbiguLi5hcmdzKSwgd2FpdCk7IH07XHJcbn1cclxuXHJcbi8qID09PT09PT09PT09IERhdGEgPT09PT09PT09PT0gKi9cclxuY29uc3QgZGVwcyA9IGF3YWl0IGZldGNoKFwiLi9kZXBzLmpzb25cIikudGhlbihyID0+IHIuanNvbigpKTtcclxuXHJcbi8qID09PT09PT09PT09IERPTSByZWZzICYgbGF5ZXJzID09PT09PT09PT09ICovXHJcbmNvbnN0IHN2ZyA9IGQzLnNlbGVjdChcIiN2aXpcIik7XHJcbmNvbnN0IGdNYWluICAgPSBzdmcuYXBwZW5kKFwiZ1wiKTtcclxuLyogT3JkZXI6IGxpbmtzIGFib3ZlIG5vZGVzIHNvIHN0cm9rZXMgc2l0IG92ZXIgdGhlIG5vZGVcdTIwMTlzIHdoaXRlIGhvdmVyIHJpbmcgKi9cclxuY29uc3QgZ0xpbmtzICA9IGdNYWluLmFwcGVuZChcImdcIik7XHJcbmNvbnN0IGdOb2RlcyAgPSBnTWFpbi5hcHBlbmQoXCJnXCIpO1xyXG5jb25zdCBnQXJyb3dzID0gZ01haW4uYXBwZW5kKFwiZ1wiKTsgICAvLyBhcnJvdyBvdmVybGF5IGFib3ZlIG5vZGVzXHJcbmNvbnN0IGdMYWJlbHMgPSBnTWFpbi5hcHBlbmQoXCJnXCIpOyAgIC8vIGxhYmVscyBvbiB0b3BcclxuXHJcbmNvbnN0IGluZm8gICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjaW5mb1wiKTtcclxuY29uc3QgZWRnZVR5cGVTZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2VkZ2VUeXBlXCIpO1xyXG5jb25zdCBmaWx0ZXJJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZmlsdGVyXCIpO1xyXG5jb25zdCBsYWJlbHNUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xhYmVsc1wiKTtcclxuY29uc3QgbGVnZW5kRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xlZ2VuZFwiKTtcclxuY29uc3QgbGVnZW5kS2luZHNFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbGVnZW5kS2luZHNcIik7XHJcblxyXG4vKiA9PT09PT09PT09PSBMZWdlbmRzID09PT09PT09PT09ICovXHJcbmNvbnN0IGFjdGl2ZVR5cGVzID0gbmV3IFNldChFREdFX1RZUEVTKTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckVkZ2VMZWdlbmQoKSB7XHJcbiAgbGVnZW5kRWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICBjb25zdCBpbkFsbE1vZGUgPSBlZGdlVHlwZVNlbC52YWx1ZSA9PT0gXCJhbGxcIjtcclxuICBmb3IgKGNvbnN0IHQgb2YgRURHRV9UWVBFUykge1xyXG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIHJvdy5jbGFzc05hbWUgPSBcInJvd1wiO1xyXG5cclxuICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgY2IudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgIGNiLmNoZWNrZWQgPSBhY3RpdmVUeXBlcy5oYXModCk7XHJcbiAgICBjYi5kaXNhYmxlZCA9ICFpbkFsbE1vZGU7XHJcbiAgICBjYi5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgaWYgKGNiLmNoZWNrZWQpIGFjdGl2ZVR5cGVzLmFkZCh0KTsgZWxzZSBhY3RpdmVUeXBlcy5kZWxldGUodCk7XHJcbiAgICAgIHJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBpZiAoIWluQWxsTW9kZSkgbGFiZWwuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xyXG4gICAgY29uc3Qgc3dhdGNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICBzd2F0Y2guY2xhc3NOYW1lID0gXCJzd2F0Y2hcIjtcclxuICAgIHN3YXRjaC5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3JCeVR5cGUodCk7XHJcblxyXG4gICAgbGFiZWwuYXBwZW5kQ2hpbGQoc3dhdGNoKTtcclxuICAgIGxhYmVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHQpKTtcclxuICAgIHJvdy5hcHBlbmRDaGlsZChjYik7XHJcbiAgICByb3cuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgbGVnZW5kRWwuYXBwZW5kQ2hpbGQocm93KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck5vZGVLaW5kTGVnZW5kKCkge1xyXG4gIGxlZ2VuZEtpbmRzRWwuaW5uZXJIVE1MID0gXCJcIjtcclxuICBjb25zdCBraW5kcyA9IFtcclxuICAgIFtcImZ1bmN0aW9uIC8gc3Vicm91dGluZVwiLCBjb2xvckJ5S2luZChcImZ1bmN0aW9uXCIpXSxcclxuICAgIFtcIm1vZHVsZVwiLCAgICAgICAgICAgICAgICBjb2xvckJ5S2luZChcIm1vZHVsZVwiKV0sXHJcbiAgICBbXCJpbnRlcmZhY2UgLyBnZW5lcmljXCIsICAgY29sb3JCeUtpbmQoXCJpbnRlcmZhY2VcIildLFxyXG4gICAgW1widHlwZVwiLCAgICAgICAgICAgICAgICAgIGNvbG9yQnlLaW5kKFwidHlwZVwiKV0sXHJcbiAgICBbXCJwcm9ncmFtXCIsICAgICAgICAgICAgICAgY29sb3JCeUtpbmQoXCJwcm9ncmFtXCIpXSxcclxuICAgIFtcIm90aGVyIC8gdW5rbm93blwiLCAgICAgICBjb2xvckJ5S2luZChcInVua25vd25cIildXHJcbiAgXTtcclxuICBmb3IgKGNvbnN0IFtuYW1lLCBjb2xdIG9mIGtpbmRzKSB7XHJcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgcm93LmNsYXNzTmFtZSA9IFwicm93XCI7XHJcbiAgICBjb25zdCBzdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgc3cuY2xhc3NOYW1lID0gXCJzd2F0Y2hcIjtcclxuICAgIHN3LnN0eWxlLmJhY2tncm91bmQgPSBjb2w7XHJcbiAgICBjb25zdCBsYWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XHJcbiAgICBsYWIuYXBwZW5kQ2hpbGQoc3cpO1xyXG4gICAgbGFiLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5hbWUpKTtcclxuICAgIGxlZ2VuZEtpbmRzRWwuYXBwZW5kQ2hpbGQobGFiKTtcclxuICB9XHJcbn1cclxuXHJcbi8qID09PT09PT09PT09IEhlbHBlcnMgPT09PT09PT09PT0gKi9cclxuZnVuY3Rpb24gbm9ybVR5cGUodCkgeyByZXR1cm4gVFlQRV9BTElBUy5nZXQodCkgfHwgdDsgfVxyXG5mdW5jdGlvbiBub2RlS2V5KGQpeyByZXR1cm4gZC5pZDsgfVxyXG5cclxuZnVuY3Rpb24gZmlsdGVyTm9kZXMobm9kZXMsIHEpIHtcclxuICBpZiAoIXEpIHJldHVybiBub2RlcztcclxuICBjb25zdCB0ID0gcS50b0xvd2VyQ2FzZSgpO1xyXG4gIHJldHVybiBub2Rlcy5maWx0ZXIobiA9PlxyXG4gICAgKG4uaWR8fFwiXCIpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModCkgfHxcclxuICAgIChuLm5hbWV8fFwiXCIpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModCkgfHxcclxuICAgIChuLnNjb3BlfHxcIlwiKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHQpIHx8XHJcbiAgICAobi5raW5kfHxcIlwiKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHQpXHJcbiAgKTtcclxufVxyXG5cclxuLy8gbm9kZVJhZGl1cyBub3cgZGVwZW5kcyBvbiBkaXJlY3Rpb25hbCBkZWdyZWUgKGNvbXB1dGVkIGluIGJ1aWxkR3JhcGgpXHJcbmZ1bmN0aW9uIG5vZGVSYWRpdXMoZCkge1xyXG4gIGNvbnN0IGsgPSBTSVpFX01PREUgPT09IFwiaW5cIiAgPyAoZC5kZWdJbiAgfHwgMClcclxuICAgICAgICAgIDogU0laRV9NT0RFID09PSBcIm91dFwiID8gKGQuZGVnT3V0IHx8IDApXHJcbiAgICAgICAgICA6IChkLmRlZ0luIHx8IDApICsgKGQuZGVnT3V0IHx8IDApO1xyXG4gIC8vIGdlbnRsZSBzcXJ0IHNjYWxlOyBtaW5pbXVtIHBhZGRpbmdcclxuICByZXR1cm4gNCArIE1hdGguc3FydCgyICsgayk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJ1aWxkR3JhcGgoZWRnZVR5cGUsIHF1ZXJ5KSB7XHJcbiAgY29uc3Qgbm9kZXNCeUlkID0gbmV3IE1hcChkZXBzLm5vZGVzLm1hcChuID0+IFtuLmlkLCB7IC4uLm4gfV0pKTtcclxuXHJcbiAgY29uc3QgdHlwZXMgPSBlZGdlVHlwZSA9PT0gXCJhbGxcIiA/IFsuLi5hY3RpdmVUeXBlc10gOiBbZWRnZVR5cGVdO1xyXG5cclxuICBjb25zdCB1bmlxID0gbmV3IFNldCgpO1xyXG4gIGNvbnN0IGxpbmtzID0gW107XHJcbiAgZm9yIChjb25zdCBsIG9mIGRlcHMubGlua3MpIHtcclxuICAgIGNvbnN0IHQgPSBub3JtVHlwZShsLnR5cGUpO1xyXG4gICAgaWYgKCF0eXBlcy5pbmNsdWRlcyh0KSkgY29udGludWU7XHJcbiAgICBjb25zdCBzSWQgPSB0eXBlb2YgbC5zb3VyY2UgPT09IFwic3RyaW5nXCIgPyBsLnNvdXJjZSA6IGwuc291cmNlPy5pZDtcclxuICAgIGNvbnN0IHRJZCA9IHR5cGVvZiBsLnRhcmdldCA9PT0gXCJzdHJpbmdcIiA/IGwudGFyZ2V0IDogbC50YXJnZXQ/LmlkO1xyXG4gICAgaWYgKCFub2Rlc0J5SWQuaGFzKHNJZCkgfHwgIW5vZGVzQnlJZC5oYXModElkKSkgY29udGludWU7XHJcblxyXG4gICAgY29uc3Qga2V5ID0gYCR7c0lkfVxcdCR7dElkfVxcdCR7dH1gO1xyXG4gICAgaWYgKHVuaXEuaGFzKGtleSkpIGNvbnRpbnVlO1xyXG4gICAgdW5pcS5hZGQoa2V5KTtcclxuICAgIGxpbmtzLnB1c2goeyBzb3VyY2U6IG5vZGVzQnlJZC5nZXQoc0lkKSwgdGFyZ2V0OiBub2Rlc0J5SWQuZ2V0KHRJZCksIGV0eXBlOiB0IH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qga2VlcCA9IG5ldyBTZXQoZmlsdGVyTm9kZXMoWy4uLm5vZGVzQnlJZC52YWx1ZXMoKV0sIHF1ZXJ5KS5tYXAobiA9PiBuLmlkKSk7XHJcbiAgY29uc3QgZmlsdGVyZWQgPSBsaW5rcy5maWx0ZXIobCA9PiBrZWVwLmhhcyhsLnNvdXJjZS5pZCkgfHwga2VlcC5oYXMobC50YXJnZXQuaWQpKTtcclxuXHJcbiAgY29uc3QgdXNlZCA9IG5ldyBTZXQoKTtcclxuICBmb3IgKGNvbnN0IGwgb2YgZmlsdGVyZWQpIHsgdXNlZC5hZGQobC5zb3VyY2UuaWQpOyB1c2VkLmFkZChsLnRhcmdldC5pZCk7IH1cclxuICBjb25zdCBub2RlcyA9IFsuLi51c2VkXS5tYXAoaWQgPT4gbm9kZXNCeUlkLmdldChpZCkpO1xyXG5cclxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0gRGlyZWN0aW9uYWwgZGVncmVlIGNvdW50cyAodmlzdWFsKSAtLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICBXZSBkcmF3IGFycm93cyBSRVZFUlNFRCAodGFyZ2V0IFx1MjE5MiBzb3VyY2UpIHNvIHRoZSBhcnJvd2hlYWQgdG91Y2hlcyB0aGVcclxuICAgICBTT1VSQ0Ugbm9kZSBvbiBzY3JlZW4uIFRvIHNpemUgYnkgKnZpc3VhbCogaW5ib3VuZCAoYXJyb3dzIGZsb3dpbmcgaW50b1xyXG4gICAgIGEgbm9kZSBvbiBzY3JlZW4pLCB3ZSBjb3VudDpcclxuICAgICAgIC0gZGVnSW4gIDo9ICNsaW5rcyB3aGVyZSBub2RlID09PSBzb3VyY2UgICAoYXJyb3doZWFkcyB0b3VjaCBoZXJlKVxyXG4gICAgICAgLSBkZWdPdXQgOj0gI2xpbmtzIHdoZXJlIG5vZGUgPT09IHRhcmdldCAgIChhcnJvd3MgbGVhdmUgdGhpcyBub2RlKVxyXG4gICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuICBmb3IgKGNvbnN0IG4gb2Ygbm9kZXMpIHsgbi5kZWdJbiA9IDA7IG4uZGVnT3V0ID0gMDsgfVxyXG4gIGZvciAoY29uc3QgbCBvZiBmaWx0ZXJlZCkgeyBsLnNvdXJjZS5kZWdJbisrOyBsLnRhcmdldC5kZWdPdXQrKzsgfVxyXG5cclxuICAvLyAoa2VwdCBmb3Igb3RoZXIgaGV1cmlzdGljcykgdW5kaXJlY3RlZCBkZWdyZWVcclxuICBjb25zdCBkZWcgPSBuZXcgTWFwKFsuLi51c2VkXS5tYXAoaWQgPT4gW2lkLCAwXSkpO1xyXG4gIGZvciAoY29uc3QgbCBvZiBmaWx0ZXJlZCkge1xyXG4gICAgZGVnLnNldChsLnNvdXJjZS5pZCwgKGRlZy5nZXQobC5zb3VyY2UuaWQpfHwwKSsxKTtcclxuICAgIGRlZy5zZXQobC50YXJnZXQuaWQsIChkZWcuZ2V0KGwudGFyZ2V0LmlkKXx8MCkrMSk7XHJcbiAgfVxyXG4gIGZvciAoY29uc3QgbiBvZiBub2Rlcykgbi5kZWdyZWUgPSBkZWcuZ2V0KG4uaWQpIHx8IDA7XHJcblxyXG4gIHJldHVybiB7IG5vZGVzLCBsaW5rczogZmlsdGVyZWQgfTtcclxufVxyXG5cclxuLyogPT09PT09PT09PT0gWm9vbSAvIFBhbiA9PT09PT09PT09PSAqL1xyXG5sZXQgem9vbUsgPSAxOyAgICAgICAgICAgICAgIC8vIGN1cnJlbnQgem9vbSAoZm9yIHNjcmVlbi1jb25zdGFudCBhcnJvd3MpXHJcbmxldCBvblpvb21SZXBhaW50ID0gbnVsbDsgICAgLy8gYXNzaWduZWQgYnkgcnVuKCkgdG8gcmVmcmVzaCBhcnJvd3MgaW1tZWRpYXRlbHlcclxubGV0IHJhZlF1ZXVlZCA9IGZhbHNlO1xyXG5jb25zdCByYWZSZXBhaW50ID0gKCkgPT4ge1xyXG4gIGlmIChyYWZRdWV1ZWQpIHJldHVybjtcclxuICByYWZRdWV1ZWQgPSB0cnVlO1xyXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7IHJhZlF1ZXVlZCA9IGZhbHNlOyBvblpvb21SZXBhaW50ICYmIG9uWm9vbVJlcGFpbnQoKTsgfSk7XHJcbn07XHJcblxyXG4vKiBEaXNhYmxlIHpvb20gd2hpbGUgdHlwaW5nIGluIHNlYXJjaCBvciB3aGVuIHBvaW50ZXIgaXMgb24gYSBub2RlLiAqL1xyXG5jb25zdCB6b29tID0gZDMuem9vbSgpXHJcbiAgLmZpbHRlcigoZXZlbnQpID0+IHtcclxuICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaWx0ZXJJbnB1dCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgcmV0dXJuICEodGFyZ2V0ICYmIHRhcmdldC5jbG9zZXN0ICYmIHRhcmdldC5jbG9zZXN0KFwiLm5vZGVcIikpO1xyXG4gIH0pIC8vIHpvb20gZmlsdGVyIGhvb2tcclxuICAub24oXCJ6b29tXCIsIChldikgPT4ge1xyXG4gICAgem9vbUsgPSBldi50cmFuc2Zvcm0uaztcclxuICAgIGdNYWluLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZXYudHJhbnNmb3JtKTtcclxuICAgIHJhZlJlcGFpbnQoKTsgLy8gcmVwYWludCBhcnJvd3MgYXQgdGhpcyB6b29tXHJcbiAgfSk7XHJcbnN2Zy5jYWxsKHpvb20pO1xyXG5cclxuLyogVHJhY2sgdGhlIGN1cnJlbnQgc2ltdWxhdGlvbiBzbyB3ZSBjYW4gc3RvcCBpdCBvbiByZXJ1biAqL1xyXG5sZXQgY3VycmVudFNpbSA9IG51bGw7XHJcbi8qIFdoZXRoZXIgdGhlIGluZm8gcGFuZWwgaXMgcGlubmVkIChjbGljayB0byBwaW4vdW5waW4pICovXHJcbmxldCBpbmZvUGlubmVkID0gZmFsc2U7XHJcblxyXG4vKiA9PT09PT09PT09PSBNYWluIHJlbmRlciAvIHNpbXVsYXRpb24gPT09PT09PT09PT0gKi9cclxuZnVuY3Rpb24gcnVuKGVkZ2VUeXBlID0gXCJhbGxcIiwgcXVlcnkgPSBcIlwiKSB7XHJcbiAgaWYgKGN1cnJlbnRTaW0pIGN1cnJlbnRTaW0uc3RvcCgpOyAvLyBwcmV2ZW50IGNvbXBldGluZyB0aWNrc1xyXG5cclxuICByZW5kZXJFZGdlTGVnZW5kKCk7XHJcbiAgcmVuZGVyTm9kZUtpbmRMZWdlbmQoKTtcclxuXHJcbiAgY29uc3QgeyBub2RlcywgbGlua3MgfSA9IGJ1aWxkR3JhcGgoZWRnZVR5cGUsIHF1ZXJ5KTtcclxuXHJcbiAgY29uc3Qgc2ltID0gZDMuZm9yY2VTaW11bGF0aW9uKG5vZGVzKVxyXG4gICAgLmZvcmNlKFwiY2hhcmdlXCIsIGQzLmZvcmNlTWFueUJvZHkoKS5zdHJlbmd0aChkID0+IChkLmtpbmQgPT09IFwibW9kdWxlXCIgPyAtMzAwIDogLTE0MCkpKVxyXG4gICAgLmZvcmNlKFwibGlua1wiLCBkMy5mb3JjZUxpbmsobGlua3MpLmlkKG5vZGVLZXkpXHJcbiAgICAgIC5kaXN0YW5jZShkID0+IDcwICsgMipNYXRoLm1pbihkLnNvdXJjZS5kZWdyZWUsZC50YXJnZXQuZGVncmVlKSlcclxuICAgICAgLnN0cmVuZ3RoKDAuMTUpKVxyXG4gICAgLy8gSU1QT1JUQU5UOiBjb2xsaWRlIHJhZGl1cyByZXNwZWN0cyBub2RlUmFkaXVzIHNvIGNpcmNsZXMgZG9uJ3Qgb3ZlcmxhcC5cclxuICAgIC5mb3JjZShcImNvbGxpZGVcIiwgZDMuZm9yY2VDb2xsaWRlKCkucmFkaXVzKGQgPT4gbm9kZVJhZGl1cyhkKSArIDIpLml0ZXJhdGlvbnMoMikpXHJcbiAgICAvLyBJZiB5b3Uga2VwdCB0aGVzZSwgdGhleSByZW1haW47IG90aGVyd2lzZSB5b3UgY2FuIHJlbW92ZSB0byBhdm9pZCBjZW50ZXIgcHVsbC5cclxuICAgIC5mb3JjZShcInhcIiwgZDMuZm9yY2VYKCkuc3RyZW5ndGgoMC4wMykpXHJcbiAgICAuZm9yY2UoXCJ5XCIsIGQzLmZvcmNlWSgpLnN0cmVuZ3RoKDAuMDMpKTtcclxuICBjdXJyZW50U2ltID0gc2ltO1xyXG5cclxuICAvLyAtLS0gam9pbnMgLS0tXHJcbiAgY29uc3QgbGlua1NlbCA9IGdMaW5rcy5zZWxlY3RBbGwoXCJsaW5lXCIpLmRhdGEobGlua3MsIGQgPT4gZC5zb3VyY2UuaWQgKyBcIlx1MjE5MlwiICsgZC50YXJnZXQuaWQgKyBcIjpcIiArIGQuZXR5cGUpO1xyXG4gIGxpbmtTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IGxpbmtFbnRlciA9IGxpbmtTZWwuZW50ZXIoKS5hcHBlbmQoXCJsaW5lXCIpXHJcbiAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMS4yKTtcclxuICBjb25zdCBsaW5rID0gbGlua0VudGVyLm1lcmdlKGxpbmtTZWwpLmF0dHIoXCJzdHJva2VcIiwgZCA9PiBjb2xvckJ5VHlwZShkLmV0eXBlKSk7XHJcblxyXG4gIGNvbnN0IG5vZGVTZWwgPSBnTm9kZXMuc2VsZWN0QWxsKFwiY2lyY2xlXCIpLmRhdGEobm9kZXMsIG5vZGVLZXkpO1xyXG4gIG5vZGVTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IG5vZGVFbnRlciA9IG5vZGVTZWwuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAuYXR0cihcInJcIiwgZCA9PiBub2RlUmFkaXVzKGQpKSAvLyBpbml0aWFsXHJcbiAgICAuYXR0cihcImZpbGxcIiwgZCA9PiBjb2xvckJ5S2luZChkLmtpbmQpKVxyXG4gICAgLmF0dHIoXCJzdHJva2VcIiwgXCIjMGIwZTEyXCIpXHJcbiAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAwLjc1KVxyXG4gICAgLm9uKFwicG9pbnRlcmRvd25cIiwgKGV2KSA9PiBldi5zdG9wUHJvcGFnYXRpb24oKSkgIC8vIGRyYWcgd2lucyBvdmVyIHpvb21cclxuICAgIC5jYWxsKFxyXG4gICAgICBkMy5kcmFnKClcclxuICAgICAgICAub24oXCJzdGFydFwiLCAoZXYsIGQpID0+IHtcclxuICAgICAgICAgIGV2LnNvdXJjZUV2ZW50Py5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGlmICghZXYuYWN0aXZlKSBzaW0uYWxwaGFUYXJnZXQoMC4yKS5yZXN0YXJ0KCk7XHJcbiAgICAgICAgICBkLmZ4ID0gZC54OyBkLmZ5ID0gZC55O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm9uKFwiZHJhZ1wiLCAgKGV2LCBkKSA9PiB7IGQuZnggPSBldi54OyBkLmZ5ID0gZXYueTsgfSlcclxuICAgICAgICAub24oXCJlbmRcIiwgICAoZXYsIGQpID0+IHsgaWYgKCFldi5hY3RpdmUpIHNpbS5hbHBoYVRhcmdldCgwKTsgZC5meCA9IG51bGw7IGQuZnkgPSBudWxsOyB9KVxyXG4gICAgKVxyXG4gICAgLm9uKFwibW91c2VlbnRlclwiLCAoXywgZCkgPT4geyBpZiAoIWluZm9QaW5uZWQpIHNob3dJbmZvKGQsIGxpbmtzKTsgfSlcclxuICAgIC5vbihcIm1vdXNlbW92ZVwiLCAoZXYsIGQpID0+IG1heWJlSGlnaGxpZ2h0KGQpKVxyXG4gICAgLm9uKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB7IGlmICghaW5mb1Bpbm5lZCkgY2xlYXJIaWdobGlnaHQoKTsgfSlcclxuICAgIC5vbihcImNsaWNrXCIsIChfLCBkKSA9PiB7IGluZm9QaW5uZWQgPSAhaW5mb1Bpbm5lZDsgaWYgKGluZm9QaW5uZWQpIHNob3dJbmZvKGQsIGxpbmtzKTsgfSk7XHJcblxyXG4gIC8vIFx1RDgzRFx1REQyNyBlbnN1cmUgZXhpc3Rpbmcgbm9kZXMgcmVzaXplIHRvbyBvbiByZS1ydW5zL2ZpbHRlcnNcclxuICBjb25zdCBub2RlID0gbm9kZUVudGVyLm1lcmdlKG5vZGVTZWwpXHJcbiAgICAuYXR0cihcInJcIiwgZCA9PiBub2RlUmFkaXVzKGQpKTtcclxuXHJcbiAgLy8gQXJyb3doZWFkcyBhcyBvdmVybGF5IHRyaWFuZ2xlcyAoYWJvdmUgbm9kZXMpXHJcbiAgY29uc3QgYXJyb3dTZWwgPSBnQXJyb3dzLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShsaW5rcywgZCA9PiBkLnNvdXJjZS5pZCArIFwiXHUyMTkyXCIgKyBkLnRhcmdldC5pZCArIFwiOlwiICsgZC5ldHlwZSk7XHJcbiAgYXJyb3dTZWwuZXhpdCgpLnJlbW92ZSgpO1xyXG4gIGNvbnN0IGFycm93ID0gYXJyb3dTZWwuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAuYXR0cihcInBvaW50ZXItZXZlbnRzXCIsIFwibm9uZVwiKVxyXG4gICAgLm1lcmdlKGFycm93U2VsKVxyXG4gICAgLmF0dHIoXCJmaWxsXCIsIGQgPT4gY29sb3JCeVR5cGUoZC5ldHlwZSkpO1xyXG5cclxuICBjb25zdCBsYWJlbFNlbCA9IGdMYWJlbHMuc2VsZWN0QWxsKFwidGV4dFwiKS5kYXRhKG5vZGVzLCBub2RlS2V5KTtcclxuICBsYWJlbFNlbC5leGl0KCkucmVtb3ZlKCk7XHJcbiAgY29uc3QgbGFiZWwgPSBsYWJlbFNlbC5lbnRlcigpLmFwcGVuZChcInRleHRcIilcclxuICAgIC5hdHRyKFwiY2xhc3NcIixcImxhYmVsXCIpXHJcbiAgICAuYXR0cihcInRleHQtYW5jaG9yXCIsXCJtaWRkbGVcIilcclxuICAgIC5hdHRyKFwiZHlcIixcIi0wLjc1ZW1cIilcclxuICAgIC50ZXh0KGQgPT4gZC5uYW1lIHx8IGQuaWQpXHJcbiAgICAubWVyZ2UobGFiZWxTZWwpO1xyXG5cclxuICAvLyAtLS0gbmVpZ2hib3IgaGlnaGxpZ2h0aW5nIC0tLVxyXG4gIGNvbnN0IG5laWdoYm9ycyA9IGdldE5laWdoYm9yc01hcChsaW5rcyk7XHJcbiAgZnVuY3Rpb24gZ2V0TmVpZ2hib3JzTWFwKGxpbmtzKSB7XHJcbiAgICBjb25zdCBuYiA9IG5ldyBNYXAoKTtcclxuICAgIGZvciAoY29uc3QgbCBvZiBsaW5rcykge1xyXG4gICAgICAobmIuZ2V0KGwuc291cmNlLmlkKSB8fCBuYi5zZXQobC5zb3VyY2UuaWQsIG5ldyBTZXQoKSkuZ2V0KGwuc291cmNlLmlkKSkuYWRkKGwudGFyZ2V0LmlkKTtcclxuICAgICAgKG5iLmdldChsLnRhcmdldC5pZCkgfHwgbmIuc2V0KGwudGFyZ2V0LmlkLCBuZXcgU2V0KCkpLmdldChsLnRhcmdldC5pZCkpLmFkZChsLnNvdXJjZS5pZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmI7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG1heWJlSGlnaGxpZ2h0KGQpIHtcclxuICAgIGNvbnN0IG5iID0gbmVpZ2hib3JzLmdldChkLmlkKSB8fCBuZXcgU2V0KCk7XHJcbiAgICBub2RlLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgbiA9PiBuLmlkID09PSBkLmlkIHx8IG5iLmhhcyhuLmlkKSlcclxuICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgbiA9PiAobi5pZCA9PT0gZC5pZCB8fCBuYi5oYXMobi5pZCkpID8gMSA6IDAuMik7XHJcbiAgICBsaW5rLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgbCA9PiBsLnNvdXJjZS5pZCA9PT0gZC5pZCB8fCBsLnRhcmdldC5pZCA9PT0gZC5pZClcclxuICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgbCA9PiAobC5zb3VyY2UuaWQgPT09IGQuaWQgfHwgbC50YXJnZXQuaWQgPT09IGQuaWQpID8gMC45IDogMC4xMilcclxuICAgICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCBsID0+IChsLnNvdXJjZS5pZCA9PT0gZC5pZCB8fCBsLnRhcmdldC5pZCA9PT0gZC5pZCkgPyAyLjIgOiAxLjIpO1xyXG4gICAgbGFiZWwuYXR0cihcIm9wYWNpdHlcIiwgbiA9PiAobGFiZWxzVG9nZ2xlLmNoZWNrZWQgPyAoKG4uaWQgPT09IGQuaWQgfHwgbmIuaGFzKG4uaWQpKSA/IDEgOiAwLjA1KSA6IDApKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gY2xlYXJIaWdobGlnaHQoKSB7XHJcbiAgICBub2RlLmNsYXNzZWQoXCJoaWdobGlnaHRcIiwgZmFsc2UpLmF0dHIoXCJvcGFjaXR5XCIsIDEpO1xyXG4gICAgbGluay5jbGFzc2VkKFwiaGlnaGxpZ2h0XCIsIGZhbHNlKS5hdHRyKFwib3BhY2l0eVwiLCAwLjI4KS5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDEuMik7XHJcbiAgICBsYWJlbC5hdHRyKFwib3BhY2l0eVwiLCBsYWJlbHNUb2dnbGUuY2hlY2tlZCA/IDEgOiAwKTtcclxuICB9XHJcblxyXG4gIC8vIC0tLSBpbmZvIHBhbmVsIChlbGVnYW50IGNhcmQpIC0tLVxyXG4gIGZ1bmN0aW9uIHNob3dJbmZvKGQsIGxpbmtzKSB7XHJcbiAgICAvLyBOT1RFOiBpbmZvIGNvdW50cyBzdGlsbCByZWZsZWN0IGRhdGEgZGlyZWN0aW9uIChzb3VyY2VcdTIxOTJ0YXJnZXQpLlxyXG4gICAgY29uc3QgaW5jb21pbmcgPSBsaW5rcy5maWx0ZXIobCA9PiBsLnRhcmdldC5pZCA9PT0gZC5pZCk7XHJcbiAgICBjb25zdCBvdXRnb2luZyA9IGxpbmtzLmZpbHRlcihsID0+IGwuc291cmNlLmlkID09PSBkLmlkKTtcclxuXHJcbiAgICBjb25zdCBjb3VudHMgPSAoYXJyKSA9PiB7XHJcbiAgICAgIGNvbnN0IG0gPSBuZXcgTWFwKCk7IGZvciAoY29uc3QgbCBvZiBhcnIpIG0uc2V0KGwuZXR5cGUsIChtLmdldChsLmV0eXBlKXx8MCkrMSk7IHJldHVybiBtO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGluQnkgPSBjb3VudHMoaW5jb21pbmcpLCBvdXRCeSA9IGNvdW50cyhvdXRnb2luZyk7XHJcblxyXG4gICAgY29uc3QgYmFkZ2UgPSAodHh0KSA9PiBgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPiR7dHh0fTwvc3Bhbj5gO1xyXG4gICAgY29uc3QgY2hpcCAgPSAodHh0KSA9PiBgPHNwYW4gY2xhc3M9XCJjaGlwXCI+JHt0eHR9PC9zcGFuPmA7XHJcbiAgICBjb25zdCBkb3QgICA9ICh0KSA9PiBgPHNwYW4gY2xhc3M9XCJkb3RcIiBzdHlsZT1cImJhY2tncm91bmQ6JHtjb2xvckJ5VHlwZSh0KX1cIj48L3NwYW4+YDtcclxuXHJcbiAgICBjb25zdCBzaWcgPSBbXHJcbiAgICAgIGQucmVzdWx0ID8gYCR7ZC5yZXN1bHR9YCA6IG51bGwsXHJcbiAgICAgIEFycmF5LmlzQXJyYXkoZC5kdW1taWVzKSAmJiBkLmR1bW1pZXMubGVuZ3RoID8gYCgke2QuZHVtbWllcy5tYXAoeCA9PiB4Lm5hbWUgfHwgeCkuam9pbihcIiwgXCIpfSlgIDogbnVsbFxyXG4gICAgXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIik7XHJcblxyXG4gICAgY29uc3QgZmlsZUxpbmUgPSBkLmZpbGUgPyBgJHtkLmZpbGV9JHtkLmxpbmUgPyBgOiR7ZC5saW5lfWAgOiBcIlwifWAgOiBcIlwiO1xyXG5cclxuICAgIGluZm8uaW5uZXJIVE1MID0gYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaW5mby10aXRsZVwiPiR7ZC5uYW1lIHx8IGQuaWR9PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAke2Qua2luZCA/IGJhZGdlKGQua2luZCkgOiBcIlwifSAke2Quc2NvcGUgPyBiYWRnZShgc2NvcGU6ICR7ZC5zY29wZX1gKSA6IFwiXCJ9ICR7ZC52aXNpYmlsaXR5ID8gYmFkZ2UoZC52aXNpYmlsaXR5KSA6IFwiXCJ9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICAke3NpZyA/IGA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjZweFwiPjxzcGFuIGNsYXNzPVwia3ZcIj5zaWduYXR1cmU6PC9zcGFuPiAke2NoaXAoc2lnKX08L2Rpdj5gIDogXCJcIn1cclxuICAgICAgJHtmaWxlTGluZSA/IGA8ZGl2IGNsYXNzPVwicm93XCIgc3R5bGU9XCJtYXJnaW4tdG9wOjZweFwiPjxzcGFuIGNsYXNzPVwia3ZcIj5sb2NhdGlvbjo8L3NwYW4+ICR7Y2hpcChmaWxlTGluZSl9PC9kaXY+YCA6IFwiXCJ9XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb3VudHNcIj5cclxuICAgICAgICAke0VER0VfVFlQRVMubWFwKHQgPT4gYFxyXG4gICAgICAgICAgPGRpdj4ke2RvdCh0KX1pbiAke3R9PC9kaXY+PGRpdj4ke2luQnkuZ2V0KHQpIHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PiR7ZG90KHQpfW91dCAke3R9PC9kaXY+PGRpdj4ke291dEJ5LmdldCh0KSB8fCAwfTwvZGl2PlxyXG4gICAgICAgIGApLmpvaW4oXCJcIil9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYDtcclxuICB9XHJcblxyXG4gIC8vIC0tLSBnZW9tZXRyeSBoZWxwZXJzICh1c2VkIGJ5IHRpY2sgJiB6b29tIHJlcGFpbnQpIC0tLVxyXG4gIGZ1bmN0aW9uIGVuZHBvaW50cyhkKSB7XHJcbiAgICAvLyBSRVZFUlNFRCBEUkFXIERJUkVDVElPTjogbGluZSBkcmF3biBUQVJHRVQgXHUyMTkyIFNPVVJDRTsgYXJyb3doZWFkIGF0IFNPVVJDRVxyXG4gICAgY29uc3QgdnggPSBkLnNvdXJjZS54IC0gZC50YXJnZXQueDtcclxuICAgIGNvbnN0IHZ5ID0gZC5zb3VyY2UueSAtIGQudGFyZ2V0Lnk7XHJcbiAgICBjb25zdCBMICA9IE1hdGguaHlwb3QodngsIHZ5KSB8fCAxO1xyXG4gICAgY29uc3QgdXggPSB2eCAvIEwsIHV5ID0gdnkgLyBMO1xyXG5cclxuICAgIGNvbnN0IHgxID0gZC50YXJnZXQueCArIHV4ICogbm9kZVJhZGl1cyhkLnRhcmdldCk7XHJcbiAgICBjb25zdCB5MSA9IGQudGFyZ2V0LnkgKyB1eSAqIG5vZGVSYWRpdXMoZC50YXJnZXQpO1xyXG4gICAgY29uc3QgeDIgPSBkLnNvdXJjZS54IC0gdXggKiBub2RlUmFkaXVzKGQuc291cmNlKTtcclxuICAgIGNvbnN0IHkyID0gZC5zb3VyY2UueSAtIHV5ICogbm9kZVJhZGl1cyhkLnNvdXJjZSk7XHJcblxyXG4gICAgcmV0dXJuIHsgeDEsIHkxLCB4MiwgeTIsIHV4LCB1eSB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJyb3dQYXRoKGQsIGVuZHMpIHtcclxuICAgIGNvbnN0IEFSVyAgID0gNiAvIHpvb21LOyAgICAgLy8gbGVuZ3RoIChzY3JlZW4tY29uc3RhbnQpXHJcbiAgICBjb25zdCBIQUxGICA9IDMuNiAvIHpvb21LOyAgIC8vIGhhbGYgd2lkdGhcclxuICAgIGNvbnN0IGJ4ID0gZW5kcy54MiAtIGVuZHMudXggKiBBUlc7XHJcbiAgICBjb25zdCBieSA9IGVuZHMueTIgLSBlbmRzLnV5ICogQVJXO1xyXG4gICAgY29uc3QgcHggPSAtZW5kcy51eSwgcHkgPSBlbmRzLnV4O1xyXG5cclxuICAgIGNvbnN0IGIxeCA9IGJ4ICsgcHggKiBIQUxGLCBiMXkgPSBieSArIHB5ICogSEFMRjtcclxuICAgIGNvbnN0IGIyeCA9IGJ4IC0gcHggKiBIQUxGLCBiMnkgPSBieSAtIHB5ICogSEFMRjtcclxuICAgIHJldHVybiBgTSR7ZW5kcy54Mn0sJHtlbmRzLnkyfSBMJHtiMXh9LCR7YjF5fSBMJHtiMnh9LCR7YjJ5fSBaYDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlcGFpbnQoKSB7XHJcbiAgICAvLyBsaW5rcyAmIGFycm93c1xyXG4gICAgZ0xpbmtzLnNlbGVjdEFsbChcImxpbmVcIilcclxuICAgICAgLmF0dHIoXCJ4MVwiLCBkID0+IHsgY29uc3QgZSA9IChkLl9lID0gZW5kcG9pbnRzKGQpKTsgcmV0dXJuIGUueDE7IH0pXHJcbiAgICAgIC5hdHRyKFwieTFcIiwgZCA9PiBkLl9lLnkxKVxyXG4gICAgICAuYXR0cihcIngyXCIsIGQgPT4gZC5fZS54MilcclxuICAgICAgLmF0dHIoXCJ5MlwiLCBkID0+IGQuX2UueTIpO1xyXG4gICAgZ0Fycm93cy5zZWxlY3RBbGwoXCJwYXRoXCIpLmF0dHIoXCJkXCIsIGQgPT4gYXJyb3dQYXRoKGQsIGQuX2UpKTtcclxuXHJcbiAgICAvLyBub2RlcyAmIGxhYmVsc1xyXG4gICAgZ05vZGVzLnNlbGVjdEFsbChcImNpcmNsZVwiKS5hdHRyKFwiY3hcIiwgZCA9PiBkLngpLmF0dHIoXCJjeVwiLCBkID0+IGQueSk7XHJcbiAgICBnTGFiZWxzLnNlbGVjdEFsbChcInRleHRcIikuYXR0cihcInhcIiwgZCA9PiBkLngpLmF0dHIoXCJ5XCIsIGQgPT4gZC55KTtcclxuICB9XHJcblxyXG4gIHNpbS5vbihcInRpY2tcIiwgcmVwYWludCk7XHJcbiAgb25ab29tUmVwYWludCA9IHJlcGFpbnQ7XHJcblxyXG4gIGdMYWJlbHMuc2VsZWN0QWxsKFwidGV4dFwiKS5hdHRyKFwib3BhY2l0eVwiLCBsYWJlbHNUb2dnbGUuY2hlY2tlZCA/IDEgOiAwKTtcclxuXHJcbiAgLy8gY2xpY2sgb24gZW1wdHkgYmFja2dyb3VuZCB0byB1bnBpblxyXG4gIHN2Zy5vbihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgaWYgKGV2LnRhcmdldCA9PT0gc3ZnLm5vZGUoKSkgeyBpbmZvUGlubmVkID0gZmFsc2U7IH1cclxuICB9KTtcclxuXHJcbiAgLy8gRml0IHZpZXcgYWZ0ZXIgYSBicmllZiBzZXR0bGVcclxuICBpZiAobm9kZXMubGVuZ3RoKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgY29uc3QgW21pblgsIG1pblksIG1heFgsIG1heFldID0gZXh0ZW50WFkobm9kZXMpO1xyXG4gICAgICBjb25zdCB3ID0gbWF4WCAtIG1pblgsIGggPSBtYXhZIC0gbWluWTtcclxuICAgICAgY29uc3QgdmIgPSBbbWluWCAtIDQwLCBtaW5ZIC0gNDAsIHcgKyA4MCwgaCArIDgwXTtcclxuICAgICAgY29uc3Qge2NsaWVudFdpZHRoOkNXLCBjbGllbnRIZWlnaHQ6Q0h9ID0gc3ZnLm5vZGUoKTtcclxuICAgICAgY29uc3QgayA9IE1hdGgubWluKENXL3ZiWzJdLCBDSC92YlszXSk7XHJcblxyXG4gICAgICBzdmcudHJhbnNpdGlvbigpLmR1cmF0aW9uKDQwMClcclxuICAgICAgICAuY2FsbCh6b29tLnRyYW5zZm9ybSwgZDMuem9vbUlkZW50aXR5XHJcbiAgICAgICAgICAudHJhbnNsYXRlKENXLzIsIENILzIpXHJcbiAgICAgICAgICAuc2NhbGUoaylcclxuICAgICAgICAgIC50cmFuc2xhdGUoLSh2YlswXSt2YlsyXS8yKSwgLSh2YlsxXSt2YlszXS8yKSkpO1xyXG4gICAgfSwgMzAwKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4dGVudFhZKG5vZGVzKXtcclxuICBsZXQgbWluWD0rSW5maW5pdHksbWluWT0rSW5maW5pdHksbWF4WD0tSW5maW5pdHksbWF4WT0tSW5maW5pdHk7XHJcbiAgZm9yIChjb25zdCBuIG9mIG5vZGVzKXsgaWYobi54PG1pblgpbWluWD1uLng7IGlmKG4ueTxtaW5ZKW1pblk9bi55OyBpZihuLng+bWF4WCltYXhYPW4ueDsgaWYobi55Pm1heFkpbWF4WT1uLnk7IH1cclxuICByZXR1cm4gW21pblgsbWluWSxtYXhYLG1heFldO1xyXG59XHJcblxyXG4vKiA9PT09PT09PT09PSBDb250cm9scyA9PT09PT09PT09PSAqL1xyXG5lZGdlVHlwZVNlbC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpKTtcclxuZmlsdGVySW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGRlYm91bmNlKCgpID0+IHJ1bihlZGdlVHlwZVNlbC52YWx1ZSwgZmlsdGVySW5wdXQudmFsdWUpLCAyMDApKTtcclxubGFiZWxzVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gcnVuKGVkZ2VUeXBlU2VsLnZhbHVlLCBmaWx0ZXJJbnB1dC52YWx1ZSkpO1xyXG5cclxuLyogPT09PT09PT09PT0gQm9vdCA9PT09PT09PT09PSAqL1xyXG5ydW4oZWRnZVR5cGVTZWwudmFsdWUs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QUFHdkYsSUFBSSxZQUFZLE9BQU8sWUFBWSxLQUFLOyIsCiAgIm5hbWVzIjogWyJ0eXBlIiwgImMiLCAiZG9jdW1lbnQiLCAibSIsICJ4IiwgIm0iLCAibSIsICJkYXR1bSIsICJ4IiwgIm0iLCAic2VsZWN0aW9uIiwgIm0iLCAibSIsICJhIiwgIm0iLCAibSIsICJtIiwgImNyZWF0ZSIsICJjcmVhdGUiLCAicGFyc2VUeXBlbmFtZXMiLCAibSIsICJ0eXBlIiwgIndpbmRvdyIsICJkaXNwYXRjaF9kZWZhdWx0IiwgIm0iLCAiZGlzcGF0Y2hfZGVmYXVsdCIsICJzZWxlY3RfZGVmYXVsdCIsICJzdmciLCAicm9vdCIsICJzZWxlY3Rpb24iLCAic2VsZWN0X2RlZmF1bHQiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInR5cGUiLCAieCIsICJ5IiwgImRpc3BhdGNoIiwgImZpbHRlciIsICJzZWxlY3Rpb24iLCAic2VsZWN0X2RlZmF1bHQiLCAiYyIsICJjb250YWluZXIiLCAiZGlzcGF0Y2giLCAidHlwZSIsICJldmVudCIsICJ0b3VjaCIsICJjb25zdGFudF9kZWZhdWx0IiwgIm0iLCAiYSIsICJtaW4iLCAibWF4IiwgImNvbnN0YW50X2RlZmF1bHQiLCAieCIsICJhIiwgInkiLCAieSIsICJhIiwgImNvbnN0YW50X2RlZmF1bHQiLCAieSIsICJjb2xvciIsICJyZ2IiLCAic3RhcnQiLCAiYSIsICJhIiwgImkiLCAiYSIsICJjIiwgIm0iLCAiYSIsICJ4IiwgInpvb20iLCAibm93IiwgImlkIiwgImluZGV4IiwgImdldCIsICJzZXQiLCAic3RhcnQiLCAiZW1wdHkiLCAiaW50ZXJydXB0X2RlZmF1bHQiLCAiaWQiLCAic2V0IiwgImdldCIsICJ0cmFuc2l0aW9uIiwgImEiLCAiYyIsICJhdHRyUmVtb3ZlIiwgImF0dHJSZW1vdmVOUyIsICJhdHRyQ29uc3RhbnQiLCAiYXR0ckNvbnN0YW50TlMiLCAiYXR0ckZ1bmN0aW9uIiwgImF0dHJGdW5jdGlvbk5TIiwgImF0dHJfZGVmYXVsdCIsICJpZCIsICJnZXQiLCAiaWQiLCAic2V0IiwgImdldCIsICJpZCIsICJzZXQiLCAiZ2V0IiwgImlkIiwgInNldCIsICJmaWx0ZXJfZGVmYXVsdCIsICJtIiwgIm1lcmdlX2RlZmF1bHQiLCAidHJhbnNpdGlvbiIsICJtIiwgImlkIiwgInNldCIsICJvbl9kZWZhdWx0IiwgImdldCIsICJpZCIsICJyZW1vdmVfZGVmYXVsdCIsICJzZWxlY3RfZGVmYXVsdCIsICJpZCIsICJtIiwgImdldCIsICJzZWxlY3RBbGxfZGVmYXVsdCIsICJpZCIsICJtIiwgImNoaWxkcmVuIiwgImluaGVyaXQiLCAiZ2V0IiwgIlNlbGVjdGlvbiIsICJzZWxlY3Rpb25fZGVmYXVsdCIsICJzdHlsZVJlbW92ZSIsICJzdHlsZUNvbnN0YW50IiwgInN0eWxlRnVuY3Rpb24iLCAiaWQiLCAicmVtb3ZlIiwgInNldCIsICJzdHlsZV9kZWZhdWx0IiwgInRleHRDb25zdGFudCIsICJ0ZXh0RnVuY3Rpb24iLCAidGV4dF9kZWZhdWx0IiwgIm0iLCAiaW5oZXJpdCIsICJnZXQiLCAiaWQiLCAic2V0IiwgImlkIiwgInNlbGVjdF9kZWZhdWx0IiwgInNlbGVjdEFsbF9kZWZhdWx0IiwgImZpbHRlcl9kZWZhdWx0IiwgIm1lcmdlX2RlZmF1bHQiLCAic2VsZWN0aW9uX2RlZmF1bHQiLCAib25fZGVmYXVsdCIsICJhdHRyX2RlZmF1bHQiLCAic3R5bGVfZGVmYXVsdCIsICJ0ZXh0X2RlZmF1bHQiLCAicmVtb3ZlX2RlZmF1bHQiLCAiaWQiLCAidHJhbnNpdGlvbl9kZWZhdWx0IiwgIm0iLCAiaW50ZXJydXB0X2RlZmF1bHQiLCAidHJhbnNpdGlvbl9kZWZhdWx0IiwgIngiLCAieSIsICJ4IiwgInkiLCAieCIsICJ5IiwgImRhdGFfZGVmYXVsdCIsICJ4IiwgInkiLCAieDIiLCAieTIiLCAieDMiLCAieTMiLCAicmVtb3ZlX2RlZmF1bHQiLCAieCIsICJ5IiwgInNpemVfZGVmYXVsdCIsICJ4IiwgInkiLCAiZGF0YV9kZWZhdWx0IiwgInJlbW92ZV9kZWZhdWx0IiwgInNpemVfZGVmYXVsdCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInkiLCAiZmluZCIsICJpZCIsICJjb25zdGFudF9kZWZhdWx0IiwgIngiLCAieSIsICJtIiwgImkiLCAieCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAieCIsICJ5IiwgIm5vZGUiLCAic3RyZW5ndGgiLCAiYyIsICJ4MiIsICJ4X2RlZmF1bHQiLCAieCIsICJjb25zdGFudF9kZWZhdWx0IiwgInlfZGVmYXVsdCIsICJ5IiwgImNvbnN0YW50X2RlZmF1bHQiLCAiY29uc3RhbnRfZGVmYXVsdCIsICJ4IiwgInR5cGUiLCAidHJhbnNmb3JtIiwgImRpc3BhdGNoIiwgIngiLCAieSIsICJpZGVudGl0eSIsICJub3Byb3BhZ2F0aW9uIiwgIm5vZXZlbnRfZGVmYXVsdCIsICJkZWZhdWx0RmlsdGVyIiwgImlkZW50aXR5IiwgImRlZmF1bHRUb3VjaGFibGUiLCAidHJhbnNmb3JtIiwgInpvb21fZGVmYXVsdCIsICJmaWx0ZXIiLCAiem9vbSIsICJzZWxlY3Rpb24iLCAieCIsICJ5IiwgImV4dGVudCIsICJ0cmFuc2l0aW9uIiwgImEiLCAidHlwZSIsICJzZWxlY3RfZGVmYXVsdCIsICJub2V2ZW50X2RlZmF1bHQiLCAibm9wcm9wYWdhdGlvbiIsICJldmVudCIsICJjb25zdGFudF9kZWZhdWx0IiwgInNlbGVjdF9kZWZhdWx0IiwgImlkIiwgInpvb21fZGVmYXVsdCIsICJ4X2RlZmF1bHQiLCAieV9kZWZhdWx0IiwgImxpbmtzIiwgIm0iLCAieCIsICJ4MiIsICJ5MiIsICJpZGVudGl0eSJdCn0K
