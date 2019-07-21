<script>
	import {originUrl} from "../config";

	export let file;
	$: fileUrl = originUrl + "/api/data/download/" + file.id;
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<p><a href={fileUrl}>{file.name}</a></p>


