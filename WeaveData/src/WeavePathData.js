/* Methods and properties added to facilitate creation of external linked tools.
 * This assumes that WeavePath.js has already been loaded. */
/* "use strict"; */

weave.WeavePath.prototype.probe_keyset = weave.path("defaultProbeKeySet");
weave.WeavePath.prototype.selection_keyset = weave.path("defaultSelectionKeySet");
weave.WeavePath.prototype.subset_filter = weave.path("defaultSubsetKeyFilter");

weave.WeavePath.Keys = {};

weave.WeavePath.Keys._qkeys_to_numeric = {};
weave.WeavePath.Keys._numeric_to_qkeys = {};
weave.WeavePath.Keys._numeric_key_idx = 0;
weave.WeavePath.Keys._keyIdPrefix = "WeaveQKey";

weave.WeavePath.Keys.qkeyToIndex = function(key)
{
    var local_map = this._qkeys_to_numeric[key.keyType] || (this._qkeys_to_numeric[key.keyType] = {});

    if (local_map[key.localName] === undefined)
    {
        var idx = this._numeric_key_idx++;

        local_map[key.localName] = idx;
        this._numeric_to_qkeys[idx] = key;
    }

    return local_map[key.localName];
};

weave.WeavePath.Keys.indexToQKey = function (index)
{
    return this._numeric_to_qkeys[index];
};

weave.WeavePath.Keys.qkeyToString = function(key)
{
    return this._keyIdPrefix + this.qkeyToIndex(key);
};

weave.WeavePath.Keys.stringToQKey = function(s) 
{
    idx = s.substr(this._keyIdPrefix.length);
    return this.indexToQKey(idx);
};

weave.WeavePath.Keys._getKeyBuffers = function (pathArray)
{
    var path_key = JSON.stringify(pathArray);

    var key_buffers_dict = this._key_buffers || (this._key_buffers = {});
    var key_buffers = key_buffers_dict[path_key] || (key_buffers_dict[path_key] = {});

    if (key_buffers.add === undefined) key_buffers.add = {};
    if (key_buffers.remove === undefined) key_buffers.remove = {};
    if (key_buffers.timeout_id === undefined) key_buffers.timeout_id = null;

    return key_buffers;
};

weave.WeavePath.Keys._flushKeys = function (pathArray)
{
    var key_buffers = this._getKeyBuffers(pathArray);
    var add_keys = Object.keys(key_buffers.add);
    var remove_keys = Object.keys(key_buffers.remove);

    add_keys = add_keys.map(this.stringToQKey, this);
    remove_keys = remove_keys.map(this.stringToQKey, this);

    key_buffers.add = {};
    key_buffers.remove = {};

    weave.evaluateExpression(pathArray, 'this.addKeys(keys)', {keys: add_keys}, null, "");
    weave.evaluateExpression(pathArray, 'this.removeKeys(keys)', {keys: remove_keys}, null, "");

    key_buffers.timeout_id = null;
}.bind(weave.WeavePath.Keys);

weave.WeavePath.Keys._flushKeysLater = function(pathArray)
{
    var key_buffers = this._getKeyBuffers(pathArray);
    if (key_buffers.timeout_id === null)
        key_buffers.timeout_id = window.setTimeout(weave.WeavePath.Keys._flushKeys, 25, pathArray);
};

weave.WeavePath.Keys._addKeys = function(pathArray, keyStringArray)
{
    var key_buffers = this._getKeyBuffers(pathArray);
    
    keyStringArray.forEach(function(key)
    {
        key_buffers.add[key] = true;
        delete key_buffers.remove[key];
    });

    this._flushKeysLater(pathArray);
};

weave.WeavePath.Keys._removeKeys = function(pathArray, keyStringArray)
{
    var key_buffers = this._getKeyBuffers(pathArray);
    
    keyStringArray.forEach(function(key)
    {
        key_buffers.remove[key] = true;
        delete key_buffers.add[key];
    });

    this._flushKeysLater(pathArray);
};

weave.WeavePath.prototype.qkeyToString = weave.WeavePath.Keys.qkeyToString.bind(weave.WeavePath.Keys);
weave.WeavePath.prototype.stringToQKey = weave.WeavePath.Keys.stringToQKey.bind(weave.WeavePath.Keys);
weave.WeavePath.prototype.indexToQKey = weave.WeavePath.Keys.indexToQKey.bind(weave.WeavePath.Keys);
weave.WeavePath.prototype.qkeyToIndex = weave.WeavePath.Keys.qkeyToIndex.bind(weave.WeavePath.Keys);


