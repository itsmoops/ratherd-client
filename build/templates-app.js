angular.module('templates-app', ['landing/partials/landing.tpl.html', 'navigation/partials/navigation.tpl.html', 'rathers/partials/rathers.comparison.tpl.html', 'rathers/partials/rathers.submit.tpl.html', 'rathers/partials/rathers.top.tpl.html']);

angular.module("landing/partials/landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing/partials/landing.tpl.html",
    "<div class=\"col-xs-12 text-center\">\n" +
    "    <h1 class=\"col-xs-12 title\">Would You Rather...</h1>\n" +
    "    <h2 class=\"col-xs-12 banner\">The community-driven game of <strike>difficult</strike> stupid questions</h2>\n" +
    "    <br/><br/>\n" +
    "    <div class=\"col-xs-12 text-center\">\n" +
    "		<a class=\"button landingButton\" ui-sref='play'>\n" +
    "            Play!\n" +
    "        </a>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("navigation/partials/navigation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("navigation/partials/navigation.tpl.html",
    "<div class=\"navbar navbar-inverse\" role=\"navigation\" ng-controller=\"NavBarCtrl\">\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "      <button type=\"button\" class=\"navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"collapse navbar-collapse\" collapse=\"isCollapsed\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "        <li ui-sref-active='active'><a ui-sref='play'>Play</a></li>\n" +
    "        <li ui-sref-active='active'><a ui-sref='top'>Most Rather'd</a></li>\n" +
    "        <li ui-sref-active='active'><a ui-sref='submit'>Submit a Rather!</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("rathers/partials/rathers.comparison.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("rathers/partials/rathers.comparison.tpl.html",
    "<div class=\"col-lg-12 text-center\">\n" +
    "    <h1 class=\"title\">Would You Rather...</h1>\n" +
    "    <div class=\"col-lg-12 rather-row\">\n" +
    "        <div class=\"col-lg-1\">\n" +
    "        </div>\n" +
    "        <div ng-click=\"vote('0')\" class=\"col-lg-4 col-md-5 defaultPanel ratherPanel\">\n" +
    "            <a>{{comparison[0].rather_text}}</a>\n" +
    "            <!-- </br>\n" +
    "            <a>{{comparison[0].ratio | number:2}}</a> -->\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-2 col-md-2 orPanel\">\n" +
    "            <h2>OR</h2>\n" +
    "        </div>\n" +
    "        <div ng-click=\"vote('1')\" class=\"col-lg-4 col-md-5 defaultPanel ratherPanel\">\n" +
    "            <a>{{comparison[1].rather_text}}</a>\n" +
    "            <!-- </br>\n" +
    "            <a>{{comparison[1].ratio | number:2}}</a> -->\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-1\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("rathers/partials/rathers.submit.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("rathers/partials/rathers.submit.tpl.html",
    "<div class=\"col-lg-12\">\n" +
    "	<div class=\"col-md-3 col-xs-2\"></div>\n" +
    "	<div class=\"col-md-6 col-xs-8 defaultPanel submitPanel\">\n" +
    "		<p class=\"panelHeader\">Submit a Rather!</p>\n" +
    "		<hr/>\n" +
    "		<p>Would you rather</p>\n" +
    "		<input type=\"text\" class=\"submitTextBox\" ng-model='rather.rather_text'></input>\n" +
    "		<!-- <br/><br/>\n" +
    "		<p>or</p>\n" +
    "		<input type=\"text\" class=\"submitTextBox\" ng-model='rather.rather_text'></input> -->\n" +
    "		<p id=\"blankSubmitError\" ng-class=\"{toggle: errorYes}\" class=\"errorNo\">.</p>\n" +
    "		<div class=\"col-lg-12 text-center\">\n" +
    "			<a class=\"button\" ng-click='create()'>\n" +
    "            	Submit!\n" +
    "        	</a>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"col-md-3 col-xs-2\"></div>\n" +
    "</div>");
}]);

angular.module("rathers/partials/rathers.top.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("rathers/partials/rathers.top.tpl.html",
    "<div class=\"col-lg-12\">\n" +
    "	<div class=\"col-lg-2 col-md-1\"></div>\n" +
    "	<div class=\"col-lg-8 col-md-10 defaultPanel rankPanel\">\n" +
    "		<p class=\"panelHeader topHeader\">Top 10 Most Rather'd</p>\n" +
    "		<hr/><!-- \n" +
    "		<pre>Sorting by = {{predicate}}; reverse = {{reverse}}</pre>\n" +
    "		<select ng-model=\"ranked\" ng-change=\"order('id')\">\n" +
    "		  <option value=\"-ratio\">Best Win Percentage</option>\n" +
    "		  <option value=\"ratio\">Worst Win Percentage</option>\n" +
    "		  <option value=\"-wins\">Most Wins Total</option>\n" +
    "		  <option value=\"-losses\">Most Losses Total</option>\n" +
    "		</select> -->\n" +
    "		<div class=\"text-center\">\n" +
    "			<a id=\"defaultActive\" href=\"\" class=\"filterBy\" ng-click=\"order('-ratio')\">Biggest Winner</a> |\n" +
    "			<a href=\"\" class=\"filterBy\" ng-click=\"order('ratio')\">Biggest Loser</a> |\n" +
    "			<a href=\"\" class=\"filterBy\" ng-click=\"order('-wins')\">Most Wins Total</a> |\n" +
    "			<a href=\"\" class=\"filterBy\" ng-click=\"order('-losses')\">Most Losses Total</a>\n" +
    "		</div>\n" +
    "\n" +
    "		<!-- repeater -->\n" +
    "		<div class=\"ratherLists\" ng-repeat=\"item in ranked | orderBy:predicate | limitTo:10\">\n" +
    "			<div class=\"col-xs-12 orderedRather\">\n" +
    "				<div class=\"col-xs-1 text-right\">{{$index + 1}}.</div>\n" +
    "				<div class=\"col-xs-8\">{{item.rather_text}}</div>\n" +
    "				<div class=\"col-xs-1\">{{ item.wins }} </div>\n" +
    "				<div class=\"col-xs-1\">{{ item.losses }} </div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"col-lg-2 col-md-1\"></div>\n" +
    "</div>");
}]);
