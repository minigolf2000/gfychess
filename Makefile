lint:
	npm run tslint -c tslint.json 'app/**/*.ts*'

deploy:
	npm run build
	scp index.html gfychess.css dist/bundle-gfychess.js favicon.ico golfsinteppadon.com:/var/www/gfychess.com

deploy-images:
	ssh golfsinteppadon.com "mkdir -p /var/www/gfychess.com/public"
	scp public/* golfsinteppadon.com:/var/www/gfychess.com/public