/**
 * Creates a new property based on configuration stored in a property descriptor object. 
 * See initProperties for documentation of the property_descriptor object.
 * @param callback_pass If false, create object, verify type, and set default value; if true, add callback;
 * @param property_descriptor An object containing, minimally, a 'name' property defining the name of the session state element to be created.
 * @return The current WeavePath object.
 */
weave.WeavePath.prototype._initProperty = function(manifest, callback_pass, property_descriptor)
{
    var name = property_descriptor["name"] || this._failMessage('initProperty', 'A "name" is required');
    var label = property_descriptor["label"];
    var children = Array.isArray(property_descriptor["children"]) ? property_descriptor["children"] : undefined;
    var type = property_descriptor["type"] || (children ? "LinkableHashMap" : "LinkableVariable");
    
    var new_prop = this.push(name);

    if (callback_pass)
    {
        var callback = property_descriptor["callback"];
        var triggerNow = property_descriptor["triggerNow"];
        var immediate = property_descriptor["immediate"];
        if (callback)
            new_prop.addCallback(
            	callback,
            	triggerNow !== undefined ? triggerNow : true,
            	immediate !== undefined ? immediate : false
            );
    }
    else
    {
        var oldType = new_prop.getType();
        
        new_prop.request(type);

        if (label)
        {
            new_prop.label(label);
        }

        if (oldType != type && property_descriptor.hasOwnProperty("default"))
        {
            new_prop.state(property_descriptor["default"]);
        }

        manifest[name] = new_prop;
    }

    if (children)
    {
        if (!callback_pass) manifest[name] = {};
        children.forEach(this._initProperty.bind(new_prop, manifest[name], callback_pass));
    }

    return this;
};

/**
 * Creates a set of properties for a tool from an array of property descriptor objects.
 * Each property descriptor can contain the follow properties:
 * 'name': Required, specifies the name for the session state item.
 * 'children': Optionally, another array of property descriptors to create as children of this property.
 * 'label': A human-readable display name for the session state item.
 * 'type': A Weave session variable type; defaults to "LinkableVariable," or "LinkableHashMap" if children is defined.
 * 'callback': A function to be called when this session state item (or a child of it) changes.
 * 'triggerNow': Specify whether to trigger the callback after it is added; defaults to 'true.'
 * 'immediate': Specify whether to execute the callback in immediate (once per change) or grouped (once per frame) mode.
 * @param property_descriptor_array An array of property descriptor objects, each minimally containing a 'name' property.
 * @param manifest An object to populate with name->path relationships for convenience.
 * @return The current WeavePath object.
 */
weave.WeavePath.prototype.initProperties = function(property_descriptor_array, manifest)
{
    if (this.getType() == null) 
        this.request("ExternalTool");

    if (!manifest) manifest = {};

    /* Creation and default-setting pass */
    property_descriptor_array.forEach(this._initProperty.bind(this, manifest, false));
    /* Attaching callback pass */
    property_descriptor_array.forEach(this._initProperty.bind(this, manifest, true));

    return manifest;
};

weave.WeavePath.prototype.getProperties = function(/*...relativePath*/)
{
    var names = this.getNames.apply(this, arguments);
    var result = {};
    for (var idx = 0; idx < names.length; idx++)
    {
        name = names[idx];
        result[name] = this.push(name);
    }
    return result;
};

weave.WeavePath.prototype.getKeys = function(/*...relativePath*/)
{
	var args = this._A(arguments, 1);
	var path = this._path.concat(args);
    var raw_keys = this.weave.evaluateExpression(path, "this.keys");
    return raw_keys.map(this.qkeyToString);
};

weave.WeavePath.prototype.flushKeys = function (/*...relativePath*/)
{
    var args = this._A(arguments, 1);
    if (this._assertParams('flushKeys', args))
    {
        var path = this._path.concat(args);

        this.weave.WeavePath.Keys._flushKeys(path);
    }
    return this;
};

weave.WeavePath.prototype.addKeys = function (/*...relativePath, keyStringArray*/)
{
    var args = this._A(arguments, 2);

    if (this._assertParams('addKeys', args))
    {
        var keyStringArray = args.pop();
        var path = this._path.concat(args);

        this.weave.WeavePath.Keys._addKeys(path, keyStringArray);
    }
    return this;
};

weave.WeavePath.prototype.removeKeys = function (/*...relativePath, keyStringArray*/)
{
    var args = this._A(arguments, 2);

    if (this._assertParams('removeKeys', args))
    {
        var keyStringArray = args.pop();
        var path = this._path.concat(args);

        this.weave.WeavePath.Keys._removeKeys(path, keyStringArray);
    }
    return this;
};

