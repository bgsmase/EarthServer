/**
 * @namespace Namespace for the Earth Server Generic Client
 * @version 0.7 alpha 18.06.2014
 */
var EarthServerGenericClient =  {};

/**
 * @ignore Just Inheritance Helper
 */
Function.prototype.inheritsFrom = function( parentClassOrObject )
{
    if ( parentClassOrObject.constructor == Function )
    {
        //Normal Inheritance
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
};

/**
 * @ignore remove function for arrays - By John Resig
 */
EarthServerGenericClient.arrayRemove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

/**
 * @ignore Helper function to replace all occurrences in strings
 */
EarthServerGenericClient.replaceAllFindsInString = function (str,find,replace)
{
    return str.split(find).join(replace);
};

/**
 * @ignore Helper function to check if an input is numeric.
 * @param input
 * @returns {boolean}
 * @constructor
 */
EarthServerGenericClient.IsNumeric = function(input)
{
    return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
};

/**
 * This function checks if this code is running is on a mobile platform.
 * @return true if mobile platform, false if not
 */
EarthServerGenericClient.isMobilePlatform = function ()
{
    var mobilePlatform = (function(a)
    {
        if(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|opera m(ob|in)i|palm(os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows(ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|awa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r|s)|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp(i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac(|\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt(|\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg(g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-||o|v)|zz)|mt(50|p1|v)|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v)|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-|)|webc|whit|wi(g|nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
        {return true} else {return false}
    })(navigator.userAgent||window.opera);

    return mobilePlatform;
};

/**
 * @ignore Helper function to delete all children of a dom element.
 */
EarthServerGenericClient.deleteAllChildsFromDomElement = function(domElementID)
{
    var domElement = document.getElementById(domElementID);

    if(domElement)
    {
        while(domElement.firstChild)
        {
            domElement.removeChild(domElement.firstChild);
        }
    }
};

/**
 * @class Creates a light to enlighten the scene.
 * @param domElement - Dom element to append the light to.
 * @param index - Index of the light.
 * @param position - Position of the light (local coordinates)
 * @param radius - Radius of the light.
 * @param color - Color if the Light
 * @constructor
 */
EarthServerGenericClient.Light = function(domElement,index,position,radius,color)
{
    var ambientIntensity = "0.5";
    var intensity        = "0.8";

    if(position === undefined){  position = "0 1000 0";    }
    if(radius === undefined ) {  radius = "8000";    }
    if(color === undefined)   {  color = "1 1 1"; }

    if(domElement !== undefined && domElement !== null)
    {
        var light = document.createElement("PointLight");
        light.setAttribute("id", "EarthServerGenericClient_Light_"+index);
        light.setAttribute("ambientIntensity",ambientIntensity);
        light.setAttribute("color",color);
        light.setAttribute("intensity",intensity);
        light.setAttribute("radius",radius);
        light.setAttribute("location",position);

        domElement.appendChild(light);
        light = null;
    }
};

/**
 * @class SceneManager is the main class of the unified client.
 * All scene models are registered in this class with the add() function.
 * The createScene() function creates a x3dom scene with all scene models.
 * The createUI() function creates the UI.
 */
EarthServerGenericClient.SceneManager = function()
{
    var models = [];               // Array of scene models
    var modelLoadingProgress = []; // Array to store the models loading progress
    var totalLoadingProgress = 0;  // Value for the loading progress bar (all model loading combined)
    var baseElevation = [];        // Every Model has it's base elevation on the Y-Axis. Needed to change and restore the elevation.
    var baseWidth = [];            // Every Model has it's base width on the X-Axis. Needed to change and restore the width.
    var baseLength = [];            // Every Model has it's base length on the Z-Axis. Needed to change and restore the length.
    var progressCallback = undefined;// Callback function for the progress update.
    var annotationLayers = [];      // Array of AnnotationsLayer to display annotations in the cube
    var viewpoints = [];            // Array of user created viewpoints
    var cameraDefs = [];            // Name and ID of the specified cameras. Format: "NAME:ID"
    var lights = [];                // Array of (Point)lights
    var lightInScene = false;       // Flag if a light should be added to the scene
    var nextFrameCallback = [];     // Array of callbacks that should be done in any next frame.
    var lastFrameInsert = Number.MAX_VALUE; // Frame counter since the last insertion of data into the dom
    var framesBetweenDomInsertion = 1; // Number of frames between two insertions into the dom.
    var oculusRift = false;         // Flag if the scene is rendered for the oculus rift.
    var InstantIOPort = undefined;  // Port to Instant IO to connect the oculus rift.
    var drawCube = true;            // Flag if the cube should be drawn.
    var defaultSpecularColor = "0.25,0.25,0.25"; // default specular color for materials
    var defaultDiffuseColor = "1 1 1"; // default diffuse color for materials
    var keyMapping = {};            // Stores the keys for certain events
    var globalElevationValue = 10;  // Stores the last used global elevation value
    var lightObserver = []; // Array of light observer
    var drawGrid = false;           // Flag if a grid shall be drawn.
    var drawCompass = false;        // Flag if the compass shall be drawn
    var compassRotation = 0;        // Rotation of the compass
    var compassColor = "0.8 0.8 0.8";// Color of the compass
    var compassLabel = "N";         // Label for the compass
    var CubeBaseQuery = null;       // A image query for the base of the cube
    var CubeBaseFactor = 1;         // Factor to multiply the base shape.
    var subsetting = false;          // Enable slicer for seubsetting
    var subsetManager = null;       // Manager for subsetting
    var navigationType = null;      // Type of navigation
    var navigationParams = null;    // Parameters for the navigation type
    var enableGlobalSeparation=false; // Flag if global separation should be enabled
    var separationVector = [];   // Vector for model separation
    separationVector[0] = 1;
    separationVector[1] = 1;
    separationVector[2] = 1;
    var minDataValue = [];          // Array with the minum data value for each axis
    var addClippingPlanes =  false;     // Flag if clipping plane should be added
    var clippingPlanes = [];        // arra for clipping planes

    // Default cube sizes
    var cubeSizeX = 1000;
    var cubeSizeY = 1000;
    var cubeSizeZ = 1000;

    // Background
    var Background_groundAngle = "0.9 1.5 1.57";
    var Background_groundColor = "0.8 0.8 0.95 0.4 0.5 0.85 0.3 0.5 0.85 0.31 0.52 0.85";
    var Background_skyAngle    = "0.9 1.5 1.57";
    var Background_skyColor    = "0.8 0.8 0.95 0.4 0.5 0.85 0.3 0.5 0.85 0.31 0.52 0.85";

    /**
     * The maximum resolution in one axis of one scene model.
     * @default 2000
     * @type {number}
     */
    var maxResolution = 2000;

    /**
     * Enables/Disables the logging of Server requests, building of terrain etc.
     * @default false
     * @type {boolean}
     */
    var timeLog= false;

    /**
     * This variable contains the AxisLabel object.
     * This object manages the labels and its appearances on each axis.
     * @default null
     * @type {Object}
     */
    var axisLabels = null;

    /**
     * Initiates the default key mapping.
     */
    this.initKeyMapping = function()
    {
        // Go to viewpoint x
        keyMapping.vp1 = 49; // key: 1
        keyMapping.vp2 = 50; // key: 2
        keyMapping.vp3 = 51; // key: 3
        keyMapping.vp3 = 51; // key: 3
        keyMapping.vp4 = 52; // key: 4
        keyMapping.vp5 = 53; // key: 5
        keyMapping.vp6 = 54; // key: 6

        // modify light
        keyMapping.lightDown = 57; // key: 9
        keyMapping.lightUp   = 48; // key: 0

        // global elevation
        keyMapping.globalElevUp   = 105; // key: i
        keyMapping.globalElevDown = 107; // key: k

        // prompts the current viewpoint
        keyMapping.cvp = 66; // key: B
    };

    /**
     * Sets a custom short cut key. Events can be:
     * "ViewPointX": While x is a number between 1-6. Goes to viewpoint x.
     * "ShowViewPoint": Prompts the current viewpoint.
     * "LightDown"/"LightUp": changes the intensity of the light source.
     * "ElevationDown"/ElevationUp": changes the global elevation.
     * @param event - The event.
     * @param key - The key as char.
     */
    this.setShortCut = function(event,key)
    {
        // get the char value
        var value = String(key).charCodeAt(0);

        if(event.toLowerCase() === "viewpoint1") keyMapping.vp1 = value;
        if(event.toLowerCase() === "viewpoint2") keyMapping.vp2 = value;
        if(event.toLowerCase() === "viewpoint3") keyMapping.vp3 = value;
        if(event.toLowerCase() === "viewpoint4") keyMapping.vp4 = value;
        if(event.toLowerCase() === "viewpoint5") keyMapping.vp5 = value;
        if(event.toLowerCase() === "viewpoint6") keyMapping.vp6 = value;

        if(event.toLowerCase() === "showviewpoint") keyMapping.cvp = value;
        if(event.toLowerCase() === "elevationdown") keyMapping.globalElevDown = value;
        if(event.toLowerCase() === "elevationup")   keyMapping.globalElevUp = value;
        if(event.toLowerCase() === "lightup")       keyMapping.lightUp = value;
        if(event.toLowerCase() === "lightdwon")     keyMapping.lightDown = value;
    };

    /**
     * Handles the pressed key.
     */
    this.handleKeys = function (e)
    {
        var key = e.charCode;

        switch(key)
        {
            case keyMapping.vp1: this.setViewByCameraDefIndex(0);  break;
            case keyMapping.vp2: this.setViewByCameraDefIndex(1);  break;
            case keyMapping.vp3: this.setViewByCameraDefIndex(2);  break;
            case keyMapping.vp4: this.setViewByCameraDefIndex(3);  break;
            case keyMapping.vp5: this.setViewByCameraDefIndex(4);  break;
            case keyMapping.vp6: this.setViewByCameraDefIndex(5);  break;

            case keyMapping.cvp:        this.showCurrentViewPoint(); break;
            case keyMapping.lightUp:    this.increaseLightIntensity(0); break;
            case keyMapping.lightDown:  this.decreaseLightIntensity(0); break;
            case keyMapping.globalElevUp: this.increaseGlobalElevation(); break;
            case keyMapping.globalElevDown: this.decreaseGlobalElevation(); break;
            //default: console.log("No key defined for char: " + key);
        }
    };

    /**
     * Shows an alert with the current viewpoint.
     */
    this.showCurrentViewPoint = function()
    {
        var e = document.getElementById('x3d');
        var mat_view = e.runtime.viewMatrix().inverse();

        var rotation = new x3dom.fields.Quaternion(0, 0, 1, 0);
        rotation.setValue(mat_view);
        var rot = rotation.toAxisAngle();
        var translation = mat_view.e3();

        var text = '"' + translation.x.toFixed(5) + ' '
            + translation.y.toFixed(5) + ' ' + translation.z.toFixed(5) + '", ' +
            '"' + rot[0].x.toFixed(5) + ' ' + rot[0].y.toFixed(5) + ' '
            + rot[0].z.toFixed(5) + ' ' + rot[1].toFixed(5)+'"';

        window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
    };

    /**
     * Sets if the x3dom oculus rift mode shall be enabled.
     * @param value - True/False
     * @param port - Instant IO Port
     */
    this.setOculusRift = function( value, port )
    {
        oculusRift = value;
        InstantIOPort = port;
    };

    /**
     * Sets the link or query for the image that should be displayed at the bottom of the cube.
     * @param query - The query or link.
     * qparam multiplication - Multiplicates the base with this factor.
     */
    this.setCubeBaseLink = function( query, multiplication )
    {
        CubeBaseQuery = query;

        if( multiplication)
            CubeBaseFactor = multiplication;
    };

    /**
     * Sets the flag if subsetting should be enabled in the cube and the UI.
     * @param value
     */
    this.setSubSetting = function( value )
    {
        subsetting = value;
    };

    /**
     * Sets the flag if clipping planes should be added to the scene.
     * @param value
     */
    this.setClippingPlane = function( value )
    {
        addClippingPlanes = value;
    };

    /**
     * Sets the flag if global separation should be enabled in the UI.
     * @param value
     */
    this.setGlobalSeparationFlag = function( value )
    {
        enableGlobalSeparation = value;
    };

    /**
     * Returns the values of the subsetting slices.
     * Or null if subsetting is disabled.
     * @returns {*}
     */
    this.getSubSettingValues = function()
    {
        if( subsetManager )
        {
            return subsetManager.getValues();
        }
        else
            return null;
    };

    /**
     * Returns the world values of the subsetting slices.
     * Or null if subsetting is disabled.
     * @returns {*}
     */
    this.getSubSettingWorldValues = function()
    {
        if( subsetManager )
        {
            return subsetManager.getWorldValues();
        }
        else
            return null;
    };
    /**
     * Updates the subsetting values after a slider event.
     * @param axis - Which Axis was changed.
     * @param min - The new minimum value.
     * @param max - The new maximum value.
     */
    this.setSubSettingValues = function(axis,min,max)
    {
        if( subsetManager )
        {    subsetManager.updateSlicePosition(axis,min,max); }
        else
            console.log("EarthServerGenericClient:MainScene:setSubSettingValues: Subsetting disabled");
    };

    /**
     * Returns the flag if subsetting is enabled.
     */
    this.getSubsettingFlag = function( )
    {
        return subsetting;
    };

    /**
     * Returns the flag if global separation is enabled.
     * @returns {boolean}
     */
    this.getGlobalSeparationFlag = function( )
    {
        return enableGlobalSeparation;
    };

    /**
     * Returns the flag if clipping planes are enabled.
     * @returns {boolean}
     */
    this.getClippingPlaneFlag =  function()
    {
        return addClippingPlanes;
    };

    /**
     * Adds custom viewpoints to the scene and UI.
     * Viewpoints can be put out to the debug console by pressing 'd' and 'v'.
     * @param name - Name of the Viewpoint for the UI.
     * @param Position - Position of the viewpoint.
     * @param Orientation - Orientation of the viewpoint.
     */
    this.addCustomViewPoint = function(name,Position,Orientation)
    {
        // check if viewpoint with this name already exist
        for(var i=0; i<viewpoints.length;i++)
        {
            if( viewpoints[i].name === name)
            {
                console.log("EarthServerClient::MainScene::addCustomViewPoint: Viewpoint with name" + name + " already exist.");
                return;
            }
        }

        var vp = {};
        vp.name = name;
        vp.position = Position;
        vp.orientation = Orientation;

        viewpoints.push( vp );
    };

    /**
     * Resets the X3D Scene. All global setting of the scene keeps the the same.
     */
    this.resetScene = function()
    {
        // TODO: TEST function with different setups
        // clear all models and terrains
        for(var i=0; i<models.length; i++)
        {
            models[i].terrain.clearMaterials();
            models[i].terrain.clearDefinedAppearances();
            models[i].terrain = null;
        }

        // reset vars
        models = [];
        modelLoadingProgress = [];
        totalLoadingProgress = 0;
        baseElevation = [];
        baseWidth = [];
        baseLength = [];
        progressCallback = undefined;
        annotationLayers = [];
        cameraDefs = [];
        lights = [];
        nextFrameCallback = [];
        lastFrameInsert = Number.MAX_VALUE;
        lightObserver = [];

        // reset x3d scene
        EarthServerGenericClient.deleteAllChildsFromDomElement( this.x3dID );

        // destroy UI
        EarthServerGenericClient.deleteAllChildsFromDomElement( this.UIID );
        EarthServerGenericClient.destroyBasicUI( this.UIID );

        // add root and scene group nodes
        var root = document.createElement("group");
        root.setAttribute("id","root");
        var scene = document.createElement("group");
        scene.setAttribute("id",this.sceneID);

        root.appendChild(scene);
        var x3d = document.getElementById( this.x3dID);
        if(x3d)
            x3d.appendChild(root);
    };

    /**
     * Sets the default specular color for all modules.
     * The color set directly for a module overwrite this color.
     * @param color - Default Color in rgb e.g.: 0.25 0.25 0.25
     */
    this.setDefaultSpecularColor = function(color)
    {
        defaultSpecularColor = color;
    };

    /**
     * Return the default specular color.
     * @returns {string} - Default specular color in rgb.
     */
    this.getDefaultSpecularColor = function()
    {
        return defaultSpecularColor;
    };

    /**
     * Sets the default specular color for all modules.
     * The color set directly for a module overwrite this color.
     * @param color - Default Color in rgb e.g.: 0.25 0.25 0.25
     */
    this.setDefaultDiffuseColor = function(color)
    {
        defaultDiffuseColor = color;
    };

    /**
     * Return the default diffuse color.
     * @returns {string} - Default diffuse color in rgb.
     */
    this.getDefaultDiffuseColor = function()
    {
        return defaultDiffuseColor;
    };

    /**
     * Return the size of the cube in the x axis
     * @returns {number}
     */
    this.getCubeSizeX = function()
    {   return cubeSizeX;   };

    /**
     * Return the size of the cube in the y axis
     * @returns {number}
     */
    this.getCubeSizeY = function()
    {   return cubeSizeY;   };

    /**
     * Return the size of the cube in the z axis
     * @returns {number}
     */
    this.getCubeSizeZ = function()
    {   return cubeSizeZ;   };

    /**
     * Return the minimum of the cube in the x axis
     * @returns {number}
     */
    this.getCubeMinimumX = function()
    {   return -(cubeSizeX/2.0);   };

    /**
     * Return the minimum of the cube in the y axis
     * @returns {number}
     */
    this.getCubeMinimumY = function()
    {   return -(cubeSizeY/2.0);   };

    /**
     * Return the minimum of the cube in the z axis
     * @returns {number}
     */
    this.getCubeMinimumZ = function()
    {   return -(cubeSizeZ/2.0);   };

    /**
     * Return the maximum of the cube in the x axis
     * @returns {number}
     */
    this.getCubeMaximumX = function()
    {   return (cubeSizeX/2.0);   };

    /**
     * Return the maximum of the cube in the y axis
     * @returns {number}
     */
    this.getCubeMaximumY = function()
    {   return (cubeSizeY/2.0);   };

    /**
     * Return the maximum of the cube in the z axis
     * @returns {number}
     */
    this.getCubeMaximumZ = function()
    {   return (cubeSizeZ/2.0);   };

    /**
     * Returns the cube's minimum and maximum values on all three axii.
     * @returns {{}}
     */
    this.getCubeDimensions = function()
    {
        var cube = {};

        cube.minX = this.getCubeMinimumX();
        cube.maxX = this.getCubeMaximumX();
        cube.minY = this.getCubeMinimumY();
        cube.maxY = this.getCubeMaximumY();
        cube.minZ = this.getCubeMinimumZ();
        cube.maxZ = this.getCubeMaximumZ();

        return cube;
    };

    /**
     * Sets if a light is inserted into the scene.
     * @param value - Boolean value.
     */
    this.addLightToScene = function(value)
    {
        lightInScene = value;
    };

    /**
     * Sets if the cube should be drawn.
     * @param value - Boolean value.
     */
    this.setDrawCube = function(value)
    {
        drawCube = value;
    };

    /**
     * Sets if the compass should be drawn.
     * @param rotation - Rotation of the compass in [0 - 2*PI] (Optional).
     * @param color - Color of the compass (Optional).
     * @param label - Label for the compass (Optional).
     */
    this.DrawCompass = function( rotation, color, label )
    {
        drawCompass = true;
        if( drawCompass && rotation !== undefined )
            compassRotation = rotation;
        if( drawCompass && color !== undefined)
            compassColor = color;
        if( drawCompass && label !== undefined)
            compassLabel = label;
    };

    /**
     * Draws grids on every sides of the cube except the top.
     * @param cubeMinX - Minimum value on the x-axis.
     * @param cubeMaxX - Maximum value on the x-axis
     * @param cubeMinY - Minimum value on the y-axis.
     * @param cubeMaxY - Maximum value on the y-axis
     * @param cubeMinZ - Minimum value on the z-axis.
     * @param cubeMaxZ - Maximum value on the z-axis
     * @param unitSize - Size after a grid line will be drawn.
     * @param lineSize - Thickness of a grid line.
     */
    this.setDrawGrid = function(cubeMinX,cubeMaxX,cubeMinY,cubeMaxY,cubeMinZ,cubeMaxZ,unitSize,lineSize)
    {
        if(cubeMinX < cubeMaxX && cubeMinY < cubeMaxY && cubeMinZ < cubeMaxZ)
        {
            if(unitSize > 0 || !isNaN(unitSize))
            {
                drawGrid = true;
                this.GridMinAxisValue = [cubeMinX,cubeMinY,cubeMinZ];
                this.GridMaxAxisValue = [cubeMaxX,cubeMaxY,cubeMaxZ];
                this.GridUnitSize = unitSize;
                this.GridLineSize = lineSize || 2;
            }
            else
            {   console.log("EarthServerGenericClient::drawGrid: UnitSize must be a positive number.");    }
        }
        else
        {   console.log("EarthServerGenericClient::drawGrid: At least one minimum value is bigger than the maximum value."); }
    };

    /**
     * Returns the number of scene lights.
     * @returns {Number}
     */
    this.getLightCount = function()
    {
        return lights.length;
    };

    /**
     * This function sets the background of the X3Dom render window. The Background is basically a sphere
     * where the user can sets colors and defines angles to which the colors float.
     * Colors are RGB with floats [0-1] separated by whitespaces. ( "0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9" )
     * Angles are in [0-1.57] (1.57 is PI/2) and also separated by whitespaces. ( "0.9 1.57" )
     * You need exactly one more color than angles like the examples.
     * @param skyColors - Colors of the sky from top to horizon. Three RGB values for each color.
     * @param skyAngles - Angles to where the sky colors are drawn. 1.57 for full sky.
     * @param groundColors - Colors of the ground from bottom to horizon. Three RGB values for each color.
     * @param groundAngles - Angles to where the ground colors are drawn. 1.57 for full ground.
     */
    this.setBackground = function(skyColors,skyAngles,groundColors,groundAngles)
    {
        Background_groundAngle = groundAngles;
        Background_groundColor = groundColors;
        Background_skyAngle    = skyAngles;
        Background_skyColor    = skyColors;
    };

    /**
     * Returns the number of registered scene models.
     * @returns {Number}
     */
    this.getModelCount = function()
    {
        return models.length;
    };

    /**
     * Returns the model object with the given index.
     * @param modelIndex - Index of the model.
     * @returns {Object}
     */
    this.getModel = function(modelIndex)
    {
        if(modelIndex < models.length)
        { return models[modelIndex]; }
        else
        {
            console.log("MainScene::getModel: No model with ID " + modelIndex);
            return undefined;
        }
    };

    /**
     * Returns the name of the scene model with the given index.
     * @param modelIndex - Index of the model.
     * @returns {String}
     */
    this.getModelName = function(modelIndex)
    {
        if(modelIndex < models.length)
        {   return models[modelIndex].name; }
        else
        {   return "No model with ID " + modelIndex;    }
    };

    /**
     * Returns the X offset of the model with the given index.
     * @param modelIndex - Index of the model.
     * @returns {Number}
     */
    this.getModelOffsetX= function(modelIndex)
    {
        if(modelIndex < models.length)
        {   return models[modelIndex].xOffset; }
        else
        {
            console.log("MainScene::getModelOffsetX: No model with ID " + modelIndex);
            return 0;
        }
    };

    /**
     * Returns the Y offset of the model with the given index.
     * @param modelIndex - Index of the model.
     * @returns {Number}
     */
    this.getModelOffsetY= function(modelIndex)
    {
        if(modelIndex < models.length)
        {   return models[modelIndex].yOffset; }
        else
        {
            console.log("MainScene::getModelOffsetY: No model with ID " + modelIndex);
            return 0;
        }
    };

    /**
     * Returns the Z offset of the model with the given index.
     * @param modelIndex - Index of the model.
     * @returns {Number}
     */
    this.getModelOffsetZ= function(modelIndex)
    {
        if(modelIndex < models.length)
        {   return models[modelIndex].zOffset; }
        else
        {
            console.log("MainScene::getModelOffsetZ: No model with ID " + modelIndex);
            return 0;
        }
    };

    /**
     * Returns the transparency of the model with the given index.
     * @param modelIndex - Index of the model.
     * @returns {Number}
     */
    this.getModelTransparency = function(modelIndex)
    {
        if(modelIndex < models.length)
        {   return models[modelIndex].transparency; }
        else
        {
            console.log("MainScene::getModelTransparency: No model with ID " + modelIndex);
            return 0;
        }
    };

    /**
     * Let the scene model set it's specific UI element in the given domElement.
     * @param modelIndex - Index of the model.
     * @param domElement - domElement to put the UI element into.
     */
    this.setSpecificElement = function(modelIndex,domElement)
    {
        if(modelIndex < models.length)
        {   models[modelIndex].setSpecificElement(domElement); }
        else
        {
            console.log("MainScene::SetSpecificElement: No model with ID " + modelIndex);
        }
    };

    /**
     * @default 2000 / 200 on a mobile platform
     * @type {Number}
     */
    if( EarthServerGenericClient.isMobilePlatform())  //and for mobile Clients
        maxResolution = 200;

    /**
     * Enables or disables the logging.
     * @param value - Boolean
     */
    this.setTimeLog = function(value)
    {   timeLog = value; };

    /**
     * Starts the timer for a logging event with the given name.
     * @param eventName
     */
    this.timeLogStart = function(eventName)
    {
        if( timeLog)
        {   console.time(eventName); }
    };

    /**
     * Ends the timer for a logging event with the given name and prints the result.
     * @param eventName
     */
    this.timeLogEnd = function(eventName)
    {
        if( timeLog)
        {   console.timeEnd(eventName); }
    };

    /**
     * Returns the index of a scene model with a given name.
     * @param modelName - Name of the model.
     * @returns {number} - Index of the model or -1 if no model with the given name was found.
     */
    this.getModelIndex = function(modelName)
    {
        for(var i=0;i<models.length;i++)
        {
            if( models[i].name === modelName)
            {
                return i;
            }
        }

        return -1;
    };

    /**
     * This function returns the position within the cube for a specific point, if the cube represents the given area.
     * Returned object has "x","y","z" members and "valid" as a flag whether the point is within the area or not.
     * IF valid is false, "x","y" and "z" are not set and undefined.
     * @param modelIndex - Index of the model the point is used for. Used to determine the height on the y-axis.
     * @param latitude - Latitude coordinate of the point.
     * @param longitude - Longitude coordinate of the point.
     * @param area - Area of the cube.
     * @returns {{}} - Coordinates in scene space of the point.
     */
    this.getCubePositionForPoint = function(modelIndex,latitude,longitude,area)
    {
        var position = {};
        position.valid = false;

        var xPercent = (latitude  - area.minx) / (area.maxx - area.minx);
        var zPercent = (longitude - area.miny) / (area.maxy - area.miny);

        // Check bounds
        if( xPercent <0 || xPercent > 1 || zPercent <0 || zPercent >1)
        {   console.log("EarthServerGenericClient::SceneManager::getCubePositionForPoint: Point is not in the given area"); }
        else
        {
            position.x = (-cubeSizeX/2.0) + xPercent*cubeSizeX;
            position.y = (-cubeSizeY/2.0) + this.getModelOffsetY(modelIndex) * cubeSizeY;
            position.z = (-cubeSizeZ/2.0) + zPercent*cubeSizeZ;
            position.valid = true;
        }

        return position;
    };

    /**
     * Determines if an annotation layer will be drawn.
     * @param layerName - Name of the annotation layer.
     * @param drawValue - boolean value.
     */
    this.drawAnnotationLayer = function(layerName,drawValue)
    {
        var index = this.getAnnotationLayerIndex(layerName);
        if( index < annotationLayers.length )
        {   annotationLayers[index].renderLayer(drawValue); }
        else
        {   console.log("MainScene::drawAnnotationLayer: No Layer with name " + layerName);  }
    };

    /**
     * Returns the annotation texts of a given annotation layer as an array of strings.
     * @param layerName - Name of the Annotation Layer.
     * @returns {*} - Array of Annotations as strings.
     */
    this.getAnnotationLayerTexts = function(layerName)
    {
        var index = this.getAnnotationLayerIndex(layerName);
        if( index < annotationLayers.length )
        {   return annotationLayers[index].getAnnotationTexts(); }
        else
        {
            var val = [];
            val.push("MainScene::getAnnotationLayerTexts: No Layer with name " + layerName);
            return val;
        }
    };

    /**
     * Returns the number of registered AnnotationLayers.
     * @returns {Number}
     */
    this.getAnnotationLayerCount = function()
    {
        return annotationLayers.length;
    };

    /**
     * Returns the name of the AnnotationLayer with the given index.
     * @param layerIndex - Index of the AnnotationLayer.
     * @returns {*} - Either the Name of the AnnotationLayer or "No Name"
     */
    this.getAnnotationLayerName = function(layerIndex)
    {
        if( layerIndex < annotationLayers.length)
        {   return annotationLayers[layerIndex].name; }
        else
        {
            console.log("MainScene::getAnnotationLayerName: No Layer with ID " + layerIndex);
            return "No Name";
        }
    };

    /**
     * Returns the index of an existing AnnotationLayer in the array or -1 if no layer with the given name was found.
     * @param AnnotationLayerName - Name of the Layer
     * @returns {number} - Either index in the array or -1 if not found
     */
    this.getAnnotationLayerIndex = function(AnnotationLayerName)
    {
        for(var i=0;i<annotationLayers.length;i++)
        {
            if( annotationLayers[i].name === AnnotationLayerName)
            {
                return i;
            }
        }

        return -1;
    };

    /**
     * Adds an AnnotationsLayer to the scene.
     * @param layerName - Name of the Layer. You need the name of a layer to add annotations to it.
     * @param modelName - Name of the scene model to bind the layer to. Can be empty if no binding is intended.
     * @param fontSize - Font size of all annotations added to this layer.
     * @param fontColor - Color of all annotations added to this layer.
     * @param fontHover - The annotation text hovers above the annotation marker by this value.
     * @param markerSize - The size if the annotation marker
     * @param markerColor - Color of the annotation marker
     */
    this.addAnnotationsLayer = function(layerName,modelName,fontSize,fontColor,fontHover,markerSize,markerColor)
    {
        var root = document.getElementById("AnnotationsGroup");
        if( root)
        {
            if( this.getAnnotationLayerIndex(layerName) < 0)
            {
                var layer = new EarthServerGenericClient.AnnotationLayer(layerName,root,fontSize,fontColor,fontHover,markerSize,markerColor);
                annotationLayers.push(layer);
                var modelIndex = this.getModelIndex(modelName);
                if( modelIndex >= 0)
                {
                    models[modelIndex].addBinding(layer);
                }
            }
            else
            {   console.log("AnnotationLayer with this name already created.");   }
        }
        else
        {   console.log("Please add Layers after creating the scene.");   }
    };

    /**
     * Adds an annotation to an existing annotation layer.
     * @param AnnotationLayerName - Name of the annotation layer to add the annotation to.
     * @param xPos - Position on the x-axis of the annotation.
     * @param yPos - Position on the y-axis of the annotation.
     * @param zPos - Position on the z-axis of the annotation.
     * @param Text - Text of the annotation.
     */
    this.addAnnotation = function(AnnotationLayerName,xPos,yPos,zPos,Text)
    {
        var index = this.getAnnotationLayerIndex(AnnotationLayerName);
        if( index >= 0)
        {
            annotationLayers[index].addAnnotation(xPos,yPos,zPos,Text);
        }
        else
        {
           console.log("Could not found a AnnotationLayer with name: " + AnnotationLayerName);
        }
    };

    /**
     * Adds an annotation to an existing annotation layer.
     * The position is given in latitude/longitude and has to be in the bounding box of
     * the model the annotation layer is bound to. The annotation is automatically positioned
     * above the model as soon as it's loaded.
     * @param AnnotationLayerName - Name of the annotation layer to add the annotation to.
     * @param latitude - Position in latitude of the annotation.
     * @param longitude - Position in longitude of the annotation.
     * @param Text - Text of the annotation.
     */
    this.addAnnotationAtPosition = function(AnnotationLayerName,latitude,longitude,Text)
    {
        var layerIndex = this.getAnnotationLayerIndex(AnnotationLayerName);
        if( layerIndex >= 0)
        {
            // Check if layer is bound to a model
            var modelIndex = annotationLayers[layerIndex].getBoundModuleIndex();
            if( modelIndex >= 0)// is bound
            {
                // Get model's local area and calc the position in the fishtank
                var area = models[modelIndex].getAreaOfInterest();
                var xPercent = (latitude  - area.minx) / (area.maxx - area.minx);
                var zPercent = (longitude - area.miny) / (area.maxy - area.miny);

                // Check bounds
                if( xPercent <0 || xPercent > 1 || zPercent <0 || zPercent >1)
                {   console.log("Annotation " + Text + " is not in the module's " + models[modelIndex].getName() + " boundaries."); }
                else
                {
                    var xPos = (-cubeSizeX/2.0) + xPercent*cubeSizeX;
                    // We can't tell the real y position unless the model is fully loaded
                    var yPos = (-cubeSizeY/2.0) + this.getModelOffsetY(modelIndex) * cubeSizeY;
                    var zPos = (-cubeSizeZ/2.0) + zPercent*cubeSizeZ;

                    annotationLayers[layerIndex].addAnnotation(xPos,yPos,zPos,Text);
                }
            }
            else// unbound: can't get lat/long positions so can't insert this annotation.
            {
                console.log("AnnotationLayer with name: "+ AnnotationLayerName + " is not bound to a model.");
                console.log("Can't insert annotation " + Text + " at latitude/longitude position.");
            }
        }
        else
        {
            console.log("Could not found a AnnotationLayer with name: " + AnnotationLayerName);
        }
    };

    /**
     * Sets the callback function for the progress update. The progress function gives a parameter between 0-100.
     * You can set callback = null for no progress update at all. If no callback is given at all the progress is
     * printed to the console.
     * @param callback
     */
    this.setProgressCallback=function(callback)
    {
        progressCallback = callback;
    };

    /**
     * All Modules and Terrain shall report their loading progress.
     * Modules when they receive data and terrains if they are done building the terrain.
     * Every time this function is called 1 is added to the total progress. It is assumed that for every
     * request a terrain is build thus 100% = model.requests*2
     * If a callback is registered the function is called, otherwise the progress is printed to the console or ignored.
     * @param modelIndex - Index of the model.
     */
    this.reportProgress = function(modelIndex)
    {
        //If null no progress update is wished
        if( progressCallback !== null)
        {
            modelLoadingProgress[modelIndex] += 1;

            //Reset total loading progress to 0 and calc it with the new value
            totalLoadingProgress = 0;
            for(var i=0; i<modelLoadingProgress.length; i++)
            {
                var tmp = modelLoadingProgress[i] / ( models[i].requests *2 );
                if( tmp > 1.0) tmp = 1;
                totalLoadingProgress += tmp;
            }
            totalLoadingProgress = (parseFloat(totalLoadingProgress) / parseFloat(modelLoadingProgress.length))*100;

            //Callback function or console?
            if( progressCallback !== undefined)
            {   progressCallback(totalLoadingProgress);    }
            else
            {   console.log(totalLoadingProgress); }
        }
    };

    /**
     * Returns the maximum resolution per dimension of a scene model.
     * This number depends on power templates (e.g. mobile device).
     * @return {Number}
     */
    this.getMaxResolution = function()
    {   return maxResolution;   };

    /**
     * Sets the navigation type and parameters in the x3d window.
     * The website below gives detailed information about navagation modes.
     * http://doc.x3dom.org/tutorials/animationInteraction/navigation/index.html
     * @param type - Type of navigation (e.g. Examine)
     * @param parameter - Parameters for the navagation type.
     */
    this.setNavigation = function(type,parameter)
    {
        navigationType   = type;
        navigationParams = parameter;
    };

    /**
     * Adds any scene model to the scene.
     * @param model - Any type of scene model.
     */
    this.addModel = function( model )
    {
        //Model ID is the current length of the models array. That means to IDs start at 0 and increase by 1.
        model.index = models.length;
        //Store model in the array
        models.push(model);
        //Initialize it's loading progress to 0
        modelLoadingProgress[model.index] = 0;
    };

    /**
     * Sets the view of the X3Dom window to the predefined camera.
     * @param camID - ID of the Camera dom object.
     */
    this.setView =function(camID)
    {
        var cam = document.getElementById(camID);
        if(cam)
        {
            if( oculusRift ) // there is always one viewpoint in oculus mode, change it
            {
                var oculusVP = document.getElementById("EarthServerClient_VR_vpp");
                var pos = cam.getAttribute("position");
                oculusVP.setAttribute("position",pos);
            }
            else
            {
                //If the user changes the camera, then moves around the camera has to be set to false to be able to bin again
                cam.setAttribute('set_bind','false');
                cam.setAttribute('set_bind','true');
            }
        }
        else
            console.log("EarthServerGenericClient::SceneManager::SetView can't find Camera with ID ", camID);
    };

    /**
     * Sets the view of the X3Dom window to the predefined camera.
     * @param cameraDefIndex - Index of the camera as stored in cameraDef.
     */
    this.setViewByCameraDefIndex =function(cameraDefIndex)
    {
        if(cameraDefIndex >= cameraDefs.length)
        {   console.log("EarthServerGenericClient::SceneManager::SetViewByCameraDefIndex has no camera with index ", cameraDefIndex);   }
        else
        {   var cameraDef = cameraDefs[ cameraDefIndex];    }

        var camName = cameraDef.split(":");
        if(camName.length <2 )
        {   console.log("EarthServerGenericClient::SceneManager::SetViewByCameraDefIndex can't find Camera with DEF ", cameraDef);   }
        else
        {   var camID = camName[1];}

        this.setView(camID);
    };

    /**
     * Returns the number of defined cameras
     * @returns {Number}
     */
    this.getCameraDefCount = function()
    {
        return cameraDefs.length;
    };

    /**
     * Returns the definition of the camera with the given index.
     * Format: "CameraName:CameraID"
     * CameraName is for the UI (show on a button or label)
     * CameraID is the ID of the dom element
     * @param cameraIndex - Index of the camera.
     * @returns {String}
     */
    this.getCameraDef = function(cameraIndex)
    {
        if(cameraIndex < cameraDefs.length)
        {   return cameraDefs[cameraIndex]; }
        else
        {   return "Camera:NotDefined"}
    };

    /**
     * Creates the whole X3DOM Scene in the fishtank/cube with all added scene models.
     * The Sizes of the cube are assumed as aspect ratios with values between 0 and 1.
     * Example createScene("x3dom_div",1.0, 0.3, 0.5 ) Cube has 30% height and 50 depth compared to the width.
     * @param x3dID - ID of the x3d scene dom element.
     * @param sceneID - ID of the x3dom root element.
     * @param SizeX - width of the cube.
     * @param SizeY - height of the cube.
     * @param SizeZ - depth of the cube.
     */
    this.createScene = function(x3dID,sceneID, SizeX, SizeY, SizeZ )
    {
        if( SizeX <= 0 || SizeX > 1.0) SizeX = 1.0;
        if( SizeY <= 0 || SizeY > 1.0) SizeY = 1.0;
        if( SizeZ <= 0 || SizeZ > 1.0) SizeZ = 1.0;

        cubeSizeX = (parseFloat(SizeX) * 1000);
        cubeSizeY = (parseFloat(SizeY) * 1000);
        cubeSizeZ = (parseFloat(SizeZ) * 1000);

        var x3d = document.getElementById(x3dID);
        var scene = document.getElementById(sceneID);
        if( !scene || !x3d)
        {
            alert("No X3D Scene found with id " + sceneID);
            return;
        }
        else
        {
            this.x3dID = x3dID;
            this.sceneID = sceneID;
        }

        var navigation = document.createElement("navigationInfo");
        if( navigationType )
        {
            var type = "\"" + String(navigationType) + "\"";
            console.log(type);
            navigation.setAttribute("type",String(type));
            navigation.setAttribute("typeParams",String(navigationParams));
        }
        else // default navagation
        {
            navigation.setAttribute("type",'"TURNTABLE" "ANY"');
            navigation.setAttribute("typeParams","-0.4, 60, 0.5, 2.55");
        }
        scene.appendChild(navigation);

        // Light
        if( lightInScene)
        {
            lights.push(new EarthServerGenericClient.Light(x3d,0, "0 "+ cubeSizeY +" 0"));
        }

        // Background
        if( !oculusRift ) // in oculus mode the background is the rendertextures and declared in this.appendVRShader()
        {
            var background = document.createElement("Background");
            background.setAttribute("groundAngle",Background_groundAngle);
            background.setAttribute("groundColor",Background_groundColor);
            background.setAttribute("skyAngle",Background_skyAngle);
            background.setAttribute("skyColor",Background_skyColor);
            x3d.appendChild(background);

            background = null;
        }

        // Cameras
       // if no custom viewpoints are set create three default ones
       if( viewpoints.length ===0 )
       {
           var cam1 = document.createElement('Viewpoint');
           cam1.setAttribute("id","EarthServerGenericClient_Cam_Front");
           cam1.setAttribute("position", "0 0 " + cubeSizeZ*2);
           cam1.setAttribute("description","EarthServerGenericClient_Cam_Front");
           cameraDefs.push("Front:EarthServerGenericClient_Cam_Front");

           var cam2 = document.createElement('Viewpoint');
           cam2.setAttribute("id","EarthServerGenericClient_Cam_Top");
           cam2.setAttribute("position", "0 " + cubeSizeY*2.5 + " 0");
           cam2.setAttribute("orientation", "1.0 0.0 0.0 -1.55");
           cam2.setAttribute("description","EarthServerGenericClient_Cam_Top");
           cameraDefs.push("Top:EarthServerGenericClient_Cam_Top");

           var cam3 = document.createElement('Viewpoint');
           cam3.setAttribute("id","EarthServerGenericClient_Cam_Side");
           cam3.setAttribute("position", "" + -cubeSizeX*2+ " 0 0");
           cam3.setAttribute("orientation", "0 1 0 -1.55");
           cam3.setAttribute("description","EarthServerGenericClient_Cam_Side");
           cameraDefs.push("Side:EarthServerGenericClient_Cam_Side");

           x3d.appendChild(cam1);
           x3d.appendChild(cam2);
           x3d.appendChild(cam3);

           cam1 = null;
           cam2 = null;
           cam3 = null;
       }

       // insert custom viewpoints
       for(var o=0;o<viewpoints.length;o++)
       {
           var customCam = document.createElement('Viewpoint');
           customCam.setAttribute("id","EarthServerGenericClient_Cam_"+viewpoints[o].name);
           customCam.setAttribute("description","EarthServerGenericClient_Cam_"+viewpoints[o].name);
           customCam.setAttribute("position", viewpoints[o].position);
           // check if orientation is set, else use default
           if( viewpoints[o].orientation !== undefined && viewpoints[o].orientation !== null )
           {   customCam.setAttribute("orientation",viewpoints[o].orientation );   }

           cameraDefs.push(""+viewpoints[o].name+":EarthServerGenericClient_Cam_"+viewpoints[o].name);

           x3d.appendChild(customCam);
           customCam = null;
       }

        // Cube
        if( drawCube)
        {
            var shape = document.createElement('Shape');
            var appearance = document.createElement('Appearance');
            //appearance.setAttribute("sorttype","opaque");
            var material = document.createElement('Material');
            material.setAttribute("emissiveColor","1 1 0");

            var lineset = document.createElement('IndexedLineSet');
            lineset.setAttribute("colorPerVertex", "false");
            lineset.setAttribute("coordIndex","0 1 2 3 0 -1 4 5 6 7 4 -1 0 4 -1 1 5 -1 2 6 -1 3 7 -1");

            var coords = document.createElement('Coordinate');
            coords.setAttribute("id", "cube");

            var cubeX = cubeSizeX/2.0;
            var cubeY = cubeSizeY/2.0;
            var cubeZ = cubeSizeZ/2.0;
            var cubeXNeg = -cubeSizeX/2.0;
            var cubeYNeg = -cubeSizeY/2.0;
            var cubeZNeg = -cubeSizeZ/2.0;

            var p = {};
            p[0] = ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZNeg + " ";
            p[1] = ""+ cubeX + " " + cubeYNeg + " " + cubeZNeg + " ";
            p[2] = ""+ cubeX + " " + cubeY + " " + cubeZNeg + " ";
            p[3] = ""+ cubeXNeg + " " + cubeY + " " + cubeZNeg + " ";
            p[4] = ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZ + " ";
            p[5] = ""+ cubeX + " " + cubeYNeg + " " + cubeZ + " ";
            p[6] = ""+ cubeX + " " + cubeY + " " + cubeZ + " ";
            p[7] = ""+ cubeXNeg + " " + cubeY + " " + cubeZ + " ";
            var points="";
            for(var i=0; i<8;i++)
            {   points = points+p[i];   }
            coords.setAttribute("point", points);

            lineset.appendChild(coords);
            appearance.appendChild(material);
            shape.appendChild(appearance);
            shape.appendChild(lineset);
            scene.appendChild(shape);

            shape = null;
            appearance = null;
            material = null;
            lineset = null;
            coords = null;
            points = null;

            // draw the grid if set
            if( drawGrid)
            {
                this.appendCubeGrid(scene,this.GridMinAxisValue[0],this.GridMaxAxisValue[0],
                    this.GridMinAxisValue[1],this.GridMaxAxisValue[1],
                    this.GridMinAxisValue[2],this.GridMaxAxisValue[2],
                    this.GridUnitSize, this.GridLineSize);
            }

        }

        if( subsetting )
        {
            subsetManager = new EarthServerGenericClient.SubsetManager(true,true,true);
            subsetManager.addSlicesToScene(scene);
        }

        if( CubeBaseQuery !== null)
        {
            var baseTransform    = document.createElement("Transform");
            var baseShape        = document.createElement("Shape");
            var baseAppearance   = document.createElement("Appearance");
            var baseMaterial     = document.createElement("Material");
            var baseImageTexture = document.createElement("ImageTexture");
            var baseTrisSet      = document.createElement("IndexedTriangleSet");
            var baseTexCoords    = document.createElement("TextureCoordinate");
            var baseCoords       = document.createElement("Coordinate");
            var basePoints = "";
            var baseTC = "";

            baseTransform.setAttribute("scale",""+ CubeBaseFactor + " 1 " + CubeBaseFactor);
            baseAppearance.setAttribute('sortType', 'opaque');
            baseShape.setAttribute("id","EarthServerGenericClient_CubeBase");
            baseImageTexture.setAttribute("url", CubeBaseQuery);
            basePoints += ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZ + " ";
            basePoints += ""+ cubeX + " " + cubeYNeg + " " + cubeZ + " ";
            basePoints += ""+ cubeX + " " + cubeYNeg + " " + cubeZNeg + " ";
            basePoints += ""+ cubeXNeg + " " + cubeYNeg + " " + cubeZNeg + " ";
            baseTC += "0 0 1 0 1 1 0 1";
            baseTrisSet.setAttribute("lit",'false');
            baseTrisSet.setAttribute("index","0 1 2 2 3 0");

            baseCoords.setAttribute("point", basePoints);
            baseTexCoords.setAttribute("point", baseTC);
            baseTrisSet.appendChild(baseCoords);
            baseTrisSet.appendChild(baseTexCoords);
            baseAppearance.appendChild(baseImageTexture);
            baseAppearance.appendChild(baseMaterial);
            baseShape.appendChild(baseAppearance);
            baseShape.appendChild(baseTrisSet);
            baseTransform.appendChild(baseShape);
            scene.appendChild(baseTransform);

            baseTransform = null;
            baseShape = null;
            baseTexCoords = null;
            baseAppearance = null;
            baseMaterial = null;
            baseImageTexture = null;
            baseTrisSet = null;
            baseCoords = null;
        }

        if( drawCompass)
        {
            this.appendCompass(scene);
        }

        var trans = document.createElement('Transform');
        trans.setAttribute("id", "trans");

        scene.appendChild(trans);
        this.trans = trans;

        var annotationTrans = document.createElement("transform");
        annotationTrans.setAttribute("id","AnnotationsGroup");
        scene.appendChild(annotationTrans);
        annotationTrans = null;

        //clipping planes
        if( addClippingPlanes )
        {
            var planeX = document.createElement("ClipPlane");
            planeX.setAttribute("plane","-1 0 0 "+ cubeSizeX );
            //planeX.setAttribute("cappingStrength", "5");
            //planeX.setAttribute("cappingColor", "0 1 1");

            var planeY = document.createElement("ClipPlane");
            planeY.setAttribute("plane","0 -1 0 "+ cubeSizeY );

            var planeZ = document.createElement("ClipPlane");
            planeZ.setAttribute("plane","0 0 -1 "+ cubeSizeZ );

            trans.appendChild( planeX );
            trans.appendChild( planeY );
            trans.appendChild( planeZ );

            clippingPlanes.push( planeX );
            clippingPlanes.push( planeY );
            clippingPlanes.push( planeZ );

            planeX = null;
            planeY = null;
            planeZ = null;
        }

        trans = null;

        if( oculusRift )
        {   this.appendVRShader(x3dID,sceneID);  }
    };

    this.appendCompass = function(scene)
    {
        var compassTrans        = document.createElement("Transform");
        var compassShape        = document.createElement("Shape");
        var compassAppearance   = document.createElement("Appearance");
        var compassMaterial     = document.createElement("Material");
        var trisSet             = document.createElement("IndexedTriangleSet");
        var itsCoords           = document.createElement("Coordinate");
        var itsPoints = "";
        var itsIndex  = "";

        var compassTextTransform  = document.createElement("Transform");
        var compassRotTransform  = document.createElement("Transform");
        var compassTextShape      = document.createElement('shape');
        var compassTextAppearance = document.createElement('appearance');
        var compassTextMaterial   = document.createElement('material');
        var compassText           = document.createElement('text');
        var fontStyle             = document.createElement('fontStyle');

        compassTextMaterial.setAttribute('diffuseColor', compassColor );
        compassText.setAttribute('string', compassLabel);
        compassText.setAttribute('solid', 'false');
        fontStyle.setAttribute('family', 'calibri');
        fontStyle.setAttribute('style', 'bold');
        compassRotTransform.setAttribute("rotation","0 0 1 -1.57 ");
        compassTextTransform.setAttribute('rotation', '1 0 0 -1.57');
        compassTextTransform.setAttribute('translation', "4 0 0");
        compassText.appendChild(fontStyle);
        compassTextAppearance.appendChild(compassTextMaterial);
        compassTextShape.appendChild(compassTextAppearance);
        compassTextShape.appendChild(compassText);
        compassRotTransform.appendChild(compassTextShape);
        compassTextTransform.appendChild(compassRotTransform);
        compassTrans.appendChild( compassTextTransform);

        // Build compass coords
        itsPoints += "-3 0 -0.5 ";
        itsPoints += "-3 0 0.5 ";
        itsPoints += "1 0 -0.5 ";
        itsPoints += "1 0 0.5 ";
        itsPoints += "1 0 -1.0 ";
        itsPoints += "1 0 1.0 ";
        itsPoints += "3 0 0.0";

        // Build compass index
        itsIndex += "0 1 2 1 3 2 4 5 6";

        compassTrans.setAttribute("translation", "0 " + (-cubeSizeY/2) + " " + (cubeSizeZ*0.75));
        compassTrans.setAttribute("scale", "" + (cubeSizeX/20) + " " + (cubeSizeY/10) + " " + (cubeSizeZ/10));
        compassTrans.setAttribute("rotation","0 1 0 "+ compassRotation);
        compassTrans.setAttribute("id", "EarthServerGenericClient_CompassTrans");
        compassMaterial.setAttribute("diffuseColor",compassColor);
        itsCoords.setAttribute("point", itsPoints);
        trisSet.setAttribute("index", itsIndex);
        trisSet.setAttribute("solid", "false");

        compassAppearance.appendChild(compassMaterial);
        compassShape.appendChild(compassAppearance);
        trisSet.appendChild(itsCoords);
        compassShape.appendChild(trisSet);
        compassTrans.appendChild(compassShape);
        scene.appendChild(compassTrans);

        compassTextTransform  = null;
        compassRotTransform   = null;
        compassTextShape      = null;
        compassTextAppearance = null;
        compassTextMaterial   = null;
        compassText           = null;
        fontStyle             = null;

        itsCoords = null;
        trisSet = null;
        compassMaterial = null;
        compassAppearance = null;
        compassShape = null;
        compassTrans = null;

    };

    this.appendCubeGrid = function(root,minX,maxX,minY,maxY,minZ,maxZ,unitSize,lineSize)
    {
        // Creates shapes and appearances for every side
        var shapeFront   = document.createElement('Shape');
        var trissetFront = document.createElement('IndexedTriangleSet');
        trissetFront.setAttribute("colorPerVertex", "false");
        var coordsFront = document.createElement('Coordinate');

        var shapeBack   = document.createElement('Shape');
        var trissetBack = document.createElement('IndexedTriangleSet');
        trissetBack.setAttribute("colorPerVertex", "false");
        var coordsBack = document.createElement('Coordinate');

        var shapeLeft   = document.createElement('Shape');
        var trissetLeft = document.createElement('IndexedTriangleSet');
        trissetLeft.setAttribute("colorPerVertex", "false");
        var coordsLeft = document.createElement('Coordinate');

        var shapeRight   = document.createElement('Shape');
        var linesetRight = document.createElement('IndexedTriangleSet');
        linesetRight.setAttribute("colorPerVertex", "false");
        var coordsRight = document.createElement('Coordinate');

        var shapeBottom   = document.createElement('Shape');
        var trissetBottom = document.createElement('IndexedTriangleSet');
        trissetBottom.setAttribute("colorPerVertex", "false");
        var coordsBottom = document.createElement('Coordinate');

        var appearance = document.createElement('Appearance');
        var material   = document.createElement('Material');
        material.setAttribute("diffuseColor","1.0 1.0 1.0");
        material.setAttribute("specularColor","1.0 1.0 1.0");
        var AppearanceDef = "EarthServerClient::GridAppDef";
        appearance.appendChild(material);
        appearance.setAttribute("ID",AppearanceDef);

        var appearanceFront = document.createElement('Appearance');
        appearanceFront.setAttribute("Use",AppearanceDef);
        var appearanceBack = document.createElement('Appearance');
        appearanceBack.setAttribute("Use",AppearanceDef);
        var appearanceLeft = document.createElement('Appearance');
        appearanceLeft.setAttribute("Use",AppearanceDef);
        var appearanceRight = document.createElement('Appearance');
        appearanceRight.setAttribute("Use",AppearanceDef);

        var nXLines = parseInt( (maxX - minX) / unitSize );
        var nYLines = parseInt( (maxY - minY) / unitSize );
        var nZLines = parseInt( (maxZ - minZ) / unitSize );
        var xSize = cubeSizeX / nXLines;
        var ySize = cubeSizeY / nYLines;
        var zSize = cubeSizeZ / nZLines;

        var cubeX = cubeSizeX/2.0;
        var cubeY = cubeSizeY/2.0;
        var cubeZ = cubeSizeZ/2.0;
        var cubeXNeg = -cubeSizeX/2.0;
        var cubeYNeg = -cubeSizeY/2.0;
        var cubeZNeg = -cubeSizeZ/2.0;

        var p = [];
        var indices = "";
        var indexCounter = 0;

        // ### FRONT GRID ###
        for(var i=1; i< nXLines;i++)
        {
            // vertical
            p.push(""+ (cubeXNeg+(i*xSize)          )+ " " + cubeY    + " " + cubeZNeg);
            p.push(""+ (cubeXNeg+(i*xSize)          )+ " " + cubeYNeg + " " + cubeZNeg);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeYNeg + " " + cubeZNeg);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeY    + " " + cubeZNeg);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        for(i=1; i<nYLines;i++)
        {
            // horizontal
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)) + " " + cubeZNeg);
            p.push(""+ cubeX    + " " + (cubeYNeg+(i*ySize)) + " " + cubeZNeg);
            p.push(""+ cubeX    + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZNeg);
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZNeg);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        var stringP = "";
        for( i=0; i< p.length; i++)
        {   stringP = stringP+p[i]+" ";   }
        coordsFront.setAttribute("point", stringP);
        trissetFront.setAttribute("index",indices);
        p = [];
        indices = "";
        indexCounter = 0;

        // ### Back GRID ###
        for(i=1; i< nXLines;i++)
        {
            // vertical
            p.push(""+ (cubeXNeg+(i*xSize) )+ " " + cubeYNeg + " " + cubeZ);
            p.push(""+ (cubeXNeg+(i*xSize) )+ " " + cubeY    + " " + cubeZ);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeY    + " " + cubeZ);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeYNeg + " " + cubeZ);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        for(i=1; i<nYLines;i++)
        {
            // horizontal
            p.push(""+ cubeX    + " " + (cubeYNeg+(i*ySize)) + " " + cubeZ);
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)) + " " + cubeZ);
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZ);
            p.push(""+ cubeX    + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZ);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        stringP = "";
        for( i=0; i< p.length; i++)
        {   stringP = stringP+p[i]+" ";   }
        coordsBack.setAttribute("point", stringP);
        trissetBack.setAttribute("Index",indices);
        p = [];
        indices = "";
        indexCounter = 0;

        // ### Left Grid ###
        for( i=1; i< nZLines;i++)
        {
            // vertical
            p.push(""+ cubeXNeg + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeXNeg + " " + cubeY    + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeXNeg + " " + cubeY    + " " + (cubeZNeg+(i*zSize)+lineSize) );
            p.push(""+ cubeXNeg + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)+lineSize) );
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        for(i=1; i<nYLines;i++)
        {
            // horizontal
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)) + " " + cubeZ);
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)) + " " + cubeZNeg   );
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZNeg   );
            p.push(""+ cubeXNeg + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZ);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        stringP = "";
        for( i=0; i< p.length; i++)
        {   stringP = stringP+p[i]+" ";   }
        coordsLeft.setAttribute("point", stringP);
        trissetLeft.setAttribute("Index",indices);
        p = [];
        indices = "";
        indexCounter = 0;

        // ### Right Grid ###
        for( i=1; i< nZLines;i++)
        {
            // vertical
            p.push(""+ cubeX + " " + cubeY    + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeX + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeX + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)+lineSize) );
            p.push(""+ cubeX + " " + cubeY    + " " + (cubeZNeg+(i*zSize)+lineSize) );
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        for(i=1; i<nYLines;i++)
        {
            // horizontal
            p.push(""+ cubeX + " " + (cubeYNeg+(i*ySize)) + " " + cubeZNeg);
            p.push(""+ cubeX + " " + (cubeYNeg+(i*ySize)) + " " + cubeZ   );
            p.push(""+ cubeX + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZ   );
            p.push(""+ cubeX + " " + (cubeYNeg+(i*ySize)+lineSize) + " " + cubeZNeg);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        stringP = "";
        for( i=0; i< p.length; i++)
        {   stringP = stringP+p[i]+" ";   }
        coordsRight.setAttribute("point", stringP);
        linesetRight.setAttribute("Index",indices);
        p = [];
        indices = "";
        indexCounter = 0;

        // ### Bottom Grid ###
        for(i=1; i< nXLines;i++)
        {
            // Front to back
            p.push(""+ (cubeXNeg+(i*xSize) )+ " " + cubeYNeg + " " + cubeZNeg);
            p.push(""+ (cubeXNeg+(i*xSize) )+ " " + cubeYNeg + " " + cubeZ);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeYNeg + " " + cubeZ);
            p.push(""+ (cubeXNeg+(i*xSize)+lineSize )+ " " + cubeYNeg + " " + cubeZNeg);
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        for( i=1; i< nZLines;i++)
        {
            // Side to side
            p.push(""+ cubeX    + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeXNeg + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)) );
            p.push(""+ cubeXNeg + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)+lineSize) );
            p.push(""+ cubeX    + " " + cubeYNeg + " " + (cubeZNeg+(i*zSize)+lineSize) );
            // Indices
            indices +="" + indexCounter++ + " " + indexCounter++ +  " " + indexCounter++ + " ";
            indices +="" + (indexCounter-1) + " " + (indexCounter) + " " + (indexCounter-3) + " ";
            indexCounter++;
        }
        stringP = "";
        for( i=0; i< p.length; i++)
        {   stringP = stringP+p[i]+" ";   }
        coordsBottom.setAttribute("point", stringP);
        trissetBottom.setAttribute("Index",indices);

        shapeBottom.appendChild(appearance);
        shapeBottom.appendChild(trissetBottom);
        trissetBottom.appendChild(coordsBottom);
        root.appendChild(shapeBottom);

        shapeFront.appendChild(appearanceFront);
        shapeFront.appendChild(trissetFront);
        trissetFront.appendChild(coordsFront);
        root.appendChild(shapeFront);

        shapeBack.appendChild(appearanceBack);
        shapeBack.appendChild(trissetBack);
        trissetBack.appendChild(coordsBack);
        root.appendChild(shapeBack);

        shapeLeft.appendChild(appearanceLeft);
        shapeLeft.appendChild(trissetLeft);
        trissetLeft.appendChild(coordsLeft);
        root.appendChild(shapeLeft);

        shapeRight.appendChild(appearanceRight);
        shapeRight.appendChild(linesetRight);
        linesetRight.appendChild(coordsRight);
        root.appendChild(shapeRight);

        shapeFront   = null;
        trissetFront = null;
        coordsFront = null;
        appearanceFront = null;

        shapeBack   = null;
        trissetBack = null;
        coordsBack = null;
        appearanceBack = null;

        shapeLeft   = null;
        trissetLeft = null;
        coordsLeft = null;
        appearanceLeft = null;

        shapeRight   = null;
        linesetRight = null;
        coordsRight = null;
        appearanceRight = null;

        shapeBottom = null;
        trissetBottom = null;
        coordsBottom = null;

        appearance = null;
        material = null;
    };

    this.appendVRShader = function(x3dID,sceneID)
    {
        var scene = document.getElementById(x3dID);
        if( !scene)
        {
            console.log("EarthServerClient::Scene::appendVRShader: Could not find scene element.");
            return;
        }

        var navigation = document.createElement("navigationInfo");
        //navigation.setAttribute("headlight","false");
        navigation.setAttribute("type",'"EXAMINE" "WALK"');
        scene.appendChild(navigation);

        var viewpoint = document.createElement("viewpoint");
        viewpoint.setAttribute("id","EarthServerClient_VR_vpp");
        viewpoint.setAttribute("DEF","EarthServerClient_VR_vp");
        viewpoint.setAttribute("orientation",'0 1 0 -2.99229');
        viewpoint.setAttribute("position",'0 120 0');// TODO: AUTOGENERATE
        viewpoint.setAttribute("zNear","0.1");
        viewpoint.setAttribute("zFar","4000");
        //viewpoint.setAttribute("fieldOfView","1.74");
        scene.appendChild(viewpoint);

        var background = document.createElement("background");
        background.setAttribute("skyColor","0 0 0"); // this has to be black.
        background.setAttribute("DEF","bgnd");
        scene.appendChild(background);

        var groupLEFT = document.createElement("group");
        groupLEFT.setAttribute("DEF","left");

        var shape = document.createElement("shape");
        var plane = document.createElement("plane");
        plane.setAttribute("solid","false");
        var app   = document.createElement("appearance");
        var renderTex = document.createElement("renderedTexture");
        renderTex.setAttribute("id","rtLeft");
        renderTex.setAttribute("stereoMode","LEFT_EYE");
        renderTex.setAttribute("update","ALWAYS");
        renderTex.setAttribute("dimensions",'1280 1600 4');
        renderTex.setAttribute("repeatS",'false');
        renderTex.setAttribute("repeatT",'false');
        renderTex.setAttribute("interpupillaryDistance","0.09");

        var viewpointLeft = document.createElement("viewpoint");
        viewpointLeft.setAttribute("USE","EarthServerClient_VR_vp");
        viewpointLeft.setAttribute("containerField",'viewpoint');
        renderTex.appendChild(viewpointLeft);

        var backgroundLeft = document.createElement("background");
        backgroundLeft.setAttribute("groundAngle",Background_groundAngle);
        backgroundLeft.setAttribute("groundColor",Background_groundColor);
        backgroundLeft.setAttribute("skyAngle",Background_skyAngle);
        backgroundLeft.setAttribute("skyColor",Background_skyColor);
        backgroundLeft.setAttribute("containerField",'background');
        renderTex.appendChild(backgroundLeft);

        var groupLeft = document.createElement("group");
        groupLeft.setAttribute("USE",sceneID);
        groupLeft.setAttribute("containerField","scene");
        renderTex.appendChild(groupLeft);

        var cShader = document.createElement("composedShader");
        var field1  = document.createElement("field");
        field1.setAttribute("name","tex");
        field1.setAttribute("type","SFInt32");
        field1.setAttribute("value","0");
        var field2  = document.createElement("field");
        field2.setAttribute("name","LeftEye");
        field2.setAttribute("type","SFFloat");
        field2.setAttribute("value","1");
        cShader.appendChild(field1);
        cShader.appendChild(field2);

        var vsl = "attribute vec3 position; \n";
        vsl += "attribute vec2 texcoord; \n";
        vsl += "uniform mat4 modelViewProjectionMatrix; \n";
        vsl += "varying vec2 fragTexCoord; \n";
        vsl += "void main() { \n";
        vsl += "vec2 pos = sign(position.xy); \n";
        vsl += "fragTexCoord = texcoord; \n";
        vsl += "gl_Position = vec4((pos.x - 1.0) / 2.0, pos.y, 0.0, 1.0); } \n";

        var vsr = "attribute vec3 position; \n";
        vsr += "attribute vec2 texcoord; \n";
        vsr += "uniform mat4 modelViewProjectionMatrix; \n";
        vsr += "varying vec2 fragTexCoord; \n";
        vsr += "void main() { \n";
        vsr += "vec2 pos = sign(position.xy); \n";
        vsr += "fragTexCoord = texcoord; \n";
        vsr += "gl_Position = vec4((pos.x + 1.0) / 2.0, pos.y, 0.0, 1.0); } \n";

        var vsf = "#ifdef GL_ES \n";
        vsf += "precision highp float; \n";
        vsf += "#endif \n";
        vsf += "uniform sampler2D tex; \n";
        vsf += "uniform float leftEye; \n";
        vsf += "varying vec2 fragTexCoord; \n";
        vsf += "void main() { \n";
        vsf += "float distortionScale = 0.7; \n";
        vsf += "vec2 lensCenter = vec2(0.151976495726, 0.0); \n";
        vsf += "if (leftEye == 0.0) { \n";
        vsf += "lensCenter.x *= -1.0; } \n";
        vsf += "vec2 theta = (fragTexCoord * 2.0) - 1.0; \n";
        vsf += "float rSq = theta.x * theta.x + theta.y * theta.y; \n";
        vsf += "vec2 rvec = theta * (1.0 + 0.22 * rSq + 0.24 * rSq * rSq); \n";
        vsf += "vec2 texCoord = (distortionScale*rvec+(1.0-distortionScale)*lensCenter + 1.0) / 2.0; \n";
        vsf += "if (any(notEqual(clamp(texCoord, vec2(0.0, 0.0), vec2(1.0, 1.0)) - texCoord,vec2(0.0, 0.0)))) \n";
        vsf += "{ discard; } \n";
        vsf += "else { \n";
        vsf += "vec3 col = texture2D(tex, texCoord).rgb; \n";
        vsf += "gl_FragColor = vec4(col, 1.0); }  } \n";

        var shaderPartVertex = document.createElement("shaderPart");
        shaderPartVertex.setAttribute("type","VERTEX");
        shaderPartVertex.innerHTML = vsl;
        cShader.appendChild(shaderPartVertex);

        var shaderPartFragment = document.createElement("shaderPart");
        shaderPartFragment.setAttribute("type","FRAGMENT");
        shaderPartFragment.innerHTML = vsf;
        shaderPartFragment.setAttribute("DEF","frag");
        cShader.appendChild(shaderPartFragment);

        var groupRIGHT = document.createElement("group");
        groupRIGHT.setAttribute("DEF","right");

        var shapeR = document.createElement("shape");
        var planeR = document.createElement("plane");
        planeR.setAttribute("solid","false");
        var appR   = document.createElement("appearance");
        var renderTexR = document.createElement("renderedTexture");
        renderTexR.setAttribute("id","rtRight");
        renderTexR.setAttribute("stereoMode","RIGHT_EYE");
        renderTexR.setAttribute("update","ALWAYS");
        renderTexR.setAttribute("dimensions",'1280 1600 4');
        renderTexR.setAttribute("repeatS",'false');
        renderTexR.setAttribute("repeatT",'false');
        renderTexR.setAttribute("interpupillaryDistance","0.09");

        var viewpointRight = document.createElement("viewpoint");
        viewpointRight.setAttribute("USE","EarthServerClient_VR_vp");
        viewpointRight.setAttribute("containerField",'viewpoint');
        renderTexR.appendChild(viewpointRight);

        var backgroundRight = document.createElement("background");
        backgroundRight.setAttribute("groundAngle",Background_groundAngle);
        backgroundRight.setAttribute("groundColor",Background_groundColor);
        backgroundRight.setAttribute("skyAngle",Background_skyAngle);
        backgroundRight.setAttribute("skyColor",Background_skyColor);
        backgroundRight.setAttribute("containerField",'background');
        renderTexR.appendChild(backgroundRight);

        var groupRight = document.createElement("group");
        groupRight.setAttribute("USE",sceneID);
        groupRight.setAttribute("containerField","scene");
        renderTexR.appendChild(groupRight);

        var cShaderR = document.createElement("composedShader");
        var field1R  = document.createElement("field");
        field1R.setAttribute("name","tex");
        field1R.setAttribute("type","SFInt32");
        field1R.setAttribute("value","0");
        var field2R = document.createElement("field");
        field2R.setAttribute("name","LeftEye");
        field2R.setAttribute("type","SFFloat");
        field2R.setAttribute("value","1");
        cShaderR.appendChild(field1R);
        cShaderR.appendChild(field2R);

        var shaderPartVertexR = document.createElement("shaderPart");
        shaderPartVertexR.setAttribute("type","VERTEX");
        //shaderPartVertexR.setAttribute("url","shader/oculusVertexShaderRight.glsl");
        shaderPartVertexR.innerHTML = vsr;

        cShaderR.appendChild(shaderPartVertexR);

        var shaderPartFragmentR = document.createElement("shaderPart");
        shaderPartFragmentR.setAttribute("type","FRAGMENT");
        shaderPartFragmentR.setAttribute("USE", "frag");
        cShaderR.appendChild(shaderPartFragmentR);

        app.appendChild(renderTex);
        app.appendChild(cShader);
        shape.appendChild(app);
        shape.appendChild(plane);
        groupLEFT.appendChild(shape);
        appR.appendChild(renderTexR);
        appR.appendChild(cShaderR);
        shapeR.appendChild(appR);
        shapeR.appendChild(planeR);
        groupRIGHT.appendChild(shapeR);
        scene.appendChild(groupLEFT);
        scene.appendChild(groupRIGHT);
    };

    /**
     * Creates the axis labels around the cube.
     */
    this.createAxisLabels = function(xLabel,yLabel,zLabel)
    {
        //Use given parameters or default values if parameters are not defined
        xLabel = xLabel || "X";
        yLabel = yLabel || "Y";
        zLabel = zLabel || "Z";

        axisLabels = new EarthServerGenericClient.AxisLabels(cubeSizeX/2, cubeSizeY/2, cubeSizeZ/2);
        axisLabels.createAxisLabels(xLabel,yLabel,zLabel);

        if( drawGrid)
            axisLabels.createAxisGridLabels( this.GridMinAxisValue[0], this.GridMaxAxisValue[0],
                                            this.GridMinAxisValue[1], this.GridMaxAxisValue[1],
                                            this.GridMinAxisValue[2], this.GridMaxAxisValue[2] );
    };

    /**
     * @ignore
     * Open a websocket
     * @param location
     * @returns {*}
     */
    this.websocket = function (location)
    {
        if (window.MozWebSocket)
            return new MozWebSocket(location);
        else
            return new WebSocket(location);
    };

    /**
     * @ignore
     * Starts the connection to InstantIO.
     * @param location
     * @param name
     */
    this.start_log = function (location, name)
    {
        var viewpoint = document.getElementById('EarthServerClient_VR_vpp');

        socket_ass = this.websocket(location);
        socket_ass.onmessage = function(event)
        {
            var h = x3dom.fields.SFVec4f.parse(event.data);
            var q = new x3dom.fields.Quaternion(h.x, h.y, h.z, h.w);

            var aa = q.toAxisAngle();

            viewpoint.setAttribute("orientation", aa[0].x + " " + aa[0].y + " " + aa[0].z + " " + aa[1]);
        }
    };

    /**
     * This function starts to load all models. You call this when the html is loaded or later on a click.
     */
    this.createModels = function()
    {
        // overwrite the enterFrame and exitFrame methods of the x3dom runtime (see doc below).
        var element = document.getElementById("x3d");
        element.runtime.enterFrame = EarthServerGenericClient.MainScene.nextFrame;

        // add event listener for keyboard
        document.addEventListener('keypress', function (e) {
            EarthServerGenericClient.MainScene.handleKeys(e);
        }, false);

        if( !oculusRift ) // oculus mode overwrites exit frame itself
        {   element.runtime.exitFrame  = EarthServerGenericClient.MainScene.exitFrame;  }
        else // oculus mode + this.exitframe
        {
            var runtime = null;
            var rtLeft, rtRight;
            var lastW, lastH;

            runtime = document.getElementById('x3d').runtime;
            rtLeft = document.getElementById('rtLeft');
            rtRight = document.getElementById('rtRight');

            lastW = +runtime.getWidth();
            lastH = +runtime.getHeight();

            var hw = Math.round(lastW / 2);
            rtLeft.setAttribute('dimensions',  hw + ' ' + lastH + ' 4');
            rtRight.setAttribute('dimensions', hw + ' ' + lastH + ' 4');

            runtime.exitFrame = function ()
            {
                var w = +runtime.getWidth();
                var h = +runtime.getHeight();

                if (w != lastW || h != lastH)
                {
                    var half = Math.round(w / 2);
                    rtLeft.setAttribute('dimensions',  half + ' ' + h + ' 4');
                    rtRight.setAttribute('dimensions', half + ' ' + h + ' 4');

                    lastW = w;
                    lastH = h;
                }

                EarthServerGenericClient.MainScene.exitFrame();
            };

            this.start_log("ws://localhost:" + InstantIOPort + "/InstantIO/element/ovr/Orientation/data.string", "image");
        }

        // Append the child into the scene
        if( oculusRift ) // oculus mode needs the root node to NOT rendered
        {
            var root = document.getElementById("root");
            root.setAttribute("render","false");
        }

        for(var i=0; i< models.length; i++)
        {
            models[i].createModel(this.trans,cubeSizeX,cubeSizeY,cubeSizeZ);
        }
        // add child/parent dependency
        for(i=0; i< models.length; i++)
        {
            if( models[i].isChildOf !== null)
            {
                var index = this.getModelIndex(models[i].isChildOf );
                if( index >= 0 && index !== i)
                {
                    models[index].addBinding( models[i] );
                }
                else
                {
                    console.log("EarthServerGenericClient:MainScene: Can't find parent with name " + models[i].isChildOf );
                    models[i].isChildOf = undefined;
                }
            }
        }
    };

    /**
     * This function forces the x3dom runtime to render a next frame even if no change to the scene or any
     * movement to from the user occurred. This is needed during the building process of the scene.
     * Data is inserted into the dom with a few frames between them to prevent stalls.
     * If the user does not move the mouse no new frame is drawn and no new data in inserted.
     *
     * This function forces new frames and therefor the insertion of new data.
     */
    this.exitFrame = function()
    {
        if( nextFrameCallback.length !== 0)
        {
            var element = document.getElementById("x3d");
            element.runtime.canvas.doc.needRender = 1; //set this to true to render even without movement
        }
    };

    /**
     * This function is executed every frame. If a terrain whats to add a chunk
     * it has registered the request and this function let one terrain add a single
     * chunk and wait for a few frames afterwards.
     */
    this.nextFrame = function()
    {
        if( nextFrameCallback.length !== 0)
        {   lastFrameInsert++;  }

        if( nextFrameCallback.length !== 0 && lastFrameInsert >= framesBetweenDomInsertion)
        {
            var callbackIndex = nextFrameCallback.shift();
            models[callbackIndex].terrain.nextFrame();
            lastFrameInsert = 0;
        }
    };

    /**
     * This function lets terrains register their request to add a chunk to the scene.
     * @param modelIndex - Index of the model that uses the terrain.
     */
    this.enterCallbackForNextFrame = function( modelIndex )
    {
        nextFrameCallback.push( modelIndex );
    };

    /**
     * Add a callback function for light changes.
     * @param modelIndex - Index of the model.
     */
    this.addLightObserver = function(modelIndex)
    {
        lightObserver.push( modelIndex );
    };

    /**
     * Calls all light observers functions.
     * @param lightDomElement
     */
    this.callLightObserver = function(lightDomElement)
    {
        for(var i=0; i< lightObserver.length; i++)
            models[ lightObserver[i] ].lightUpdate(lightDomElement);
    };

    /**
     * Updates the position of a light.
     * @param lightIndex - Index of the light
     * @param which - Which Axis will be changed (0:X 1:Y 2:Z)
     * @param value - the new position
     */
    this.updateLightPosition = function(lightIndex,which,value)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);

        if( light && which !== undefined && value !== undefined )
        {
            var oldTrans = light.getAttribute("location");
            oldTrans = oldTrans.split(" ");
            oldTrans[which] = value;
            light.setAttribute("location",oldTrans[0] + " " + oldTrans[1] + " " + oldTrans[2]);
            EarthServerGenericClient.MainScene.callLightObserver(light);
        }
        else
        {
            console.log("EarthServerGenericClient::SceneManager: Can't update light position.");
            console.log("Index " + lightIndex + ", Axis "+ which + " and Position " + value);
        }

        light = null;
    };

    /**
     * Returns the current position of the light with the given index.
     * @param lightIndex - Index of the light.
     */
    this.getLightPosition = function(lightIndex)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {   return light.getAttribute("location");  }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
        return "0 0 0";
    };

    /**
     * Returns the current color of the light with the given index.
     * @param lightIndex - Index of the light.
     */
    this.getLightColor = function(lightIndex)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {   return light.getAttribute("color"); }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
        return "1.0 1.0 1.0";
    };

    /**
     * Updates the radius of the light with the given index.
     * @param lightIndex - Index of the light.
     * @param value - New radius.
     */
    this.updateLightRadius = function(lightIndex,value)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {
            light.setAttribute("radius",value);
            EarthServerGenericClient.MainScene.callLightObserver(light);
        }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
    };

    /**
     * Updates the intensity of the light with the given index.
     * @param lightIndex - Index of the light.
     * @param value - New intensity.
     */
    this.updateLightIntensity = function(lightIndex,value)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {
            light.setAttribute("intensity",value);
            EarthServerGenericClient.MainScene.callLightObserver(light);
        }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
    };

    /**
     * Increases the intensity value of the light with the given index by a constant value.
     * @param lightIndex
     */
    this.increaseLightIntensity = function(lightIndex)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {
            var currentValue = light.getAttribute("intensity");
            var newValue = parseFloat(currentValue) + 0.1;
            light.setAttribute("intensity",String(newValue));
            EarthServerGenericClient.MainScene.callLightObserver(light);
        }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
    };

    /**
     * Decreases the intensity value of the light with the given index by a constant value.
     * @param lightIndex
     */
    this.decreaseLightIntensity = function(lightIndex)
    {
        var light = document.getElementById("EarthServerGenericClient_Light_"+lightIndex);
        if(light)
        {
            var currentValue = light.getAttribute("intensity");
            var newValue = parseFloat(currentValue) - 0.1;
            light.setAttribute("intensity",String(newValue));
            EarthServerGenericClient.MainScene.callLightObserver(light);
        }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find light with index " + lightIndex +".");}

        light = null;
    };

    /**
     * Updates the model's hour setting.
     * @param modelIndex - Index of the model.
     * @param value - Value to set [0-maximum hour].
     */
    this.updateModelHour = function(modelIndex,value)
    {
        if( modelIndex <models.length && modelIndex >=0)
            models[modelIndex].updateHour(value);
    };

    /**
     * Update Offset changes the position of the selected SceneModel on the x-,y- or z-Axis.
     * @param modelIndex - Index of the model that should be altered
     * @param which - Which Axis will be changed (0:X 1:Y 2:Z)
     * @param value - The new position
     */
    this.updateOffset = function(modelIndex,which,value)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+modelIndex);

        if( trans )
        {
            // offset of the cube
            var offset=0;
            // the minValue is the scaled minimum value of the data at the given axis
            // some terrains start with 0 at all axis, others do not.
            // If moving in Y direction (axis=1) check if the user has set Yminimum first.
            var minValue = (which === 1 && models[modelIndex].YMinimum) || EarthServerGenericClient.MainScene.getMinDataValueAtAxis(modelIndex,which);
            var delta = 0;
            var scale    = x3dom.fields.SFVec3f.parse( trans.getAttribute("scale") );
            var oldTrans = x3dom.fields.SFVec3f.parse( trans.getAttribute("translation") );
            var newTrans;
            var offSetMult;
            var cubeMult;

            // TODO: clean up....

            switch(which)
            {
                case 0: offset = cubeSizeX/2.0;
                        minValue *= scale.x;
                        newTrans = (value - offset- minValue);

                        if( models[modelIndex].isChildOf === null )
                        {
                            offSetMult = (  2* Math.abs( models[modelIndex].xOffset -0.5 ));
                            cubeMult   = cubeSizeX / 10;

                            if( offSetMult !== 0.0 )
                            {
                                if( newTrans >= 0)
                                    newTrans += cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                                else
                                    newTrans -= cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                            }
                        }

                        delta = oldTrans.x - newTrans;
                        oldTrans.x = newTrans;
                        break;

                case 1: offset = cubeSizeY/2.0;
		if( baseElevation[modelIndex] === undefined)
            	{
               		 baseElevation[modelIndex] = scale.y;
            	}
                        minValue *= baseElevation[modelIndex];
                        newTrans = (value - offset- minValue);

                        if( models[modelIndex].isChildOf === null )
                        {
                            offSetMult = (  2* Math.abs( models[modelIndex].yOffset -0.5 ));
                            cubeMult   = cubeSizeY / 10;

                            if( offSetMult !== 0.0 )
                            {
                                if( newTrans >= 0)
                                    newTrans += cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                                else
                                    newTrans -= cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                            }
                        }

                        delta = oldTrans.y - newTrans;
                        oldTrans.y = newTrans;
                        break;

                case 2: offset = cubeSizeZ/2.0;
                        minValue *= scale.z;
                        newTrans = (value - offset- minValue);

                        offSetMult = (  2* Math.abs( models[modelIndex].zOffset -0.5 ));
                        cubeMult   = cubeSizeZ / 10;

                        if( offSetMult !== 0.0 )
                        {
                            if( newTrans >= 0)
                                newTrans += cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                            else
                                newTrans -= cubeMult * separationVector[which] * this.getSeparationMultiplierForModel(modelIndex,which);
                        }

                        delta = oldTrans.z - newTrans;
                        oldTrans.z = newTrans;
                        break;
            }
            // update translation and call bindings with the delta
            trans.setAttribute("translation",oldTrans.x + " " + oldTrans.y + " " + oldTrans.z );
            models[modelIndex].movementUpdateBindings(which,delta);
        }
    };

    /**
     * Changes the position of the selected SceneModel on the x-,y- or z-Axis by the given delta.
     * @param modelIndex - Index of the model that should be altered
     * @param which - Which Axis will be changed (0:X 1:Y 2:Z)
     * @param delta - Delta to change the current position.
     */
    this.updateOffsetByDelta = function(modelIndex,which,delta)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+modelIndex);

        if( trans )
        {
            var oldTrans = x3dom.fields.SFVec3f.parse(trans.getAttribute("translation"));

            switch(which)
            {
                case 0:
                    oldTrans.x = parseFloat(oldTrans.x) - parseFloat(delta);
                    break;
                case 1:
                    oldTrans.y = parseFloat(oldTrans.y) - parseFloat(delta);
                    break;
                case 2:
                    oldTrans.z = parseFloat(oldTrans.z) - parseFloat(delta);
                    break;
            }

            trans.setAttribute("translation",oldTrans.x + " " + oldTrans.y + " " + oldTrans.z);
            models[modelIndex].movementUpdateBindings(which,delta);
        }
        else
        {   console.log("EarthServerGenericClient::SceneManager: Can't find transformation for model with index " + modelIndex);}
    };

    /**
     * Changes the global separation of every model that does not have a parent.
     * @param axis - Which axis the change effects.
     * @param value - The new separation value.
     */
    this.updateSeparation = function(axis,value)
    {
        value /= 10;
        var axisSign = "";
        var currentSliderValue;

        switch( parseInt(axis) )
        {
            case 0: separationVector[0] = parseFloat(value);
                    axisSign = "X";
                    // Set slider value to default value
                    currentSliderValue = EarthServerGenericClient.MainScene.getModelOffsetX(i) * EarthServerGenericClient.MainScene.getCubeSizeX();
                    break;
            case 1: separationVector[1] = parseFloat(value);
                    axisSign = "Y";
                    // Set slider value to default valu
                    currentSliderValue = EarthServerGenericClient.MainScene.getModelOffsetY(i) * EarthServerGenericClient.MainScene.getCubeSizeY();
                    break;
            case 2: separationVector[2] = parseFloat(value);
                    axisSign = "Z";
                    // Set slider value to default value
                    currentSliderValue = EarthServerGenericClient.MainScene.getModelOffsetZ(i) * EarthServerGenericClient.MainScene.getCubeSizeZ();
                    break;
            default: console.log("EarthServerGenericClient::SceneManager::updateSeparation: Axis with value " +value+ " not known."); return;
        }

        for(var i=0; i< models.length; i++)
        {
            if( models[i].isChildOf === null )
            {
                var slider = document.getElementById("Model"+i+axisSign);

                if(slider)
                    currentSliderValue = $( "#Model"+i+axisSign ).slider( "value" );

                EarthServerGenericClient.MainScene.updateOffset(i,axis,currentSliderValue);
            }
        }
    };

    /**
     * Returns the minimum data value for the given axis.
     * @param axis
     * @returns {*}
     */
    this.getMinimumDataValueForAxis = function(axis)
    {
        var values = {};
        values.min = 0;
        values.max = 1;

        if( models.length === 0) return values;

        if( minDataValue[axis] === undefined)
        {
            values.min = models[0].getMinDataValueAtAxis(axis);
            values.max = values.min;

            for(var i=1; i< models.length; i++)
            {
                if( values.min > models[i].getMinDataValueAtAxis(axis) )
                    values.min = models[i].getMinDataValueAtAxis(axis);

                if( values.max < models[i].getMinDataValueAtAxis(axis) )
                    values.max = models[i].getMinDataValueAtAxis(axis);

            }

            minDataValue[axis] = values;
        }

        return  minDataValue[axis];
    };



    /**
     * Return the separation multiplier for the given model and axis.
     * @param modelIndex - Index of the model.
     * @param axis - Axis.
     * @returns {number}
     */
    this.getSeparationMultiplierForModel = function(modelIndex,axis)
    {
	var value = modelIndex / (this.getModelCount() - 1);
	return value - 0.5;
    };


    this.updateClippingPlane = function(which, value)
    {

        if( clippingPlanes[which] )
        {
            var plane = x3dom.fields.SFVec4f.parse( clippingPlanes[which].getAttribute("plane") );
            clippingPlanes[which].setAttribute("plane", ""+ plane.x +" "+ plane.y +" "+ plane.z +" "+ -1*value);
        }
        else
        {   console.log("EarthServerGenericClient:MainScene:updateClippingPlane: Plane " + which + "is not defined.");    }
    };

    /**
     * Updates the model's number of shown elements/layers.
     * @param moduleIndex - Index of the model
     * @param value - Number of elements
     */
    this.updateMaxShownElements = function(moduleIndex,value)
    {
        if( moduleIndex <models.length && moduleIndex >=0)
            models[moduleIndex].updateMaxShownElements(value);
    };

    /**
     * This changes the scaling of all models on the Y-Axis.
     * @param value - The base elevation is multiplied by this value
     */
    this.updateElevationOfAllModels = function(value)
    {
        globalElevationValue = value;

        for(var i=0; i< models.length; i++)
        {
            this.updateElevation(i,value);
        }
    };

    /**
     * Increases the global elevation by a constant factor.
     */
    this.increaseGlobalElevation = function()
    {
        globalElevationValue++;
        this.updateElevationOfAllModels(globalElevationValue);
    };

    /**
     * Decreases the global elevation by a constant factor.
     */
    this.decreaseGlobalElevation = function()
    {
        if(globalElevationValue > 1) // don't let global elevation value get negative or 0
        {
            globalElevationValue--;
            this.updateElevationOfAllModels(globalElevationValue);
        }
    };

    /**
     * This changes the scaling on the Y-Axis(Elevation).
     * @param modelIndex - Index of the model that should be altered
     * @param value - The base elevation is multiplied by this value
     */
    this.updateElevation = function(modelIndex,value)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+modelIndex);

        if( trans )
        {
            var transValue = trans.getAttribute("scale");
            var oldTrans = transValue.split(" ");

            if( baseElevation[modelIndex] === undefined)
            {
                baseElevation[modelIndex] = oldTrans[1];
            }

            oldTrans[1] = value*baseElevation[modelIndex]/10;

            trans.setAttribute("scale",oldTrans[0] + " " + oldTrans[1] + " " + oldTrans[2]);
            models[modelIndex].elevationUpdateBinding(value);
        }
    };

    /**
     * This changes the scaling on the X-Axis(Width).
     * @param modelIndex - Index of the model that should be altered
     * @param value - The base elevation is multiplied by this value
     */
    this.updateWidth = function(modelIndex,value)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+modelIndex);

        if( trans )
        {
            var oldTrans = trans.getAttribute("scale");
            oldTrans = oldTrans.split(" ");

            if( baseWidth[modelIndex] === undefined)
            {
                baseWidth[modelIndex] = oldTrans[0];
            }

            oldTrans[0] = value*baseWidth[modelIndex]/10;

            trans.setAttribute("scale",oldTrans[0] + " " + oldTrans[1] + " " + oldTrans[2]);
            models[modelIndex].elevationUpdateBinding();
        }
    };

    /**
     * This changes the scaling on the Z-Axis(Length).
     * @param modelIndex - Index of the model that should be altered
     * @param value - The base elevation is multiplied by this value
     */
    this.updateLength = function(modelIndex,value)
    {
        var trans = document.getElementById("EarthServerGenericClient_modelTransform"+modelIndex);

        if( trans )
        {
            var oldTrans = trans.getAttribute("scale");
            oldTrans = oldTrans.split(" ");

            if( baseLength[modelIndex] === undefined)
            {
                baseLength[modelIndex] = oldTrans[2];
            }

            oldTrans[2] = value*baseLength[modelIndex]/10;

            trans.setAttribute("scale",oldTrans[0] + " " + oldTrans[1] + " " + oldTrans[2]);
            models[modelIndex].elevationUpdateBinding();
        }
    };

    /**
     * Updates the model's size for rendering points.
     * @param modelIndex - Index of the model that should be altered
     * @param value - New point size
     */
    this.updatePointSize = function(modelIndex,value)
    {
        if( modelIndex <models.length && modelIndex >=0)
            models[modelIndex].updatePointSize(value);

    };

    /**
     * Returns the minimum value of the models data at the given axis.
     * @param modelIndex - Index of the model
     * @param axis - The queries axis.
     * @returns {number}
     */
    this.getMinDataValueAtAxis = function(modelIndex,axis)
    {
        if(modelIndex >= 0 && modelIndex < models.length)
        {
            return models[modelIndex].getMinDataValueAtAxis(axis);
        }
        else
        {   return 0;   }
    };

    /**
     * Returns the elevation value of a scene model at a specific point in the 3D scene.
     * The point is checked in the current state of the scene with all transformations.
     * @param modelIndex - Index of the model.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height on the y-axis.
     */
    this.getHeightAt3DPosition = function(modelIndex,xPos,zPos)
    {
        if(modelIndex >= 0 && modelIndex < models.length)
        {
            return models[modelIndex].getHeightAt3DPosition(xPos,zPos);
        }
        else
        {   return 0;   }
    };

    /**
     * Returns the dem value of a scene model at a specific point in the 3D scene.
     * @param modelIndex - Index of the model.
     * @param xPos - Position on the x-axis.
     * @param zPos - Position on the z-axis.
     * @returns {number} - The height of the dem.
     */
    this.getDemValueAt3DPosition = function(modelIndex,xPos,zPos)
    {
        if(modelIndex >= 0 && modelIndex < models.length)
        {
            return models[modelIndex].getDemValueAt3DPosition(xPos,zPos);
        }
        else
        {   return 0;   }
    };

    /**
     * Changes the transparency of the Scene Model.
     * @param modelIndex - Index of the model that should be altered
     * @param value - New Transparency between 0-1 (Fully Opaque - Fully Transparent)
     */
    this.updateTransparency = function(modelIndex,value)
    {
        if(modelIndex < models.length)
        {   models[modelIndex].updateTransparency(value);   }
    };

    /**
     * Example function for the onClick event.
     * @param modelIndex - Index of the clicked model.
     * @param hitPoint - Array with the coordinates in screen space.
     */
    this.OnClickFunction = function(modelIndex,hitPoint)
    {
        /*
            Does nothing per default but provide a small example.
            Overwrite this function with custom code.
        */
        //var height = this.getHeightAt3DPosition(modelIndex,hitPoint[0],hitPoint[2]);
        //var height = this.getDemValueAt3DPosition(modelIndex,hitPoint[0],hitPoint[2]);
        //alert(height);
    };

    /**
     * This creates the UI for the Scene.
     * @param domElementID - The dom element where to append the UI.
     */
    this.createUI = function(domElementID)
    {
        this.UIID = domElementID;
        EarthServerGenericClient.createBasicUI(domElementID);
    };

    // init keymapping
    this.initKeyMapping();
};

// Create main scene
EarthServerGenericClient.MainScene = new EarthServerGenericClient.SceneManager();