weave.WeavePath.prototype.addKeySetCallback = function (callback, triggerCallbackNow)
{
    function wrapper()
    {
        var key_event = this.weave.evaluateExpression(this._path, '{added: this.keysAdded, removed: this.keysRemoved}');
        
        key_event.added = key_event.added.map(this.qkeyToString);
        key_event.removed = key_event.removed.map(this.qkeyToString);

        callback.call(this, key_event);
    }

    this.push('keyCallbacks').addCallback(wrapper, false, true);

    if (triggerCallbackNow)
    {
        var key_event = {
        	added: this.getKeys(),
        	removed: []
        };

        callback.call(this, key_event);
    }

    return this;
};

weave.WeavePath.prototype.setKeys = function(/*...relativePath, keyStringArray*/)
{
    var args = this._A(arguments, 2);
    if (this._assertParams('setKeys', args))
    {
        var keyStringArray = args.pop();
        var keyObjectArray = keyStringArray.map(this.stringToQKey);
        var path = this._path.concat(args);
        this.weave.evaluateExpression(path, 'this.replaceKeys(keys)', {keys: keyObjectArray}, null, "");

        return this;
    };
    return this;
};

weave.WeavePath.prototype.filterKeys = function (/*...relativePath, keyStringArray*/)
{
    var args = this._A(arguments, 2);
    if (this._assertParams('filterKeys', args))
    {
        var keyStringArray = args.pop();
        var keyObjects = keyStringArray.map(this.stringToQKey);
        var path = this._path.concat(args);
        var resultArray = this.weave.evaluateExpression(
        	path,
            'WeaveAPI.QKeyManager.convertToQKeys(keys).filter(key => this.containsKey(key), this)',
            {keys: keyObjects}
        );
        return resultArray.map(this.qkeyToString, this);
    }
};

/**
 * Retrieve a list of records defined by a mapping of property names to column paths or by an array of column names.
 
 * @param pathMapping An object containing a mapping of desired property names to column paths or an array of child names.
 * pathMapping can be one of three different forms:
 * An array of column names corresponding to children of the WeavePath this method is called from, e.g., path.retrieveRecords(["x", "y"]);
 * the column names will also be used as the corresponding property names in the resultant records.
 * An object, for which each property=>value is the target record property => source column WeavePath. This can be defined to include recursive structures, e.g.,
 * path.retrieveRecords({point: {x: x_column, y: y_column}, color: color_column}), which would result in records with the same form.
 * If it is omitted, all children of the WeavePath will be retrieved. This is equivalent to: path.retrieveRecords(path.getNames());
 * The alphanumeric QualifiedKey for each record will be stored in the 'id' field, which means it is to be considered a reserved name.
 * @param keySetPath A path object pointing to an IKeySet (columns are also IKeySets.)
 * @return An array of record objects.
 */

weave.WeavePath.prototype.retrieveRecords = function()
{
    /* top-level retrieveRecords handles checking the types and length of the arguments before calling _retrieveRecords */

    var path_spec = null;
    var filter_keyset = null;

    if (arguments.length == 0)
        path_spec = this.getNames();

    if (arguments.length == 1)
    {
        if (arguments[0] instanceof weave.WeavePath)
        {
            path_spec = this.getNames();
            filter_keyset = arguments[0];
        }
        else
            path_spec = arguments[0];
    }
    
    if (arguments.length == 2)
    {
        path_spec = arguments[0];
        filter_keyset = arguments[1];
    }

    return this._retrieveRecords(path_spec, filter_keyset);
}



weave.WeavePath.prototype._retrieveRecords = function(path_spec, filter_keyset)
{
    /* _retrieveRecords converts array arguments to path_spec arguments before calling __retrieveRecords */

    var full_path_spec;
    var idx;
    if (Array.isArray(path_spec))
    {
        final_spec = {};
        for (idx = 0; idx < path_spec.length; idx++)
        {
            final_spec[path_spec[idx]] = this.push(path_spec[idx]);
        }
        return this.__retrieveRecords(final_spec, filter_keyset);
    }
    else
    {
        return this.__retrieveRecords(path_spec, filter_keyset);
    }
}

weave.WeavePath.prototype.__retrieveRecords = function(path_spec, keyset_path)
{
    /* Performs the actual retrieval of records */
    var flat_path_spec = this._listChains(path_spec);

    var raw_chains = flat_path_spec.map(function(d) {return d.chain;});

    var raw_paths = flat_path_spec.map(function(d) {return d.path;});

    var keyset_path = keyset_path ? keyset_path.getPath() : null;

    var results = this.weave.evaluateExpression(
    	this._path,
        '\
    		var getObject = WeaveAPI.SessionManager.getObject;\
        	var root = WeaveAPI.globalHashMap;\
        	var keySet = keySetPath ? getObject(root, keySetPath) : null;\
        	var columns = paths.map(path => getObject(root, path));\
        	return ColumnUtils.joinColumns(columns, null, true, keySet);\
    	',
    	{
    		paths: raw_paths,
    		keySetPath: keyset_path
    	},
    	['weave.utils.ColumnUtils']
    );
    
    results[0] = results[0].map(this.qkeyToString);

    var records = new Array(results[0].length);
    for (var record_idx = 0; record_idx < results[0].length; record_idx++)
    {
        var new_record = {};

        new_record.id = results[0][record_idx];

        for (var column_idx = 0; column_idx < raw_chains.length; column_idx++)
        {
            this._setChain(new_record, raw_chains[column_idx], results[column_idx+1][record_idx]);
        }

        records[record_idx] = new_record;
    }
    return records;
}

/**
 * Sets a human-readable label for an ILinkableObject to be used in editors.
 * @param relativePath An optional Array (or multiple parameters) specifying child names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @param The human-readable label for an ILinkableObject.
 * @return The current WeavePath object.
 */
weave.WeavePath.prototype.label = function(/*...relativePath, label*/)
{
	var args = this._A(arguments, 2);
	if (this._assertParams('setLabel', args))
	{
		var label = args.pop();
		var path = this._path.concat(args);
		this.weave.evaluateExpression(path, "WeaveAPI.EditorManager.setLabel(this, label)", {"label": label}, null, "");
	}
	return this;
}

/**
 * Gets the previously-stored human-readable label for an ILinkableObject.
 * @param relativePath An optional Array (or multiple parameters) specifying child names relative to the current path.
 *                     A child index number may be used in place of a name in the path when its parent object is a LinkableHashMap.
 * @return The human-readable label for an ILinkableObject.
 */
weave.WeavePath.prototype.getLabel = function(/*...relativePath*/)
{
	var args = this._A(arguments, 1);
	var path = this._path.concat(args);
	return this.weave.evaluateExpression(path, "WeaveAPI.EditorManager.getLabel(this)");
};

/* Functions used by retrieveRecords */

/**
 * @private
 * Walk down a property chain of a given object and set the value of the final node.
 * @param root The object to navigate through.
 * @param property_chain An array of property names defining a path.
 * @param value The value to which to set the final node.
 * @return The value that was set.
 */
weave.WeavePath.prototype._setChain = function(root, property_chain, value)
{
    property_chain = property_chain.concat([]); /* Make a copy so we don't modify it */
    last_property = property_chain.pop();
    last_node = this._getChain(root, property_chain);
    last_node[last_property] = value;
    return value;
}
/**
 * @private
 * Walk down a property chain of a given object and return the final node.
 * @param root The object to navigate through.
 * @param property_chain An array of property names defining a path.
 * @return The value of the final property in the chain.
 */

weave.WeavePath.prototype._getChain = function(root, property_chain)
{
    var node = root;
    var idx;

    for (idx = 0; idx < property_chain.length; idx++)
    {
        if (node[property_chain[idx]] === undefined) node[property_chain[idx]] = {};
        node = node[property_chain[idx]];
    }

    return node;
}


/**
 * @private
 * Recursively builds a mapping of property chains to WeavePath objects from a path specification as used in retrieveRecords
 * @param obj A path spec object
 * @param prefix A property chain prefix
 * @return A list of objects of the format {chain: ..., path: ...}
 */

weave.WeavePath.prototype._listChains = function(obj, prefix)
{
    var chains = [];
    var idx = 0;

    if (prefix == undefined)
        prefix = [];

    var keys = Object.keys(obj);

    for (idx = 0; idx < keys.length; idx++)
    {
        var item = obj[keys[idx]];
        if (item instanceof weave.WeavePath)
        {
            if (this.weave.evaluateExpression(item.getPath(), "this is IAttributeColumn", null, ['weave.api.data.IAttributeColumn']))
                chains.push({chain: prefix.concat([keys[idx]]), path: item.getPath()});
        }
        else
        {
            chains = chains.concat(this._listChains(item, prefix.concat([keys[idx]])));
        }
    }
    return chains;
}
